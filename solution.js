const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://www.bankmega.com/promolainnya.php';
let resultScrap = {};

function getSubcatPromo(urlToScrap) {
    return new Promise((resolve) => {
        request(urlToScrap, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                let subcatPromoId = [];
                let subcatUrl = [];
                $('#subcatpromo').find('img').each((i, el) => {
                    let subcatId = $(el).attr('id');
                    subcatPromoId.push(subcatId);
                });

                let text = $('#contentpromolain2').find('script').html()
                let reg = /promolainnya.php(.*?)"/g;
                let regresult;
                while ((regresult = reg.exec(text)) != null) {
                    if (/product=0&subcat=/.test(regresult[1])) {
                        subcatUrl.push(url + regresult[1]);

                    }
                }
                resolve({ subcatPromoId, subcatUrl });
            }
        })
    })
}


function scrapData(urlToScrap) {
    return new Promise((resolve) => {
        request(urlToScrap, (error, response, html) => {
            if (!error && response.statusCode == 200) {

                const $ = cheerio.load(html);

                let promotion = [];
                let allpromo = {};
                $('#promolain').find('a').each((i, el) => {
                    const promoDetailUrl = $(el).attr('href');
                    const title = $(el).find('img').attr('title');
                    const imageUrl = $(el).find('img').attr('src');

                    let promo = {
                        title: title,
                        imageUrl: imageUrl,
                        promoDetailUrl: promoDetailUrl
                    }
                    promotion.push(promo);
                });
                console.log('Scraping ' + urlToScrap + ' Done...');
                // allpromo[urlToScrap] = promotion
                resolve(promotion);

            }
        });

    });
}

let fn = async (url) => {
    let resultScrap = await scrapData(url);
    // console.log(url);
    // console.log(resultScrap);
    return {
        [url]: resultScrap
    }

}

async function setSubcatPromo(url) {
    let subcatPromo = await getSubcatPromo(url);
    console.log('subcatPromo: ', subcatPromo);
    let actions = subcatPromo.subcatUrl.map(fn);

    let results = Promise.all(actions);

    results.then(resultData => {

        // console.log(resultData)
        let data = JSON.stringify(resultData, null, 2);
        fs.writeFile('solution.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        })
    }
    );
}


setSubcatPromo(url);



