// ==UserScript==
// @name         Tesla Inv. Auto input
// @namespace    https://github.com/zipizigi/tesla-inven-ko
// @homepageURL  https://github.com/zipizigi/tesla-inven-ko
// @supportURL   https://github.com/zipizigi/tesla-inven-ko/issues
// @updateURL    https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js
// @downloadURL  https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js
// @version      2025-03-02-001
// @description  Tesla 인벤 카드 정보 자동 입력
// @author       You
// @match        https://www.tesla.com/ko_KR/*/order/*
// @match        https://www.tesla.com/ko_kr/*/order/*
// @match        https://www.tesla.com/ko_KR/*/design*
// @match        https://www.tesla.com/ko_kr/*/design*
// @match        https://static-assets-pay.tesla.com/v5/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
// ==/UserScript==

/**
Changelog.
- 주문 페이지 변경 대응
**/

(async function() {
    'use strict';

    const settings = {
        referral: 'hongseok93745', // 리퍼럴코드 적용. 공백일경우 처리하지 않음.
        name: '홍길동', // 한글 성/이름
        firstName: 'KilDong', // 영문 이름
        lastName: 'Hong', // 영문 성
        email: 'kd@email.com', // 이메일
        phone:'10-1234-1234', // 전화번호

        cardName: 'KilDong Hong', // 카드 영문 명
        cardNumber: '5547 2024 5480 4106', // 카드 번호
        cardMonth: '09', // 카드 유효기간 월
        cardYear: '2025', // 카드 유효기간 년도
        cardBrith: '85/01/23', // 생년월이 6자리
        cardPw: '12',// 카드 비밀번호 앞 2자리

        addr1: '대왕판교로 316', // 도로명
        addr2: '2층',//아파트명, 동호수
        city: '경기도 성남시 분당구',
        zipCode: '13550', // 우편번호F

        autoOrder: false, // true로 변경시, 자동으로 '주문하기'를 눌러줍니다.

    }


    if(location.href.indexOf('assets-pay.') > 0) {
        // card
        await waitForElement('[name="/creditCardHolderName"]')
        await typing('[name="/creditCardHolderName"]', settings.cardName)
        await typing('[name="/creditCardNumber"]', settings.cardNumber)

        await typing('[name="/creditCardNumber"]', settings.cardNumber)
        await select('[name="/creditCardExpiryMonth"]', settings.cardMonth)
        await select('[name="/creditCardExpiryYear"]', settings.cardYear)

        await typing('[name="/billingAddress1"]', settings.addr1)
        await typing('[name="/billingAddress2"]', settings.addr2)
        await typing('[name="/billingCity"]', settings.city)
        await typing('[name="/billingZipCode"]', settings.zipCode)

        document.querySelectorAll('.tds-form-input input[type="checkbox"]').forEach(i=>i.click())

        await waitForElement('[name="birthday"]')
        await typing('[name="birthday"]', settings.cardBrith)
        await typing('[name="password"]', settings.cardPw)
    } else {
        if(location.hash == '#payment'){
            await fillInfo();
        } else {
            window.addEventListener('hashchange', function() {
                if(location.hash == '#payment'){
                    fillInfo();
                }
            });
        }
        if(location.hash == '#overview' && location.href.indexOf('design') < 0){
            location.hash = '#payment'
        }


    }

    async function fillInfo(){
        const queryString = new URLSearchParams(location.search);
        if(settings.referral != '' && queryString.get('referral') !== settings.referral){
            queryString.set('referral', settings.referral);
            location.search = '?' + queryString.toString()
        }

        // close referral
        await waitForElement('.modal-container--referral-modal button', 1000)
        const refModal = document.querySelector('.modal-container--referral-modal button')
        if(refModal){
            refModal.click()
        }

        // order button
        await waitForElement('.summary-panel--aside-footer button.aside-footer--button', 500)
        const orderButton = document.querySelector('.summary-panel--aside-footer button.aside-footer--button')
        if(orderButton){
            orderButton.click()
        }

        // continue to payment button
        await waitForElement('button.continue-to-payment-btn', 500)
        const continueToPaymentButton = document.querySelector('button.continue-to-payment-btn')
        if(continueToPaymentButton){
            continueToPaymentButton.click()
        }


        await waitForElement('.btn-creditcard')
        document.querySelector('.btn-creditcard').click()


        await waitForElement('#LOCAL_NAME')
        scroollToElement('#LOCAL_NAME')


        await typing('#LOCAL_NAME', settings.name)
        await typing('#FIRST_NAME', settings.firstName)
        await typing('#LAST_NAME', settings.lastName)
        await typing('#EMAIL', settings.email)
        await typing('#EMAIL_CONFIRM', settings.email)
        await typing('#PHONE_NUMBER', settings.phone)

        scroollToElement('.legal-disclaimer input[type="checkbox"]')
        document.querySelectorAll('.legal-disclaimer input[type="checkbox"]').forEach(i=>i.click())

        await waitForElement('.payment-order-button:not([disabled]')


        await sleep(200)
        scroollToElement('.payment-order-button')

        if(settings.autoOrder){
            document.querySelector(".payment-order-button").click();
            autoOrderRetry()
        }
    }

    function scroollToElement(selector) {
        document.querySelector(selector).scrollIntoView({ behavior: "instant", block: "end" });
    }

    async function sleep(ms){
        return new Promise((r) => setTimeout(r, ms));
    }
    async function waitForElement(selector, timeout = 10000) {
        const endTime = Date.now() + timeout;

        while (Date.now() < endTime) {
            const element = document.querySelector(selector);

            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
                    return element;
                }
            }

            await sleep(25)
        }

        console.log('wait fail ' + selector)
    }
    async function typing(inputSelector, text, typingSpeed = 5) {
        const input = document.querySelector(inputSelector);
        if (!input) {
            throw new Error("Input element not found!");
        }

        for (let i = 0; i < text.length; i++) {
            const currentChar = text[i];

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;

            nativeInputValueSetter.call(input, input.value + currentChar);

            const event = new Event("input", { bubbles: true });
            input.dispatchEvent(event);
            await sleep(typingSpeed)
        }

    }
    async function select(selectSelector, value) {
        const select = document.querySelector(selectSelector);
        if (!select) {
            throw new Error("Select element not found!");
        }

        // 선택된 값을 설정
        const nativeValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLSelectElement.prototype,
            "value"
        ).set;
        nativeValueSetter.call(select, value);

        // React의 `onChange` 이벤트 트리거
        const event = new Event("change", { bubbles: true });
        select.dispatchEvent(event);
    }

    function autoOrderRetry(){
        console.log('매시 57분 ~ 59분에 자동 주문을 시도합니다.');
        setInterval(()=>{
            if(new Date().getMinutes() >= 56){
                console.log('자동 주문 시도... ' + new Date().toLocaleTimeString());
                document.querySelector(".payment-order-button").click();
            }
        }, 2000);
    }
})();
