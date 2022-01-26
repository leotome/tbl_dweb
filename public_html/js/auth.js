function getAPIURI(){
    var currentPort = (window.location.port == '' || window.location.port == 0) ? '' : ':' + window.location.port;
    var currentProtocol = window.location.protocol;
    var currentHost = window.location.hostname;
    var URI = currentProtocol + '//' + currentHost + currentPort + '/services/v1.0/';
    return URI;
}            

function doLogin(){
    let email = document.getElementById("login_email").value;
    let password = document.getElementById("login_password").value;
    if(email == ''){
        alert('Please provide an e-mail.');
        return;
    }
    if(password == ''){
        alert('Please provide a password.');
        return;
    }
    let User = {
        Email : email,
        Password : password
    }
    let request_url = this.getAPIURI() + 'users/login';
    let request_params = {
        headers: {
            "Content-Type": "application/json",
        },
        method : "POST",
        body : JSON.stringify(User)
    }
    fetch(request_url, request_params)
    .then(async (response) => {
        var result = await response.json();
        if(result.message){
            alert(result.message);
        }
        console.log('doLogin().result', result);
    })
    .catch(async (error) => {
        alert('doLogin().error = ' + JSON.stringify(error));
    }) 
}