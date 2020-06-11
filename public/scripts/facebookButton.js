const finished_rendering = function() {
  console.log("finished rendering plugins");
  var spinner = document.getElementById("spinner");
  spinner.classList.remove("facebookButton");
  spinner.removeChild(spinner.childNodes[0]); // to remove spinner child "loading"
}

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
  if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    facebookAPI(response);  
  } else {                                 // Not logged into your webpage or we are unable to tell.
  }
}


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}


window.fbAsyncInit = function() {
  FB.init({
    appId      : '274220913756284',
    cookie     : true,
    xfbml      : true,
    version    : 'v7.0'
  });
  
  FB.Event.subscribe('xfbml.render', finished_rendering);
  FB.AppEvents.logPageView();
  checkLoginState();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

function facebookAPI(response) {
  FB.api('/me?fields=name, id, email', function(response) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/auth/facebook', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      location.replace(xhr.responseURL);
    }
    xhr.send(JSON.stringify(response))
  });

}
