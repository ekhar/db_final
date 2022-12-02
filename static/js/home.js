// --- Begin Example JS --------------------------------------------------------
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var user = sessionStorage.getItem("account")
if (user == null) {
  window.location.href = "./login.html";
}

async function remove_favorite() {

  let url = 'http://127.0.0.1:5000/api/remove_favorite';
  let data = { 'username': sessionStorage.getItem("account"), id: id };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}

async function delete_opening() {

  let url = 'http://127.0.0.1:5000/api/delete_custom';
  let data = { 'username': sessionStorage.getItem("account"), "pgn": game.pgn() };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}
async function create_opening() {

  let url = 'http://127.0.0.1:5000/api/create_custom_opening';
  let data = { 'username': sessionStorage.getItem("account"), "id": Date.now() % 1000000, "pgn": game.pgn() };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}
async function set_favorite() {

  let url = 'http://127.0.0.1:5000/api/set_favorite';
  let data = { 'username': sessionStorage.getItem("account"), "id": id };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}
async function get_annotation() {

  let url = 'http://127.0.0.1:5000/api/get_annotation';
  let data = { 'username': sessionStorage.getItem("account"), "pgn": game.pgn() };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}
async function get_children() {

  let url = 'http://127.0.0.1:5000/api/children';
  let data = { 'username': sessionStorage.getItem("account"), "id": id };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}

async function get_favorites() {

  let url = 'http://127.0.0.1:5000/api/favorites';
  let data = { 'username': sessionStorage.getItem("account") };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}
async function id_op_postRequest(id) {

  let url = 'http://127.0.0.1:5000/api/op_infoid';
  let data = { 'id': id };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}

async function check_custom() {

  let url = 'http://127.0.0.1:5000/api/search_custom';
  let data = { 'username': sessionStorage.getItem("account"), 'pgn': game.pgn() };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret.data

  } else {
    return false;
  }
}
async function op_postRequest() {

  let url = 'http://127.0.0.1:5000/api/op_info';
  let data = { 'pgn': game.pgn() };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    let ret = await res.json();
    return ret

  } else {
    return false;
  }
}

async function make_annotation(annotation) {

  let url = 'http://127.0.0.1:5000/api/annotate';
  let data = { 'username': sessionStorage.getItem('account'), 'pgn': game.pgn(), "annotation": annotation };

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'access-control-allow-origin': "*",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {

    // let text = await res.text();
    // return text;

    let ret = await res.json();
    return JSON.parse(ret.data);

  } else {
    alert("big problems")
    return false;
  }
}
async function friends(friend) {
  x = await make_friend(friend).data
  console.log(x)
  if (await make_friend(friend)) {
    alert("Friend Made")
  }
  else {
    alert("Friend not made")
  }
}
//postdoRequest().then(data => {
//  console.log(data);
//});

var id = 0
var board = null
var game = new Chess()
var $status = $('#status')
var $custom = $('#custom')
var $custom_check = $('#custom_check')
var $del_custom = $('#del_custom')
var $fen = $('#fen')
var $pgn = $('#pgn')
var $name = $('#name')
var $in_database = $('#in_database')
var $annotation = $('#annotation')
var $favorited = $('#favorited')
var $continuations = $('#continuations')

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

async function updateStatus() {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }
  in_db = false
  res = await op_postRequest()

  if (res["0"] != null) {

    $name.html(res["0"][2])
    id = res["0"][0]
    $in_database.html(true)
    in_db = true
  }
  else {
    $in_database.html("No")
    id = -1
  }
  $favorited.html("No")
  res = await get_favorites()
  res.forEach(function(x) {
    if (x[1] == id) {
      $favorited.html(true)
    }
  }
  )

  $continuations.html("")
  test = await get_children()
  //correct the continuations bug
  if (test.data == false) {
    ;
  }
  else {
    found_1 = false
    test.forEach(async function(x) {
      //all of x are id's
      y = await id_op_postRequest(x[1])
      name = y["0"][2]
      found_1 = true

      $continuations.html($continuations.html() + name + ", ")
    })
  }
  is_cust = await check_custom()
  if (is_cust) {
    $custom_check.html(is_cust)
  }
  else {
    $custom_check.html("Nope")
  }
  x = await get_annotation()
  if (x.data == false) {
    $annotation.html("None")
  }
  else {
    $annotation.html(x["0"][2])
  }
  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}
//reach out to db

var fav = document.getElementById("favorite");

fav.addEventListener("click", async function(e) {
  res = await get_favorites()
  found = false
  res.forEach(function(x) {
    if (x[1] == id) {
      found = true
      $favorited.html("No")
      remove_favorite()
    }
  })
  if (!found) {
    set_favorite()
    $favorited.html(true)
  }
}, false);

custom.addEventListener("click", async function(e) {
  x = await create_opening()
}, false);
del_custom.addEventListener("click", async function(e) {
  x = await delete_opening()
}, false);

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

document.getElementById("annotate").addEventListener("submit", function(e) {
  e.preventDefault()
  annotation = $("#annotate").serializeArray()[0]['value']
  make_annotation(annotation)
  console.log(annotation)
  //getData(e.target);
});

updateStatus()
// --- End Example JS ----------------------------------------------------------
