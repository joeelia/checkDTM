const puppeteer = require('puppeteer');
const { convertArrayToCSV } = require('convert-array-to-csv');
var fs = require('fs');

let dtmUrls = ['https://www.ford.com','https://ford.com.cn', 'https://owner.ford.com','https://google.com/'];
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    for (let i = 0; i < dtmUrls.length; i ++) {
        await page.goto(dtmUrls[i], { waitUntil: "load" });

    // get dtm details
    let dtmData = await page.evaluate(() => {
        let dtmArr = [];
        // get dtm data
            let dtmJson = {};
            var MyDate = new Date();
            MyDate.setDate(MyDate.getDate() + 20);
            var MyDateString = MyDate.getFullYear()+''+
            ('0' + (MyDate.getMonth()+1)).slice(-2)+''+
            ('0' + MyDate.getDate()).slice(-2);
             try {
                dtmJson.url = document.URL;
                dtmJson.hasDtm = window._satellite.initialized;
                dtmJson.timestamp = MyDateString ;
            }
            catch (exception){
                dtmJson.hasDtm = 'false';
                dtmJson.timestamp = MyDateString;
            }
            dtmArr.push(dtmJson);

        return dtmArr;
    });
    console.dir(dtmData);
    const csvFromArrayOfObjects = convertArrayToCSV(dtmData);
   //check is hasDTM exists
        try {
            if (fs.existsSync('hasDTM.csv')) {
            //append results without headers
            var appendStr = csvFromArrayOfObjects.substring(csvFromArrayOfObjects.indexOf("\n") + 1);
                fs.appendFile('hasDTM.csv', appendStr, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            } else {
                fs.writeFile('hasDTM.csv', csvFromArrayOfObjects, function(err) {
                    if (err) throw err;
                  });
            }
        } catch(err) {
            console.error(err)
        }
    
    }
})();