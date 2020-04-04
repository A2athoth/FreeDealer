// 스팀에서 게임 리스트 크롤링. - 성공

const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
    try {
        return await axios.get("https://store.steampowered.com/genre/Free%20to%20Play");
    } catch (error) {
        console.error(error);
    }
};

getHtml()
    .then(html => {
        let gameInfo = [];
        let _tagContain = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div#NewReleasesRows").children('a');

        $bodyList.each(function(i, elem) {

            gameInfo[i] = {
                title: $(this).find('div.tab_item_name').text(),
                image_url: $(this).find('div.tab_item_cap img').attr('src'),
            };
        });

        return gameInfo;
    })
    .then(res => log(res));
