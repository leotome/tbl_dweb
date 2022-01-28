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
        let cardTemplate = '<div class="col-lg-3 col-md-4 col-sm-6"><div class="featured__item"><a href="{1}"><div class="featured__item__pic" style="{0}"></div><div class="featured__item__text"><h6>{2}</h6></div></a></div></div>';
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