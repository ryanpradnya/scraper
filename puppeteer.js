const puppeteer = require('puppeteer');

const url = 'https://www.bankmega.com/promolainnya.php';


(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    // const sub = await page.$eval('#subcatpromo', el => el.innerHTML);
    let fn = (v) => {
        return new Promise(resolve => setTimeout(() => resolve('id: ' + v), 100));
    };
    let getSubcat = await page.evaluate(() => {
        let subcatpromoId = [];
        let subcatpromo = document.querySelector('#subcatpromo');
        let subcatIds = subcatpromo.querySelectorAll('img');

        for (var x = 0; x < subcatIds.length; x++) {
            subcatpromoId.push(subcatIds[x].id);
        }
        return {
            subcatpromoId
        }

    });
    console.log(getSubcat);
    var actions = getSubcat.subcatpromoId.map(fn);

    var results = Promise.all(actions);

    results.then(data =>
        console.log(data)
    );
    // console.log(sub);
    // const imgLength = await imgLists.$$eval('img', el => el.length);
    // const imgs = await imgLists.$$('img');
    // console.log(imgLength);
    // imgs.forEach(async (img) => {
    //     // const data = await (await img.getProperty('innerHTML')).jsonValue();
    //     // console.log(data);
    //     await img.click();
    //     let
    // });

    browser.close()
})()
