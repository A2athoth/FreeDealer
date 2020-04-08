// 해야할것 : 오류날 여지 체크 후 오류나면 어떻게 할지

// const _target = "https://store.steampowered.com/app/12210/Grand_Theft_Auto_IV_The_Complete_Edition/";
const _target = "https://store.steampowered.com/app/1085660/Destiny_Guardians/";
// const _target = "https://store.steampowered.com/app/952060/RESIDENT_EVIL_3/";
// const _target = "https://store.steampowered.com/app/1089090/ONE_PIECE_PIRATE_WARRIORS_4/";
// const _target = "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/";
const _lang = "koreana";
let _langQp;

// 검색결과는 링크를 늦게 얻으니 나중에 해도 되지만, 여기선 링크를 가지고 시작하니 먼저 연산
if (_target.indexOf("?") === -1) {
    _langQp = "?l="+_lang;  // query param이 없음
} else {
    _langQp = "&l="+_lang;  // 이미 query param이 존재
}

// 퍼펫티어란걸 써보자
const puppeteer = require("puppeteer");

// 사용시 인위적인 딜레이를 주기위한 함수
function delay( timeout ) {
    return new Promise(( resolve ) => {
        setTimeout( resolve, timeout );
    });
}

puppeteer.launch({
    headless : false	// 헤드리스모드의 사용여부를 묻는다
    , devtools : false	// 브라우저의 개발자 모드의 오픈 여부를 묻는다
    , defaultViewport : { width : 1024, height : 768 }	// 실행될 브라우저의 화면 크기를 지정한다.
    // , args : [ "about:blank" ]
    // , executablePath : puppeteer.executablePath()	// 실행할 chromium 기반의 브라우저의 실행 경로를 지정한다.
    // , ignoreDefaultArgs : false	// 배열이 주어진 경우 지정된 기본 인수를 필터링한다.(중요 : true사용금지)
    // , timeout : 30000	// 브라우저 인스턴스가 시작될 때까지 대기하는 시간(밀리 초)
}).then(async browser => {

    const page = await browser.newPage();
    await page.goto( _target, { waitUntil : "networkidle2" } );

    // 나이 체크하는 페이지 도달시 발동
    if (await page.$('#ageYear') !== null) {
        await page.select('#ageYear', '1984');
        await delay(200);
        page.click( "div.agegate_text_container > a" );	// 클릭이벤트를 실행
    }

    await delay(500);
    await page.goto( _target+_langQp, { waitUntil : "networkidle2" } );
    await delay(1000);

    const title = await page.waitFor( "div.apphub_AppName" );
    const titleTxt = await page.evaluate( e => e.textContent, title );
    console.log("- 게임제목 :", titleTxt);

    const desc = await page.waitFor( "div.game_description_snippet" );
    const descTxt = await page.evaluate( e => e.textContent, desc );
    console.log("- 게임설명 :", descTxt.trim());    // trim메소드로 앞뒤 공백 제거

    // 두번째 저 클래스를 가진 애가 있으면 발동
    if (await page.$("div.user_reviews_summary_row:nth-child(2)") !== null) {
        const recentReview = await page.waitFor( "span.game_review_summary:first-child" );
        const recentReviewTxt = await page.evaluate( e => e.textContent, recentReview );
        console.log("- 최근평가 :", recentReviewTxt);
    }
    const totalReview = await page.waitFor( "span.game_review_summary[itemprop='description']" );
    const totalReviewTxt = await page.evaluate( e => e.textContent, totalReview );
    console.log("- 전체평가 :", totalReviewTxt);

    await delay(100);
    await browser.close();
});
