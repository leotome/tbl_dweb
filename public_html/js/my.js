'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        $("#tbl_username").empty().append(localStorage.getItem('tbl_user'));
        this.doGetAssignedCourses();
    });



})(jQuery);


function doGetAssignedCourses(){
    let request_url = this.getAPIURI() + 'courses/assigned';
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
        let cardTemplate = '<div class="featured__item"><div class="featured__item__pic set-bg" data-setbg="{0}"></div><div class="featured__item__text"><h6><a href="course.html?id={1}">{2}</a></h6></div></div>';
        let allCards = '';
        result.forEach(record => {
            allCards += cardTemplate.replace('{0}', record.ImagePath).replace('{1}', record.Course_PK).replace('{2}', record.Name);
        })
        let tbl_courses_container = document.getElementById("tbl_courses_container");
        tbl_courses_container.innerHTML = allCards;

        $('.set-bg').each(function () {
            var bg = $(this).data('setbg');
            console.log(bg)
            $(this).css('background-image', 'url(' + bg + ')');
        });
        
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}