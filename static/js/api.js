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
  for (i = 1; i < s.length; i += 1) {
    if ((i - 1) % 4 === 0) {
      ret += s[i] + " "
    }
  }
  ret = ret.substring(0, ret.length - 2)
  return ret
}
//n y n n y n n y n n y
//0 1 2 3 4 5 6 7 8 9 10
var games = []

async function doit(username, year, month) {
  await fetch('https://api.chess.com/pub/player/ekhar02/games/2022/10')
    .then((response) => response.json())
    .then((data) => games = data.games);
  for (x = 0; x < 5; x += 1) {
    console.log(pgn_read(games[x].pgn))
  }
}

var $username = $('#username')
var $month = $('#month')
var $year = $('#year')
doit()
