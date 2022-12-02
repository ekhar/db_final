import flask
import json
import mariadb
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# configuration used to connect to MariaDB
config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '9789',
    'database': 'Chess'
}
def moves_correct(s):
    s = s.split()
    ret = []
    for count,i in enumerate(s):
        if count == 0 or count%3 == 0:
            pass
        else:
            ret.append(i)

    return ret
#NOT IMPLEMENTED
def stockfish(pgn):
    pass

@app.route('/api/add_friend', methods=['POST'])
@cross_origin()
def add_friend():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    query = "Select * From Account where Username = '{}'".format(request_data["friend"])
    cur.execute(query)
    data = cur.fetchall()
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    
    query1 = "Insert into UserFriend (Username,Friend) values ('{}','{}')".format(request_data["username"],request_data["friend"])
    cur.execute(query1)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 


@app.route('/api/annotate', methods=['POST'])
@cross_origin()
def annotate():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Select * From Annotated where Username = '{}' and PGN = '{}'".format(request_data["username"], pgn)
    cur.execute(query)
    data = cur.fetchall()
    if len(data) == 0:
        query = "Insert into Annotated (Username,PGN,Annotation) values ('{}','{}', '{}')".format(request_data["username"],pgn,request_data["annotation"])
        cur.execute(query)
        conn.commit()
    else:
        query = "Update Annotated set Annotation = '{}' Where Username = '{}' and PGN = '{}'".format(request_data["annotation"],request_data["username"], pgn)
        cur.execute(query)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

@app.route('/api/get_annotation', methods=['POST'])
@cross_origin()
def get_annotation():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Select * From Annotated where Username = '{}' and PGN = '{}'".format(request_data["username"],pgn)
    cur.execute(query)
    data = cur.fetchall()
    conn.close()
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify(data) 


#NOT IMPLEMENTED
@app.route('/api/TheoryLimit', methods=['POST'])
@cross_origin()
def stockfish_analyze():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    query = "Select * from ImportedGame"
    cur.execute(query)
    data = cur.fetchall()
    games = stockfish(data)
    query1 = "Insert into TheoryLimit(Username,OpeningID,Reviewd, PGN) values ('{}','{}', false, '{}')".format(games["username"],games["id"],games["pgn"])
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

@app.route('/api/imported_opening', methods=['POST'])
@cross_origin()
def imported_opening():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Insert into CustomOpening (Username,OpeningID,PGN) values ('{}','{}', '{}')".format(request_data["username"],request_data["id"],pgn)
    query1 = "Insert into ImportedGame (Username,OpeningID,PGN) values ('{}','{}', '{}')".format(request_data["username"],request_data["id"],pgn)
    cur.execute(query)
    cur.execute(query1)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

@app.route('/api/delete_custom', methods=['POST'])
@cross_origin()
def delete_custom():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Delete from CustomOpening Where PGN = '{}' and Username = '{}'".format(pgn, request_data["username"])
    cur.execute(query)
    conn.commit()
    conn.close()
    #command
    return flask.jsonify({"data": True}) 

@app.route('/api/search_custom', methods=['POST'])
@cross_origin()
def search_custom():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()

    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Select * from CustomOpening Where PGN = '{}' and Username = '{}'".format(pgn, request_data["username"])
    cur.execute(query)
    data = cur.fetchall()
    conn.commit()
    conn.close()
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify({"data": True}) 

@app.route('/api/create_custom_opening', methods=['POST'])
@cross_origin()
def custom_opening():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))
    query = "Insert into CustomOpening (Username,OpeningID,PGN) values ('{}','{}', '{}')".format(request_data["username"],request_data["id"],pgn)
    cur.execute(query)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

@app.route('/api/children', methods=['POST'])
@cross_origin()
def op_children():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    query = "Select * From OPChildren Where ParentID= '{}'".format(request_data["id"])
    cur.execute(query)
    data = cur.fetchall()
    conn.close()
    print(data)
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify(data) 

@app.route('/api/op_infoid', methods=['POST'])
@cross_origin()
def id_op_infoid():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    id= request_data["id"]

    query = "Select * From Opening Where OpeningID = '{}'".format(id)
    cur.execute(query)
    data = cur.fetchall()
    conn.close()
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify(data) 

@app.route('/api/op_info', methods=['POST'])
@cross_origin()
def op_info():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    pgn = ' '.join(moves_correct(request_data["pgn"]))

    query = "Select * From Opening Where PGN = '{}'".format(pgn)
    cur.execute(query)
    data = cur.fetchall()
    conn.close()
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify(data) 

@app.route('/api/remove_favorite', methods=['POST'])
@cross_origin()
def remove_favorite():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()

    query = "Delete From Favorites Where Username = '{}' and OpeningID = '{}'".format(request_data["username"],request_data["id"])
    cur.execute(query)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

@app.route('/api/set_favorite', methods=['POST'])
@cross_origin()
def set_favorite():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    query = "Insert into Favorites (Username,OpeningID) values ('{}', '{}')".format(request_data["username"],request_data["id"])
    cur.execute(query)
    conn.commit()
    conn.close()
    return flask.jsonify({"data": True}) 

# route to return all children moves 
@app.route('/api/validate_login', methods=['POST'])
@cross_origin()
def validate_user():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    password_hash = str(hash(request_data["password"]))
    query = "Select * From Account where Username = '{}' and Password = '{}'".format(request_data["username"],password_hash)
    cur.execute(query)
    data = cur.fetchall()
    conn.close()
    #command
    if len(data) == 0:
        return flask.jsonify({"data": False}) 
    else:
        return flask.jsonify({"data": True}) 

# route to return all children moves 
@app.route('/api/create_user', methods=['POST'])
@cross_origin()
def create_user():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    password_hash = str(hash(request_data["password"]))
    query = "Insert into Account (Username,Password) values ('{}', '{}')".format(request_data["username"],password_hash)
    cur.execute(query)
    #except:
    #    return flask.jsonify({"data": False}) 
    conn.commit()
    conn.close()
    #command
    return flask.jsonify({"data": True}) 

@app.route('/api/favorites', methods=['POST'])
def favorites():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    request_data = request.get_json()
    query = "Select * from Favorites Where Username = '{}'".format(request_data["username"])
    cur.execute(query)
    data = cur.fetchall()
    #except:
    #    return flask.jsonify({"data": False}) 
    conn.close()
    #command
    return flask.jsonify(data) 

# route to return total number of openings 
@app.route('/api/count', methods=['GET'])
def count():
    conn = mariadb.connect(**config)
    cur = conn.cursor()
    #command
    cur.execute("select count(*) from Opening")
    
    # serialize results into JSON
    #row_headers=[x[0] for x in cur.description]
    rv = cur.fetchall()[0]
    json_data={"total": rv}
    #for result in rv:
    #     json_data.append(dict(zip(row_headers,result)))
    
    # return the results!
    return json.dumps(json_data)

app.run()
