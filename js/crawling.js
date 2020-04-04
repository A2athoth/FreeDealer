// 본격적인 내용 크롤링

const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
let _lang;
let _url = 'https://store.steampowered.com/app/546560/HalfLife_Alyx/';
if (_url.charAt(_url.length-1) === '/'){_url = _url.slice(0,-1);}   // 경로 끝에 /가 있으면 떼기

// _lang = '/?l=english';
// _lang = '/?l=japanese';
_lang = '/?l=koreana';

const getHtml = async () => {
    try {
        return await axios.get(
            _url+_lang);
    } catch (error) {
        console.error(error);
    }
};

getHtml()
    .then(html => {
        let gameInfo = [];
        let _tagContain = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.responsive_page_content");

        $bodyList.each(function(i, elem) {

            // $(this).find('div.glance_tags.popular_tags').children('a.app_tag').each(function(i, elem2){
            //     _tagContain[i] = elem2.text();
            // });

            gameInfo[i] = {
                title: $(this).find('div.apphub_AppName').text(),
                url: 'test',
                image_url: $(this).find('img.game_header_image_full').attr('src'),
                description: $(this).find('div.game_description_snippet').text(),
                recentReview: $(this).find('div.user_reviews_summary_row:first-child span.game_review_summary').text(),
                totalReview: $(this).find('div.user_reviews_summary_row:nth-child(2) span.game_review_summary').text(),
                releaseDate: $(this).find('div.release_date .date').text(),
                // tag: _tagContain
            };
        });

        // const data = ulList.filter(n => n.title);
        return gameInfo;
    })
    .then(res => log(res));
