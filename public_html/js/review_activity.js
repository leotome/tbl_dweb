'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        let Activity_PK = this.getURLParameter('activity');
        
        this.doGetActivity(Activity_PK);
        this.doGetQuestions(Activity_PK);
    });

})(jQuery);


function doGetActivity(Activity_PK){
    let request_url = getAPIURI() + `activities/${Activity_PK}`;
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

        let Activity = result.Activity;
        let ActivityDoneStudent = result.ActivityDoneStudent;

        let tbl_activity_name = document.getElementById("tbl_activity_name");
        tbl_activity_name.innerHTML = Activity[0].Title;
        let tbl_activity_description = document.getElementById("tbl_activity_description");
        tbl_activity_description.innerHTML = Activity[0].Description;
        let tbl_activity_header = document.getElementById("tbl_activity_header");
        tbl_activity_header.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + Activity[0].ImagePath + ')';
        document.title = Activity[0].Title + ' | Team-based Learning';

        if(ActivityDoneStudent.filter(({IsLoggedUser}) => IsLoggedUser == 1).length == 0 && Activity[0].Type_FK == 1){
            alert('This activity has not been completed yet, therefore this functionality is not available. Please try again after completing the activity.');
            let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
            window.open(returnUrl, "_self");
            return;
        } else if(ActivityDoneStudent.length == 0 && Activity[0].Type_FK == 2) {
            alert('This activity has not been completed yet, therefore this functionality is not available. Please try again after completing the activity.');
            let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
            window.open(returnUrl, "_self");
            return;
        }

        if(Activity[0].Type_FK == 1 && ActivityDoneStudent.length > 0){
            let UserActivity = ActivityDoneStudent.filter(({IsLoggedUser}) => IsLoggedUser == 1)[0];
            let message = `You got ${UserActivity.TotalScore} points for this activity`
            tbl_activity_description.innerHTML = '<p><b>' + message + '</b></p><br/>' + Activity[0].Description;
        } else if(Activity[0].Type_FK == 2 && ActivityDoneStudent.length > 0) {
            let GroupActivity = ActivityDoneStudent[0];
            let message = `The group got ${GroupActivity.TotalScore} points for this activity`
            tbl_activity_description.innerHTML = '<p><b>' + message + '</b></p><br/>' + Activity[0].Description;
        }        
    })
    .catch(async (error) => {
        console.log('', JSON.stringify(error));
        alert('An unknown error occurred. Please contact support, or try again later.');
    })
}

function doGetQuestions(Activity_PK){
    let request_url = getAPIURI() + `activities/questions/${Activity_PK}/answered`;
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
        let container_start = '<div class="row"><div class="col-lg-12">';
        let container_end = '</div></div>';
        let question_header_template = '<p><b>Question #{0}: {1}</b><br/><i>You\'ve got {2} points</i></p>';
        let question_lineitem_template = '<input type="radio" id="question_{0}_{1}" name="question_{2}" value="{3}" disabled {4}><label for="question_{6}_{7}">&nbsp;{8}</label><br>';
        let allQuestions = '';
        result.forEach((question, index) => {
            let newCounter = index + 1;
            allQuestions += container_start;
            allQuestions += question_header_template.replace('{0}', newCounter).replace('{1}', question.Statement.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")).replace('{2}', question.Score);
            Object.keys(question).forEach(key => {
                if((key.includes('Answer') == true) && (key.includes('Score') == false) && (key.includes('User') == false) && (question[key] != null)){
                    allQuestions += question_lineitem_template.replace('{0}', question.Question_PK)
                                                              .replace('{2}', question.Question_PK)
                                                              .replace('{6}', question.Question_PK)
                                                              .replace('{1}', key)
                                                              .replace('{3}', key)
                                                              .replace('{7}', key)
                                                              .replace('{8}', ((question.UserAnswer == key) ? '<i class="fa fa-check" style="color: green;"></i>&nbsp;' : '') + question[key].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"))
                                                              .replace('{4}', (question.UserAnswer == key) ? 'checked' : '');
                }
            })
            allQuestions += container_end;
        })
        let tbl_activity_items = document.getElementById("tbl_activity_items");
        tbl_activity_items.innerHTML = allQuestions;
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })    

}