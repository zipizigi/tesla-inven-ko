// ==UserScript==
// @name         Tesla Inv. Auto Refresh
// @namespace    https://github.com/zipizigi/tesla-inven-ko
// @homepageURL  https://github.com/zipizigi/tesla-inven-ko
// @supportURL   https://github.com/zipizigi/tesla-inven-ko/issues
// @updateURL    https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-autorefresh.js
// @downloadURL  https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-autorefresh.js
// @version      2025-02-03
// @description  Tesla 인벤 자동 새로고침
// @author       You
// @match        https://www.tesla.com/ko_KR/inventory/new/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('auto refresh start!');

    const settings = {
        referral: 'hongseok93745',
        model: 'my', // ms, mx, my, m3
    }


    setTimeout(()=>{
        location.reload()
    },5*60*1000)

    autoCheckInven();


    function autoCheckInven(){
        checkInven();
        setInterval(()=>{
            if(new Date().getMinutes() >= 56){
                checkInven()
            }
        }, 5000);
    }
    function checkInven(){
        console.log('인벤토리 확인중...');
        const query = {"query":{"model":settings.model,"condition":"new","options":{},"arrangeby":"Relevance","order":"desc","market":"KR","language":"ko","super_region":"north america","lng":"","lat":"","zip":"","range":0},"offset":0,"count":24,"outsideOffset":0,"outsideSearch":false,"isFalconDeliverySelectionEnabled":false,"version":0}
        const url = 'https://www.tesla.com/inventory/api/v4/inventory-results?query=' + encodeURIComponent(JSON.stringify(query))

        fetch(url)
            .then(response => {
            const json = response.json()
            if(json.total_matches_found >= 0){
                const vin = json.results[0].VIN;
                location.href = `https://www.tesla.com/ko_KR/${settings.model}/order/${vin}?referral=${settings.referral}&titleStatus=new&redirect=no#payment`;
            }
        })
    }
})();



