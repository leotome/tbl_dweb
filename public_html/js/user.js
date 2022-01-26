'use strict';

(function ($) {

    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        this.doRequestPersonalInformation();
    });    

    $("#info_changepw").on("click", function() {
        let TogglePw = $(this).is(':checked');
        let PwContent = '<p>Password<span>*</span></p><input type="text" id="info_password">';
        let PwPanel = $("#container_info_password");
        PwPanel.empty();
        if(TogglePw == true){
            PwPanel.append(PwContent);
        } else {

        }
    });

})(jQuery);

function doRequestPersonalInformation(){
    let request_url = this.getAPIURI() + 'users/information';
    fetch(request_url)
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
        let info_fname = document.getElementById("info_fname");
        let info_lname = document.getElementById("info_lname");
        let info_phone = document.getElementById("info_phone");
        let info_email = document.getElementById("info_email");
        info_fname.value = result[0].FirstName;
        info_lname.value = result[0].LastName;
        info_phone.value = result[0].Phone;
        info_email.value = result[0].Email;
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

