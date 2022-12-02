// --- Begin Example JS --------------------------------------------------------
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var user = sessionStorage.getItem("account")
if (user == null) {
  window.location.href = "./login.html";
}
function pgn_read(pgn) {
  s = pgn.split("\n")
  s = s[s.length - 2]

  s = s.split(" ")
  ret = ""
  for (i = 1; i < 15 * 4 && i < s.length; i += 1) {
    if ((i - 1) % 4 === 0) {
      ret += s[i] + " "
    }
  }
  ret = ret.substring(0, ret.length - 1)
  return ret
}
//n y n n y n n y n n y
//0 1 2 3 4 5 6 7 8 9 10

async function foo(pgn) {

  let url = 'http://127.0.0.1:5000/api/imported_opening';
  let data = { 'username': username, 'pgn': pgn, 'id': Date.now() % 10000 };

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
    return ret.data;

  } else {
    return false;
  }
}

var games = []

async function doit(username, year, month) {
  username = $("#api").serializeArray()[0]['value']
  month = $("#api").serializeArray()[1]['value']
  year = $("#api").serializeArray()[2]['value']
  url = 'https://api.chess.com/pub/player/' + username + '/games/' + year + '/' + month
  console.log(url)
  await fetch(url)
    .then((response) => response.json())
    .then((data) => games = data.games);
  for (x = 0; x < 5; x += 1) {
    console.log(pgn_read(games[x].pgn))
    foo(pgn_read(games[x].pgn))
  }
}

document.getElementById("api").addEventListener("submit", function(e) {
  e.preventDefault();
  doit()
  //getData(e.target);
});

