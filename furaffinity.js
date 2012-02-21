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

    a = document.getElementsByClassName("alt1");
    for(var i = 0; (b = a[i]) != undefined; i++ ){
        //FIXME only WebKit/Chrome has descendants();?
        c = b.getElementsByTagName("a");
        for (var j = 0; (x = c[j])!= undefined; j++){
            if (x.href){
                if        (x.href.indexOf("/controls/messages/") != -1){
                    total = parseInt(x.innerHTML);
                    if(isNaN(total)){
                        //console.info(["Total messages count (\"", x.innerHTML, "\") is not parsable"].join(""));
                        total = 0;
                    }
                    request.count.total = total;

                } else if (x.href.indexOf("/msg/submissions") != -1){
                    subs = parseInt(x.innerHTML);
                    if(isNaN(subs)){
                        subs = 0;
                    }
                    request.count.subs = subs;
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
    chrome.extension.sendRequest(request);
}
    function countMessages(form, formType, requestType){
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

        form["remove-watches"].addEventListener("click", function(){
            request = {};
            countMessages(form, "watches[]", "watches");
            chrome.extension.sendRequest(request);
        }, false);
        form["remove-submission-comments"].addEventListener("click", function(){
            request = {};
            countMessages(form, "comments-submissions[]", "comments");
            chrome.extension.sendRequest(request);
        }, false);
        form["remove-journal-comments"].addEventListener("click", function(){
            request = {};
            countMessages(form, "comments-journals[]", "comments");
            chrome.extension.sendRequest(request);
        }, false);
        form["remove-favorites"].addEventListener("click", function(){
            request = {};
            countMessages(form, "favorites[]", "favs");
            chrome.extension.sendRequest(request);
        }, false);
        form["remove-journals"].addEventListener("click", function(){
            request = {};
            countMessages(form, "journals[]", "journals");
            chrome.extension.sendRequest(request);
        }, false);
        form["remove-all"].addEventListener("click", function(){
            request = {};
            countMessages(form, "watches[]", "watches");
            countMessages(form, "comments-submissions[]", "comments");
            countMessages(form, "comments-journals[]", "comments");
            countMessages(form, "favorites[]", "favs");
            countMessages(form, "journals[]", "journals");   
            chrome.extension.sendRequest(request);
        }, false);        
    }
    if(document.location.pathname.indexOf("/msg/submissions") != -1){
        
        function countSubmissions(){
            request = {};
            countMessages(document.getElementById("messages-form"),
                          "submissions[]", "subs");
            chrome.extension.sendRequest(request);
        }
        buttons = document.getElementsByClassName("remove-checked");
        for (i = 0; b = buttons[i]; i++){
            b.addEventListener("click", countSubmissions, false);
        }
    }
}
//b.descendants().forEach(function(x){if(x.href){console.log(x.href);}})
