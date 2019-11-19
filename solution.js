const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://www.bankmega.com/promolainnya.php';

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {

        const $ = cheerio.load(html);
        let promotion = []
        $('#promolain').find('a').each((i, el) => {
            const promoDetailUrl = $(el).attr('href');
            const title = $(el).find('img').attr('title');
            const imageUrl = $(el).find('img').attr('src');

            console.log(title);
            let promo = {
                title: title,
                imageUrl: imageUrl,
                promoDetailUrl: promoDetailUrl
            }
            promotion.push(promo);
        });
        let data = JSON.stringify(promotion, null, 2);
        fs.writeFile('solution.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        })
        console.log(promotion);

        console.log('Scraping Done...');
    }
});