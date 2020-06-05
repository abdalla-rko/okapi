const sendBtn = document.querySelector('#send');
const xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:5000/auth/google', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
  if (xhr.responseURL) location.replace(xhr.responseURL);

};
xhr.send('idtoken=' + id_token);