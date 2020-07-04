function sendAddRequest(userId) {
  const userid = userId;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/friend/add');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    // location.replace(xhr.responseURL);
  };
  xhr.send('userid=' + userid);
}