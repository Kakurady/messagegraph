//popup.js
//Page Action popup

//Message Graph extension
//Copyright 2012 Kakurady
//See COPYING.txt for details

    function run(){
        chrome.extension.sendMessage({type:"getdata"}, function(response){
        
            fa = JSON.parse(response);
            console.log(fa);

            dates = [];
            data = [[], []];

            fa.forEach(function (x){
                dates.push(new Date(x.date));
                data[1].push(x.count.total);
                data[0].push(x.count.total + x.removed.total);
            });
                    
            // Creates canvas 640 × 480 at 10, 50
            var r = Raphael(document.body, 512, 320, 0, 0);
            // Creates pie chart at with center at 320, 200,
            // radius 100 and data: [55, 20, 13, 32, 5, 1, 2]
            //r.piechart(320, 240, 100, [55, 20, 13, 32, 5, 1, 2]);
            r.linechart(0,0,512,320, dates,data,{"axis":"0 0 1 1", gutter: 32});

            p = document.createElement("p");
            p.innerHTML = response;
            document.body.appendChild(p);
        });
    }

    run();
