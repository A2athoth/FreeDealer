// 나이제한을 지나가면 언어 query param이 풀린다. 한국어를 클릭하는 이벤트쪽을 함수를 쓰든 퍼펫티어 이벤트를 하든 해야할듯... 그럼 애초에 쿼리파람도 필요없었군...
// 초반 언어 분기를 두고 if나 for문으로 구성해야 할듯


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
    await page.goto( "https://store.steampowered.com/app/12210/Grand_Theft_Auto_IV_The_Complete_Edition/?l=koreana", { waitUntil : "networkidle2" } );

    // 나이 체크하는 페이지 도달시 발동
    if (await page.$('#ageYear') !== null) {
        await page.select('#ageYear', '1984');
        await delay(200);
        page.click( "div.agegate_text_container > a" );	// 클릭이벤트를 실행
    }
    await delay(2000);

    const title = await page.waitFor( "div.apphub_AppName" );
    const titleTxt = await page.evaluate( e => e.textContent, title );
    console.log("-. 게임제목 : ", titleTxt);

    const desc = await page.waitFor( "div.game_description_snippet" );
    const descTxt = await page.evaluate( e => e.textContent, desc );
    console.log("-. 게임설명 : ", descTxt);

    // 두번째 저 클래스를 가진 애가 있으면 발동
    if (await page.$("div.user_reviews_summary_row:nth-child(2)") !== null) {
        const recentReview = await page.waitFor( "span.game_review_summary:first-child" );
        const recentReviewTxt = await page.evaluate( e => e.textContent, recentReview );
        console.log("-. 최근평가 : ", recentReviewTxt);
    }
    const totalReview = await page.waitFor( "span.game_review_summary[itemprop='description']" );
    const totalReviewTxt = await page.evaluate( e => e.textContent, totalReview );
    console.log("-. 전체평가 : ", totalReviewTxt);

    await delay(300);
    await browser.close();
});
