'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        let Course_PK = this.getURLParameter('id');
        console.log(Course_PK);
      
        
        
        this.doGetCourse(Course_PK);
        this.doGetModules(Course_PK);
    });



})(jQuery);


function doGetCourse(Course_PK){
    let request_url = this.getAPIURI() + 'courses/' + Course_PK;
    fetch(request_url)
    .then(async (response) => {
        var result = await response.json();
        console.log(result)
        var success = response.ok;
        if(result.message && success == false){
            alert(result.message);
            return;
        } else if(success == false){
            alert('An unknown error occurred. Please contact support, or try again later.');
            return;
        }

        let tbl_course_name = document.getElementById("tbl_course_name");       
        tbl_course_name.innerHTML = result.Name;
        let tbl_module_header = document.getElementById("tbl_module_header");
        tbl_module_header.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + result.ImagePath + ')';

        
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doGetModules(Course_PK){
    let request_url = this.getAPIURI() + 'courses/modules/' + Course_PK;
    fetch(request_url)
    .then(async (response) => {
        var result = await response.json();
        console.log(result)
        var success = response.ok;
        if(result.message && success == false){
            alert(result.message);
            return;
        } else if(success == false){
            alert('An unknown error occurred. Please contact support, or try again later.');
            return;
        }

        let cardTemplate = '<div class="col-lg-3 col-md-4 col-sm-6"><div class="featured__item"><div class="featured__item__pic" style="{0}"></div><div class="featured__item__text"><h6><a href="course.html?id={1}">{2}</a></h6></div></div></div>';
        let allCards = '';
        result.forEach(record => {
            allCards += cardTemplate.replace('{0}', 'background-image: url(' + record.ImagePath + ')').replace('{1}', record.Module_PK).replace('{2}', record.Name);
        })
        let tbl_modules_container = document.getElementById("tbl_modules_container");
        tbl_modules_container.innerHTML = allCards;
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}
