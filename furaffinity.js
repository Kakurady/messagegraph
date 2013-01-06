//furaffinity.js
//Content script for Fur Affinity

//Message Graph extension
//Copyright 2012 Kakurady
//See COPYING.txt for details

//scan for updated counts
{
    request = {
        "count":{
            "total": 0,
            "subs": 0,
            "comments": 0,
            "journals": 0,
            "favs": 0,
            "watches": 0,
            "notes":    0,
            "tickets":  0}
        }
    date = new Date(document.lastModified);
    if (date.getTime() == 0 || isNaN(date.getTime())){
        date= new Date();
    }
    request.date = date;

    var my_username_element = document.getElementById("my-username");
    var my_username_link = my_username_element && my_username_element.href || "";
    var my_username = my_username_link.slice( 
        my_username_link.indexOf("/user/") + "/user/".length,
        -1
    );
    request.user = my_username;
    
    var i; var j;

    a = document.getElementsByClassName("dropdown-left");
    for(i = 0; (b = a[i]) != undefined; i++ ){
        //FIXME only WebKit/Chrome has descendants();?
        c = b.getElementsByTagName("a");
        for (j = 0; (x = c[j])!= undefined; j++){
            if (x.href){
                if        (x.href.indexOf("/controls/messages/") != -1){
                    total = parseInt(x.innerHTML);
                    if(isNaN(total)){
                        //console.info(["Total messages count (\"", x.innerHTML, "\") is not parsable"].join(""));
                        total = 0;
                    }
                    request.count.total = total;

                } else if (x.href.indexOf("/msg/submissions") != -1){
                    if (x.innerHTML.length - x.innerHTML.lastIndexOf("S") == 1){
                        subs = parseInt(x.innerHTML);

                        if(isNaN(subs)){
                            subs = 0;
                        }
                        request.count.subs = subs;
                    }

                } else if (x.href.indexOf("/msg/others/") != -1){
                    ex = /([0-9]+)([A-Z])/g;
                    while (d = ex.exec(x.innerHTML)){
                        switch (d[2]){
                            case "C": 
                                request.count.comments = parseInt(d[1]);
                                break;
                            case "J": 
                                request.count.journals = parseInt(d[1]);
                                break;
                            case "F": 
                                request.count.favs = parseInt(d[1]);
                                break;
                            case "W": 
                                request.count.watches = parseInt(d[1]);
                                break;
                            default:
                                console.info(["Encountered unknown message type ", d[0], "."].join(""));
                        }
                    }
                    
                } else if (x.href.indexOf("/msg/pms/") != -1){
                    notes = parseInt(x.innerHTML);
                    if(isNaN(notes)){
                        notes = 0;
                    }
                    request.count.notes = notes;
                }// else if (x.href.indexOf("/msg/troubletickets") != -1){
                //}
            }
        }
    };
    if (i != 0 && j != 0){
        chrome.extension.sendMessage(request);
    }
}


    function countMessages(form, formType, requestType){
            request.user = my_username;
            messages = form[formType];
            if (messages){
                if (!request.removed) {request.removed = {}};
                if (!request.removed[requestType]) {request.removed[requestType] = 0;}
                if (messages.length){
                    for(i = 0; x = messages[i]; i++){
                        if (x.checked) {request.removed[requestType]++;}
                    }
                } else if (messages.checked) {request.removed[requestType]++;}
            }
    }    


{
    if(document.location.pathname.indexOf("/msg/others") != -1){

        form = document.getElementById("messages-form");
        if (form){
            if (form["remove-watches"]){
                form["remove-watches"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "watches[]", "watches");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-submission-comments"]){
                form["remove-submission-comments"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "comments-submissions[]", "comments");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-journal-comments"]){
                form["remove-journal-comments"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "comments-journals[]", "comments");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-shouts"]){
                form["remove-shouts"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "shouts[]", "comments");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-favorites"]){
                form["remove-favorites"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "favorites[]", "favs");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-journals"]){
                form["remove-journals"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "journals[]", "journals");
                    chrome.extension.sendMessage(request);
                }, false);
            }
            if (form["remove-all"]){
                form["remove-all"].addEventListener("click", function(){
                    request = {};
                    countMessages(form, "watches[]", "watches");
                    countMessages(form, "comments-submissions[]", "comments");
                    countMessages(form, "comments-journals[]", "comments");
                    countMessages(form, "shouts[]", "comments");
                    countMessages(form, "favorites[]", "favs");
                    countMessages(form, "journals[]", "journals");   
                    chrome.extension.sendMessage(request);
                }, false);        
            }
        }
    }
    if(document.location.pathname.indexOf("/msg/submissions") != -1){
        
        function countSubmissions(){
            request = {};
            countMessages(document.getElementById("messages-form"),
                          "submissions[]", "subs");
            chrome.extension.sendMessage(request);
        }
        buttons = document.getElementsByClassName("remove-checked");
        for (i = 0; b = buttons[i]; i++){
            b.addEventListener("click", countSubmissions, false);
        }
    }
}
//b.descendants().forEach(function(x){if(x.href){console.log(x.href);}})
