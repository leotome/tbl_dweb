'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        this.doGetUser();
        this.doHandleGetAll();
    });

})(jQuery);

function doGetUser(){
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
        if(result[0].Type_FK != 0){
            console.log('no')
        }
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doHandleGetAll(){
    let endpoints = [
        { endpoint : '/users/all', target_id : 'tbl_students_container' },
        { endpoint : '/courses/all', target_id : 'tbl_courses_container' },
        { endpoint : '/modules/all', target_id : 'tbl_modules_container' },
        { endpoint : '/activities/all', target_id : 'tbl_activities_container' },
        { endpoint : '/questions/all', target_id : 'tbl_questions_container' },
        { endpoint : '/achievements/all', target_id : 'tbl_achievements_container' },
        { endpoint : '/discussions/all', target_id : 'tbl_discussions_container' }
    ]
    endpoints.forEach(item => {
        doGetAll(item.endpoint, item.target_id);
    })
}

function doGetAll(endpoint, target_id){
    let request_url = getAPIURI() + endpoint;
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

        if(result.length > 0){
            let status_text = 'Information retrieved from the server at ' + new Date().toISOString().slice(0, 19).replace('T', ' ');
            let start_section = '<details style="width:100%;"><summary>' + status_text + '</summary>';
            let end_section = '</details>';

            let table_container_start = '<table>';
            let table_header_start = '<thead><tr>'
            let table_header_end = '</tr></thead>'
            let table_body_start = '<tbody>'
            let table_body_end = '</tbody>'
            let table_container_end = '</table>';
            let allHTML = '';
            allHTML += start_section;

            allHTML += table_container_start;
            
            // STEP #1: CREATE HEADER BASED ON JSON KEYS ## START ## //
            allHTML += table_header_start;
            Object.keys(result[0]).forEach(key => {
                allHTML += '<td><b>' + key + '</b></td>';
            })
            allHTML += table_header_end;
            // STEP #1: CREATE HEADER BASED ON JSON KEYS ## START ## //
    
            // STEP #2: POPULATE BODY BASED ON JSON RECORD VALUES ## START ## //
            allHTML += table_body_start;
            result.forEach(record => {
                allHTML += '<tr>';
                Object.keys(record).forEach(key => {
                    let value = String(record[key]);
                    allHTML += '<td class="body-cell">' + value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") + '</td>';
                    
                })  
                allHTML += '</td>';
            })
            allHTML += table_body_end;
            // STEP #2: POPULATE BODY BASED ON JSON RECORD VALUES ## END ## //

            allHTML += table_container_end;
            allHTML += end_section;

            // STEP #3: INJECT HTML INTO BODY ## START ## //
            let target_element = document.getElementById(target_id);
            target_element.innerHTML = allHTML;
            // STEP #3: INJECT HTML INTO BODY ## END ## //
        } else {
            let target_element = document.getElementById(target_id);
            target_element.innerHTML = '<br/><img src="img/illustrations/empty-desert.jpg"/><p>Nothing has been created for this table yet. Try again later!</p><br/>';
        }
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log('endpoint, target_id', endpoint, target_id);
        console.log(JSON.stringify(error));
    })
}