//background.js
//Background script

//Message Graph extension
//Copyright 2012 Kakurady
//See COPYING.txt for details


function loadData(service, user){
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
    var fa = loadData("furaffinity", "Kakurady");

    function makeEntryIfNextDay(callback){
        today = new Date(request.date);
        //convert document.lastModified (in UTC, but using local timezone) to local time.
        //http://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date-with-javascript?lq=1
        today.setTime(today.getTime() - 60000 * today.getTimezoneOffset() );

        if(fa.length > 0){
            //load time for last recorded date and add one day
            next_day = new Date(fa[fa.length-1].date);
            next_day.setHours(0, 0, 0, 0);
            next_day.setDate(next_day.getDate() + 1);
            //TODO .setHours(24, 0, 0, 0); and save one call

            //if a day has not passed yet, we don't need to make a new entry.
            if ( today < next_day ){
                return;
            }
        }

        //if a day has passed or no entry yet, make new entry for today
        midnight = new Date(today);
        midnight.setHours(0, 0, 0, 0);

        callback(midnight);
    }
    
     //TODO: protect against rewinds
    if (request.type == "getdata"){
        sendResponse(JSON.stringify(fa));

    } else if (request.count){

        //TODO: don't convert date needlessly
        makeEntryIfNextDay(function(midnight){
        
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
            
        });

        fa[fa.length-1].count = request.count;
        saveData(fa, "furaffinity", "Kakurady");
        sendResponse("ok");

    } else if (request.removed){
        //TODO: don't convert date needlessly
        //TODO: don't convert date needlessly
        makeEntryIfNextDay(function(midnight){
        
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
            
        });

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
        saveData(fa, "furaffinity", "Kakurady");
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
