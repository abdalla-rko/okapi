function onSuccess(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/auth/google');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    location.replace(xhr.responseURL);
  };
  xhr.send('idtoken=' + id_token);
}

function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}