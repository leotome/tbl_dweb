'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        let token = this.getIsAuthenticated();
        let Course_PK = this.getURLParameter('course');
        console.log(Course_PK);        
        let Module_PK = this.getURLParameter('module');
        console.log(Module_PK);
      
        
        
        this.doGetModule(Course_PK, Module_PK);
        this.doGetActivities(Course_PK, Module_PK);
        this.doGetDiscussions(Course_PK, Module_PK);
    });

    $('#activity_modal').on('show.bs.modal', function (event) {
        var a = $(event.relatedTarget);
        var activity = a.data('activity');
        doGetActivity(activity);
      })
})(jQuery);


function doGetModule(Course_PK, Module_PK){
    let request_url = this.getAPIURI() + `courses/${Course_PK}/modules/${Module_PK}`;
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

        let tbl_module_name = document.getElementById("tbl_module_name");
        tbl_module_name.innerHTML = result.Name;
        let tbl_module_description = document.getElementById("tbl_module_description");
        tbl_module_description.innerHTML = result.Description;
        let tbl_module_header = document.getElementById("tbl_module_header");
        tbl_module_header.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + result.ImagePath + ')';
        document.title = result.Name + ' | Team-based Learning';
        
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doGetActivities(Course_PK, Module_PK){
    let request_url = this.getAPIURI() + `courses/${Course_PK}/modules/${Module_PK}/activities`;
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
        //let cardTemplate = '<div class="row"><div class="col-lg-3 col-md-4 col-sm-6"><div class="featured__item"><div class="featured__item__pic" style="{0}"></div><div class="featured__item__text"><h6><a href="{1}">{2}</a></h6></div></div></div></div>';
        let cardTemplate = '<div class="col-lg-3 col-md-4 col-sm-6"><div class="featured__item"><a href="javascript:void(0);" data-toggle="modal" data-target="#activity_modal" data-activity="{1}"><div class="featured__item__pic" style="{0}"></div><div class="featured__item__text"><h6>{2}</h6></div></a></div></div>';
        let allCards = '';
        result.forEach(record => {
            allCards += cardTemplate.replace('{0}', 'background-image: url(' + record.ImagePath + ')').replace('{1}', record.Activity_PK).replace('{2}', record.Title);
        })
        let tbl_activities_container = document.getElementById("tbl_activities_container");
        tbl_activities_container.innerHTML = allCards;
        
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doGetDiscussions(Course_PK, Module_PK){
    let request_url = getAPIURI() + `courses/${Course_PK}/modules/${Module_PK}/discussions`;
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
        let tbl_discussion_container = document.getElementById("tbl_discussion_container");
        if(result.length > 0){
            let container_start = '<br/><table>';
            let container_item_notOwner = '<tr><td><b>{0}</b><br/><i>{1}</i></td></tr><tr><td style="padding-bottom: 15px;">{2}</td></tr>';
            let container_item_isOwner = '<tr><td><b>{0}</b><br/><i>{1}</i>&nbsp;<a onclick="doDeleteDiscussion({3})"><i class="fa fa-trash"></i></a></td></tr><tr><td style="padding-bottom: 15px;">{2}</td></tr>';
            let container_end = '</table>';
            let allDiscussions = container_start;
            result.forEach(record => {
                if(record.CreatedByIsLogged == true){
                    allDiscussions += container_item_isOwner.replace('{0}', record.CreatedByName).replace('{1}', new Date(record.CreatedDate).toISOString().slice(0, 19).replace('T', ' ')).replace('{2}', record.Body).replace('{3}', record.Discussion_PK);
                } else {
                    allDiscussions += container_item_notOwner.replace('{0}', record.CreatedByName).replace('{1}', new Date(record.CreatedDate).toISOString().slice(0, 19).replace('T', ' ')).replace('{2}', record.Body);
                }
            })
            allDiscussions += container_end;
            tbl_discussion_container.innerHTML = allDiscussions;
        } else {
            let noPosts = '<br/><div class="col-lg-12 text-center"><img src="img/illustrations/empty-desert.jpg"/><p>Nothing has been discussed on this topic yet. Write the first post!</p></div><br/>';
            tbl_discussion_container.innerHTML = noPosts;
        }
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doPostDiscussion(){
    let Course_PK = getURLParameter('course');
    let Module_PK = getURLParameter('module');
    let tbl_discussion_input = document.getElementById("tbl_discussion_input");
    let record = {
        Module_FK : Module_PK,
        Body : tbl_discussion_input.value
    }
    let request_params = {
        headers: {
            "Content-Type": "application/json",
        },
        method : "POST",
        body : JSON.stringify(record)
    }
    let request_url = getAPIURI() + `courses/${Course_PK}/modules/${Module_PK}/discussions/create`;
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
        doGetDiscussions(Course_PK, Module_PK);
        tbl_discussion_input.value = null;
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}

function doDeleteDiscussion(Discussion_PK){
    let Course_PK = getURLParameter('course');
    let Module_PK = getURLParameter('module');
    let request_url = getAPIURI() + `discussions/delete/${Discussion_PK}`;
    let confirmed = confirm('If you proceed, the post will be deleted. Are you sure?');
    if(confirmed){
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
            doGetDiscussions(Course_PK, Module_PK);
        })
        .catch(async (error) => {
            alert('An unknown error occurred. Please contact support, or try again later.');
            console.log(JSON.stringify(error));
        })
    }
}

function doGetActivity(Activity_PK){
    let activity_request_url = getAPIURI() + `/activities/${Activity_PK}`;
    fetch(activity_request_url)
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
        let tbl_modal_activity_header = document.getElementById("tbl_modal_activity_header");
        tbl_modal_activity_header.innerHTML = result[0].Title;
        let tbl_modal_activity_body = document.getElementById("tbl_modal_activity_body");
        tbl_modal_activity_body.innerHTML = result[0].Description.replace(/\r\n/g, "<br/>");

        let tbl_modal_activity_footer_start = document.getElementById("tbl_modal_activity_footer_start");
        let tbl_modal_activity_panel = document.getElementById("tbl_modal_activity_panel");
        tbl_modal_activity_footer_start.disabled = false;
        tbl_modal_activity_panel.innerHTML = null;
        if(result[0].ActivityDoneStudent_PK != null && result[0].Type_FK == 1){
            tbl_modal_activity_footer_start.disabled = true;            
            tbl_modal_activity_panel.innerHTML = '<br/><p><b>You have already submitted this activity.</b></p>';
        } else if(result[0].ActivityDoneStudent_PK != null && result[0].Type_FK == 2) {
            tbl_modal_activity_footer_start.disabled = true;            
            tbl_modal_activity_panel.innerHTML = '<br/><p><b>This activity has already been submitted by a member of your group.</b></p>';
        } else if(result[0].ActivityDoneStudent_PK == null && result[0].Type_FK == 2) {
            let activity_countStudentsAll_request_url = getAPIURI() + `/activities/${result[0].Group_ParentActivity_FK}/countStudentsAll`;
            let activity_countStudentsFinished_request_url = getAPIURI() + `/activities/${result[0].Group_ParentActivity_FK}/countStudentsFinished`;
            fetch(activity_countStudentsAll_request_url)
            .then(async (countAll) => {
                var result_countAll = await countAll.json();
                fetch(activity_countStudentsFinished_request_url)
                .then(async (countFinished) => {
                    var result_countFinished = await countFinished.json();
                    let flat_result_countAll_No_Students = (result_countAll.length > 0) ? result_countAll[0].No_Students : 0;
                    let flat_result_countFinished_No_Students = (result_countFinished.length > 0) ? result_countAll[0].No_Students : -1;
                    if(flat_result_countAll_No_Students > flat_result_countFinished_No_Students){
                        tbl_modal_activity_footer_start.disabled = true;            
                        tbl_modal_activity_panel.innerHTML = '<br/><p><b>The individual activity related to this activity has not yet been completed by all members of your group, and therefore is not yet available. Please try again later.</b></p>';
                    }
                })
                .catch(async (error) => {
                    alert('An unknown error occurred. Please contact support, or try again later.');
                    console.log(JSON.stringify(error));
                })                
            })
            .catch(async (error) => {
                alert('An unknown error occurred. Please contact support, or try again later.');
                console.log(JSON.stringify(error));
            })
        }
    })
    .catch(async (error) => {
        alert('An unknown error occurred. Please contact support, or try again later.');
        console.log(JSON.stringify(error));
    })
}