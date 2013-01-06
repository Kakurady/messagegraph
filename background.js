//background.js
//Background script

//Message Graph extension
//Copyright 2012 Kakurady
//See COPYING.txt for details


function loadData(service, user){
    console.log("loading data for "+user);
    var data;
    
    if (!localStorage.furaffinity){
        data = new Array();
    } else {
        data = JSON.parse(localStorage.furaffinity);
        if (!data.push){
            data = new Array();
        }
    }
    return data;
}

function saveData(data, service, user){
    console.log("saving data for "+user);
    localStorage.furaffinity = JSON.stringify(data);
}

function showPopupAction(obj){
    url = obj.url.toLowerCase();
    tabId = obj.tabId;
    
    if (url.indexOf("furaffinity.net") != -1)
        {
        chrome.pageAction.show(tabId);
//            if (url.indexOf("/msg/others") != -1){
//                chrome.tabs.executeScript(tabId, {file:"furaffinity.messages.js"});
//            } 
    }
}

    

function processRequest (request,sender,sendResponse){
    var fa = loadData("furaffinity", request.user);
    
     //TODO: protect against rewinds
    if (request.type == "getdata"){
        sendResponse(JSON.stringify(fa));

    } else if (request.count){
        //TODO:create new entry if no entry or date passed
        //TODO: don't convert date needlessly
        if(fa.length == 0
            ||
           (new Date(request.date).getTime() - new Date(fa[fa.length-1].date).getTime()) > 86400000
        ){
            midnight = new Date(request.date);
            midnight.setHours(0);
            midnight.setMinutes(0);
            midnight.setSeconds(0);
            midnight.setMilliseconds(0);

            fa.push({
                "date":midnight,
                "count":{},
                "removed": {
                    "total": 0,
                    "subs": 0,
                    "favs": 0,
                    "watches": 0,
                    "comments": 0,
                    "journals": 0,
                    "notes":    0,
                    "tickets":  0
                }
            });
            
        }
        fa[fa.length-1].count = request.count;
        saveData(fa, "furaffinity", request.user);
        sendResponse("ok");

    } else if (request.removed){
        //TODO: don't convert date needlessly
        if(fa.length == 0
            ||
           (new Date(request.date).getTime() - new Date(fa[fa.length-1].date).getTime()) > 86400000
        ){

            midnight = new Date(request.date);
            midnight.setHours(0);
            midnight.setMinutes(0);
            midnight.setSeconds(0);
            midnight.setMilliseconds(0);
            
            fa.push({
                "date":midnight,
                "count":{
                    "total": 0,
                    "subs": 0,
                    "favs": 0,
                    "watches": 0,
                    "comments": 0,
                    "journals": 0,
                    "notes":    0,
                    "tickets":  0},
                "removed": {
                    "total": 0,
                    "subs": 0,
                    "favs": 0,
                    "watches": 0,
                    "comments": 0,
                    "journals": 0,
                    "notes":    0,
                    "tickets":  0
                }
            });

            //copy values for the last day over.
            if (fa.length > 1){
                for (x in fa[fa.length-2].count){
                    fa[fa.length-1].count[x] = fa[fa.length-2].count[x]
                }
            }                        
        }
        if (!request.removed.total){
            total = 0;
            for (x in request.removed){
                total +=request.removed[x];
            }
            request.removed.total = total;
        }
        for (x in request.removed){
            if (!fa[fa.length-1].removed[x]) {
                fa[fa.length-1].removed[x] = 0;
            }
            fa[fa.length-1].removed[x]+=request.removed[x];
        }
        saveData(fa, "furaffinity", request.user);
        sendResponse("ok");
    }
}

chrome.webNavigation.onCommitted.addListener(showPopupAction, 
    {url: [
        {hostSuffix: "www.furaffinity.net"}, 
        {hostSuffix: "sfw.furaffinity.net"}
    ]}
);

chrome.extension.onMessage.addListener(processRequest);
