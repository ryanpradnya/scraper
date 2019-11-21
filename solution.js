const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://www.bankmega.com/promolainnya.php';

function getSubcatPromo(urlToScrap) {
    return new Promise((resolve) => {
        request(urlToScrap, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                let subcatPromoTitle = [];
                let subcatUrl = [];
                $('#subcatpromo').find('img').each((i, el) => {
                    let subcatTitle = $(el).attr('title');
                    subcatPromoTitle.push(subcatTitle);
                });

                let text = $('#contentpromolain2').find('script').html()
                let reg = /promolainnya.php(.*?)"/g;
                let regresult;
                while ((regresult = reg.exec(text)) != null) {
                    if (/product=0&subcat=/.test(regresult[1])) {
                        subcatUrl.push(url + regresult[1]);
                    }
                }
                resolve({ subcatPromoTitle, subcatUrl });
            }
        })
    })
}

function getNumberOfPage(urlToGetPage) {
    return new Promise((resolve) => {
        request(urlToGetPage, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                let numberOfPage = [];
                let maxPageTitle = $('.tablepaging').find('a').last().attr('title');
                if (maxPageTitle && maxPageTitle.split(' ').length == 4) {
                    let maxPage = parseInt(maxPageTitle.split(' ')[3], 10);
                    for (let i = 1; i <= maxPage; i++) {
                        numberOfPage.push(i);
                    }
                } else if (maxPageTitle && maxPageTitle.split(' ').length == 2) {
                    numberOfPage.push(1);

                }
                resolve(numberOfPage);
            }
        });
    });
}

function getPageUrl(url, numberOfPage) {
    return new Promise((resolve) => {
        let pageUrl = []
        if (numberOfPage.length > 0) {
            for (let i = 0; i < numberOfPage.length; i++) {
                pageUrl.push(url + '&page=' + numberOfPage[i])
            }
        }
        resolve(pageUrl);
    })
}

let getscrapData = async (urlToScrap) => {
    return new Promise((resolve) => {
        request(urlToScrap, (error, response, html) => {
            if (!error && response.statusCode == 200) {

                const $ = cheerio.load(html);

                let promotion = [];
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
                resolve(promotion);

            }
        });

    });
}


let getDataEveryPage = async (url) => {
    let numberOfPage = await getNumberOfPage(url);
    // console.log('numberOfPage.length', numberOfPage.length + ' ' + url);

    let pageUrl = await getPageUrl(url, numberOfPage);
    let actions = pageUrl.map(getscrapData);
    let results = await Promise.all(actions);

    return Array.prototype.concat.apply([], results);

}

async function setSubcatPromo(url) {
    let subcatPromo = await getSubcatPromo(url);
    let actions = subcatPromo.subcatUrl.map(getDataEveryPage);

    let results = Promise.all(actions);
    let scrapData = {};

    results.then(resultData => {
        for (let i = 0; i < subcatPromo.subcatPromoTitle.length; i++) {
            scrapData[subcatPromo.subcatPromoTitle[i]] = resultData[i];
        }

        let data = JSON.stringify(scrapData, null, 2);
        fs.writeFile('solution.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        })
    });
}


setSubcatPromo(url);



