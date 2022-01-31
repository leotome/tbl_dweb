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
        var success = response.ok;
        if(result.message && success == false){
            alert(result.message);
            return;
        } else if(success == false){
            alert('An unknown error occurred. Please contact support, or try again later.');
            return;
        }
        console.log('doLogin().result', result);
        localStorage.setItem("tbl_app", result.accessToken);
        localStorage.setItem("tbl_user", result.fullName);
        localStorage.setItem("tbl_student", result.Type_FK);
        let my_page = this.getBaseURI() + 'my.html';
        window.open(my_page, "_self");
    })
    .catch(async (error) => {
        alert('doLogin().error = ' + JSON.stringify(error));
    })
}

function doRegister(){
    let fname = document.getElementById("register_fname").value;
    let lname = document.getElementById("register_lname").value;
    let phone = document.getElementById("register_phone").value;
    let email = document.getElementById("register_email").value;
    let password = document.getElementById("register_password").value;
    if(fname == ''){
        alert('Please provide an First Name.');
        return;
    }    
    if(lname == ''){
        alert('Please provide Last Name.');
        return;
    }    
    if(phone == ''){
        alert('Please provide a phone.');
        return;
    }    
    if(email == ''){
        alert('Please provide an e-mail.');
        return;
    }
    if(password == ''){
        alert('Please provide a password.');
        return;
    }
    let User = {
        FirstName : fname,
        LastName : lname,
        Phone : phone,
        Email : email,
        Password : password
    }
    let request_url = this.getAPIURI() + 'users/register';
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

function doLogout(){
    let request_url = this.getAPIURI() + 'users/logout';
    fetch(request_url)
    .then(async (response) => {
        localStorage.removeItem("tbl_app");
        localStorage.removeItem("tbl_user");
        let home = this.getBaseURI();
        window.open(home, "_self");
    })
    .catch(async (error) => {
        alert('doLogout().error = ' + JSON.stringify(error));
    })
}