const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.bankmega.com/promolainnya.php';

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.promolain').each((i, el) => {
            const title = $(el)
                .find('li');

            console.log(title)
        });

        console.log('Scraping Done...');
    }
});