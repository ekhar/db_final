var user = sessionStorage.getItem("account")
if (user == null) {
  window.location.href = "./login.html";
}

async function make_friend(friend) {

  let url = 'http://127.0.0.1:5000/api/add_friend';
  let data = { 'username': sessionStorage.getItem('account'), 'friend': friend };

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
document.getElementById("friend").addEventListener("submit", function(e) {
  e.preventDefault()
  username = $("#friend").serializeArray()[0]['value']
  friends(username)
  //getData(e.target);
});
