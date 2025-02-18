// ==UserScript==
// @name         Tesla Inv. Auto Refresh
// @namespace    https://github.com/zipizigi/tesla-inven-ko
// @homepageURL  https://github.com/zipizigi/tesla-inven-ko
// @supportURL   https://github.com/zipizigi/tesla-inven-ko/issues
// @updateURL    https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-autorefresh.js
// @downloadURL  https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-autorefresh.js
// @version      2025-02-19-01
// @description  Tesla 인벤 자동 새로고침
// @author       You
// @match        https://www.tesla.com/ko_KR/inventory/new/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
// ==/UserScript==

/**
Changelog.
- 페이지 이동 안하는 문제 수정.
- 옵션을 선택할 수 있는 기능 추가

**/

(function() {
    'use strict';

    console.log('auto refresh start!');

    const settings = {
        referral: 'hongseok93745',
        model: 'my', // ms, mx, my, m3
        wheel: '', // EIGHTEEN, NINETEEN, TWENTY, TWENTY_ONE
        paint: '', // WHITE, BLACK, BLUE, SILVER, RED
        interior: '', //BLACK, WHITE
    }


    setTimeout(()=>{
        location.reload()
    },5*60*1000)

    autoCheckInven();


    function autoCheckInven(){
        checkInven();
        setInterval(()=>{
            if(new Date().getMinutes() >= 35){
                checkInven()
            }
        }, 5000);
    }
    function checkInven(){
        console.log(`inven check... ${new Date()}`)
        const query = {"query":{"model":settings.model,"condition":"new","options":{},"arrangeby":"Relevance","order":"desc","market":"KR","language":"ko","super_region":"north america","lng":"","lat":"","zip":"","range":0},"offset":0,"count":24,"outsideOffset":0,"outsideSearch":false,"isFalconDeliverySelectionEnabled":false,"version":0}
        const url = 'https://www.tesla.com/inventory/api/v4/inventory-results?query=' + encodeURIComponent(JSON.stringify(query))

        fetch(url)
            .then(response => response.json())
            .then(json => {
            if(json.total_matches_found > 0){
                const result = json.results
                .filter(f=>settings.interior == '' || f.INTERIOR[0].indexOf(settings.interior) >= 0)
                .filter(f=>settings.wheel == '' || f.WHEELS[0] == settings.wheel)
                .filter(f=>settings.paint == '' || f.PAINT[0].indexOf(settings.paint) >= 0)

                if(result.length > 0){
                    const vin = result[0].VIN;
                    location.href = `https://www.tesla.com/ko_KR/${settings.model}/order/${vin}?referral=${settings.referral}&titleStatus=new&redirect=no#payment`;
                }
            }
        })
    }

})();



