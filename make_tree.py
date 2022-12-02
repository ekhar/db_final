import json
import os
import mariadb
import sys

def common_func(l1,l2):
    ret = 0
    for x,y in zip(l1,l2):
        if x == y:
            ret+=1
        else:
            break
    return ret

def moves_correct(s):
    s = s.split()
    ret = []
    for count,i in enumerate(s):
        if count == 0 or count%3 == 0:
            pass
        else:
            ret.append(i)

    return ret

class Node():
    def __init__(self, pgn, name, id, parent = None):
        self.pgn = pgn
        self.name = name
        self.children = [] 
        self.parent = parent
        self.id = id

class Tree():
    def __init__(self):
        self.head = Node(pgn=["0"], name="Starting Board", id=0)
    
    def insert(self, opening):
        def recur_insert(curr_node, op, unchecked, old_common):
            if len(curr_node.children) == 0:
                op.parent = curr_node
                curr_node.children.append(op)
                return
            else:
                common = 0
                x = -1
                for i,child in enumerate(curr_node.children):
                    common1 = common_func(unchecked,child.pgn)
                    if common1>common:
                        x = i
                        common = common1
                #no progression
                if common == old_common:
                    op.parent = curr_node
                    curr_node.children.append(op)
                    return
                else:
                    recur_insert(curr_node.children[x], op, unchecked, common )

        if len(opening.pgn) == 1:
            self.head.children.append(opening)
            opening.parent = self.head
        else:
            recur_insert(self.head, opening, opening.pgn, 0)
    
    def count(self):
        total = 1
        def rec_count(curr_node):
            nonlocal total
            for child in curr_node.children:
                total +=1
                rec_count(child)

        rec_count(self.head )
        return total

    def add_parent(self, cur, child, parent):
        if child == self.head:
            return
        cur.execute( "INSERT INTO OPParent(ChildID,ParentID) VALUES (?, ?)", (child.id,parent.id))

    def add_child(self, cur, parent, child):
        cur.execute( "INSERT INTO OPChildren (ParentID,ChildID) VALUES (?, ?)", (parent.id,child.id))

    def add_opening(self, cur, op):
        pgn = ' '.join(op.pgn)
        cur.execute( "INSERT INTO Opening (OpeningID, PGN, Name, Custom) VALUES (?, ?, ?, false)", (op.id, pgn, op.name))

    def db_add(self, cur):
        def rec_add(curr_node, cur):
            try:
                self.add_opening(cur, curr_node)
            except:
                print("Tried adding a dup opening")
            self.add_parent(cur, curr_node, curr_node.parent)
            for child in curr_node.children:
                self.add_child(cur, curr_node, child)
                rec_add(child, cur)

        rec_add(self.head, cur)



f = open('./eco.json')
data = json.load(f)

openings = []
count = 0
for x in data:
    count+=1
    openings.append(Node(moves_correct(x["moves"]), x["name"], count))

                
openings.sort(key= lambda x: len(x.pgn))

print("LARGEST SO FAR",len(' '.join(openings[-1].pgn)))


t = Tree()
for op in openings:
    t.insert(op)


try:
    conn = mariadb.connect(
        user="root",
        password="9789",
        host="localhost",
        port=3306,
        database="Chess"

    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)


cur = conn.cursor()
cur.execute("SET FOREIGN_KEY_CHECKS=0;")
t.db_add(cur)
cur.execute("SET FOREIGN_KEY_CHECKS=1;")
conn.commit() 
conn.close()



