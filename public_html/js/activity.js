'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        let Activity_PK = this.getURLParameter('activity');
        console.log(Activity_PK);
      
        
        
        this.doGetActivity(Activity_PK);
        this.doGetQuestions(Activity_PK);
//        this.doGetDiscussions(Course_PK, Module_PK);
    });



})(jQuery);


function doGetActivity(Activity_PK){
    let request_url = getAPIURI() + `/activities/${Activity_PK}`;
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
        console.log(result)
        let tbl_activity_name = document.getElementById("tbl_activity_name");
        tbl_activity_name.innerHTML = result[0].Title;
        let tbl_activity_description = document.getElementById("tbl_activity_description");
        tbl_activity_description.innerHTML = result[0].Description;
        let tbl_activity_header = document.getElementById("tbl_activity_header");
        tbl_activity_header.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + result[0].ImagePath + ')';
        document.title = result[0].Title + ' | Team-based Learning';
        
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doGetQuestions(Activity_PK){
    let request_url = getAPIURI() + `/activities/questions/${Activity_PK}`;
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
        console.log(result);
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })    

}