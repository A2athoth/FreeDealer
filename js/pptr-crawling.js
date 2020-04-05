// 퍼펫티어란걸 써보자
const puppeteer = require("puppeteer");

// 사용시 인위적인 딜레이를 주기위한 함수
function delay( timeout ) {
    return new Promise(( resolve ) => {
        setTimeout( resolve, timeout );
    });
}

puppeteer.launch({
    headless : false	// 헤드리스모드의 사용여부를 묻는다.
    , devtools : false	// 개발자 모드의 사용여부를 묻는다.
}).then(async browser => {

    const page = await browser.newPage();
    await page.goto( "https://store.steampowered.com/app/1085660/Destiny_Guardians/", { waitUntil : "networkidle2" } );

    if (await page.$('#ageYear') !== null) {
        await page.select('#ageYear', '1984');
        await delay(500);
        page.click( "div.agegate_text_container > a" );	// 클릭이벤트를 실행
    }
    await delay(3000);

    const title = await page.waitFor( "div.apphub_AppName" );
    const titleTxt = await page.evaluate( e => e.textContent, title );
    console.log("-. 게임제목 : ", titleTxt);

    const desc = await page.waitFor( "div.game_description_snippet" );
    const descTxt = await page.evaluate( e => e.textContent, desc );
    console.log("-. 게임설명 : ", descTxt);

    if (await page.$("div.user_reviews_summary_row").length > 1) {
        const recentReview = await page.waitFor( "span.game_review_summary:first-child" );
        const recentReviewTxt = await page.evaluate( e => e.textContent, recentReview );
        console.log("-. 최근평가 : ", recentReviewTxt);
    }
    const totalReview = await page.waitFor( "span.game_review_summary[itemprop='description']" );
    const totalReviewTxt = await page.evaluate( e => e.textContent, totalReview );
    console.log("-. 전체평가 : ", totalReviewTxt);

    await delay(500);
    await browser.close();
});
