
async function login_req(username, password) {

  let url = 'http://127.0.0.1:5000/api/validate_login';
  let data = { 'username': username, 'password': password };

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
    alert("login messed up")
    return false;
  }
}


async function create_acc(username, password) {

  let url = 'http://127.0.0.1:5000/api/create_user';
  let data = { 'username': username, 'password': password };

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
    alert("account not created successfully")
    return false;
  }
}

async function login() {
  cb = document.getElementById('login').create;
  username = $("#login").serializeArray()[0]['value']
  password = $("#login").serializeArray()[1]['value']

  if (cb.checked) {
    if (await create_acc(username, password)) {
      alert("Account " + username + " successfully created")
    }
  }
  else {
    console.log(await login_req(username, password))
    if (await login_req(username, password) === true) {
      sessionStorage.setItem("account", username);
      window.location.href = "./home.html";
    }

  }
}
document.getElementById("login").addEventListener("submit", function(e) {
  e.preventDefault();
  login()
  //getData(e.target);
});
