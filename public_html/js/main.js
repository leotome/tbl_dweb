'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        let tbl_app = localStorage.getItem('tbl_app');
        let tbl_student = localStorage.getItem('tbl_student');
        if(tbl_app){
            let logged = `<li><a href="./user.html">${localStorage.getItem('tbl_user')}</a></li><li><a href="#" onclick="doLogout()">Logout</a></li>`;
            let fullmenu = `<li><a href="./my.html">My Courses</a></li>`;
            console.log(tbl_student)
            if(tbl_student == 0){
                fullmenu = `<li><a href="./admin.html">Administrative View</a></li>`;
            }
            $("#tbl_usermenu").empty().append(logged);
            $("#tbl_menu").append(fullmenu);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    $('.product__details__pic__slider img').on('click', function () {

        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

})(jQuery);

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,pt'}, 'google_translate_element');
}