const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://www.bankmega.com/promolainnya.php';

// const allUrl = [
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=1',
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=2',
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=3',
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=4',
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=5',
//     'https://www.bankmega.com/promolainnya.php?product=0&subcat=6'
// ];

function scrapData(urlToCall, callback) {
    request(urlToCall, (error, response, html) => {
        if (!error && response.statusCode == 200) {

            const $ = cheerio.load(html);
            // $('#subcatpromo').find('img').each((i, el) => {
            //     let subcatId = $(el).attr('id');
            //     console.log(subcatId);
            // });

            let promotion = []
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

            console.log('Scraping Done...');
            return callback(promotion);

        }
    });
}

scrapData(url, function (response) {
    let data = JSON.stringify(response, null, 2);
    fs.writeFile('solution.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    })
})

