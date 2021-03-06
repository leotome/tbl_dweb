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

    $(window).on("beforeunload", function(event) {
        if(Global_AllowLeaveBrowser == false){
            event.preventDefault();
            return event.returnValue = "Are you sure you want to exit?";
        }
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

        // A little bit like spaghetti code, but we don't have time for better solutions 

        if(ActivityDoneStudent.filter(({IsLoggedUser}) => IsLoggedUser == 1).length > 0 && Activity[0].Type_FK == 1){
            alert('You have already submitted this activity.');
            Global_AllowLeaveBrowser = true;
            let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
            window.open(returnUrl, "_self");
            return;
        } else if(ActivityDoneStudent.length > 0 && Activity[0].Type_FK == 2) {
            alert('This activity has already been submitted by a member of your group.');
            Global_AllowLeaveBrowser = true;
            let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
            window.open(returnUrl, "_self");
            return;
        } else if(ActivityDoneStudent.length == 0 && Activity[0].Type_FK == 2) {
            let activity_countStudents_request_url = getAPIURI() + `/activities/${Activity[0].Group_ParentActivity_FK}/countStudents`;
            fetch(activity_countStudents_request_url)
            .then(async (countStudents_response) => {
                var countStudents_result = await countStudents_response.json();
                let flat_result_countAll_No_Students = countStudents_result.find(({Type}) => Type == 'AllStudents').No_Students;
                let flat_result_countFinished_No_Students = countStudents_result.find(({Type}) => Type == 'StudentsFinishedActivity').No_Students;
                if(flat_result_countAll_No_Students > flat_result_countFinished_No_Students){
                    alert('The individual activity related to this activity has not yet been completed by all members of your group, and therefore is not yet available. Please try again later.');
                    Global_AllowLeaveBrowser = true;
                    let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
                    window.open(returnUrl, "_self");
                    return;
                }
            })
            .catch(async (error) => {
                alert('An unknown error occurred. Please contact support, or try again later.');
                console.log(JSON.stringify(error));
            })
        }

        let course_request_url = getAPIURI() + 'courses/' + Activity[0].Course_FK;
        fetch(course_request_url)
        .then(async (response_c) => {
            var result_c = await response_c.json();
            console.log(result_c)
            var success = response_c.ok;
            if(result_c.message && success == false){
                alert(result_c.message);
                Global_AllowLeaveBrowser = true;
                let returnUrl = getBaseURI() + `module.html?course=${Activity[0].Course_FK}&module=${Activity[0].Module_FK}`;
                window.open(returnUrl, "_self");
                return;
            }
        })
        .catch(async (error_c) => {
            console.log('course_request_url',JSON.stringify(error_c));
            alert('An unknown error occurred. Please contact support, or try again later.');
        })
    })
    .catch(async (error) => {
        console.log('', JSON.stringify(error));
        alert('An unknown error occurred. Please contact support, or try again later.');
    })
}

let Global_UserChoices = [];
let Global_AllowLeaveBrowser = false;

function doGetQuestions(Activity_PK){
    let request_url = getAPIURI() + `activities/questions/${Activity_PK}`;
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
        let question_header_template = '<p><b>Question #{0}: {1}</b></p>';
        let question_lineitem_template = '<input type="radio" id="question_{0}_{1}" name="question_{2}" value="{3}" onchange="handleAnswer({4}, \'{5}\')"><label for="question_{6}_{7}">&nbsp;{8}</label><br>';
        let allQuestions = '';
        let initUserChoice = [];
        result.forEach((question, index) => {
            let newCounter = index + 1;
            allQuestions += container_start;
            allQuestions += question_header_template.replace('{0}', newCounter).replace('{1}', question.Statement.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
            Object.keys(question).forEach(key => {
                if((key.includes('Answer') == true) && (key.includes('Score') == false) && (question[key] != null)){
                    allQuestions += question_lineitem_template.replace('{0}', question.Question_PK)
                                                              .replace('{2}', question.Question_PK)
                                                              .replace('{4}', question.Question_PK)
                                                              .replace('{6}', question.Question_PK)
                                                              .replace('{1}', key)
                                                              .replace('{3}', key)
                                                              .replace('{5}', key)
                                                              .replace('{7}', key)
                                                              .replace('{8}', question[key].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
                }
            })
            allQuestions += container_end;
            initUserChoice.push({Question_PK : question.Question_PK, UserChoice : null});
        })
        let tbl_activity_items = document.getElementById("tbl_activity_items");
        tbl_activity_items.innerHTML = allQuestions;
        Global_UserChoices = initUserChoice;
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })    

}

function handleAnswer(QuestionPK, UserChoice){
    let answer = {
        Question_PK : QuestionPK,
        UserChoice : UserChoice
    }
    let stored = Global_UserChoices.find(({Question_PK}) => Question_PK == QuestionPK);
    if(stored != null){
        stored.UserChoice = UserChoice;
    } else {
        Global_UserChoices.push(answer);
    }
}

function doSubmitActivity(){
    let Activity_PK = getURLParameter('activity');
    let UserChoices = Global_UserChoices;
    let NotAnswered = UserChoices.filter(({UserChoice}) => UserChoice == null);
    let VR_NotAnsweredProceed = true;
    if(NotAnswered.length > 0){
        let ConfirmSubmitNotAnswered_Label = "You did not answer {0} of the {1} questions in the activity. Are you sure you want to submit?".replace('{0}', NotAnswered.length).replace('{1}', UserChoices.length);
        let ConfirmSubmitNotAnswered = confirm(ConfirmSubmitNotAnswered_Label);
        VR_NotAnsweredProceed = ConfirmSubmitNotAnswered;
    }
    if(VR_NotAnsweredProceed == false){
        return;
    }
    let ConfirmSubmit = confirm('If you proceed, the activity will be submitted. Are you sure?');
    if(ConfirmSubmit){
        Global_AllowLeaveBrowser = true;
        let request_url = getAPIURI() + `activities/${Activity_PK}/submit`;
        let request_params = {
            headers: {
                "Content-Type": "application/json",
            },
            method : "POST",
            body : JSON.stringify(UserChoices)
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
            alert(result.message);
            let returnUrl = getBaseURI() + `module.html?course=${result.activity.Activity[0].Course_FK}&module=${result.activity.Activity[0].Module_FK}`;
            window.open(returnUrl, "_self");
        })
        .catch(async (error) => {
            alert('hre 2' + 'An unknown error occurred. Please contact support, or try again later.');
            console.log(JSON.stringify(error));
        })
    }
}
