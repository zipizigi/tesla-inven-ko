// ==UserScript==
// @name         Tesla Inv. Auto input
// @namespace    https://github.com/zipizigi/tesla-inven-ko
// @homepageURL  https://github.com/zipizigi/tesla-inven-ko
// @supportURL   https://github.com/zipizigi/tesla-inven-ko/issues
// @updateURL    https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js
// @downloadURL  https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js
// @version      2025-01-23-001
// @description  Tesla 인벤 카드 정보 자동 입력
// @author       You
// @match        https://www.tesla.com/ko_KR/ms/order/*
// @match        https://static-assets-pay.tesla.com/v5/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const settings = {
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
        /*

  */
        await typing('[name="/billingAddress1"]', settings.addr1)
        await typing('[name="/billingAddress2"]', settings.addr2)
        await typing('[name="/billingCity"]', settings.city)
        await typing('[name="/billingZipCode"]', settings.zipCode)

        document.querySelectorAll('.tds-form-input input[type="checkbox"]').forEach(i=>i.click())

        await waitForElement('[name="birthday"]')
        await typing('[name="birthday"]', settings.cardBrith)
        await typing('[name="password"]', settings.cardPw)
    } else {
        await waitForElement('.modal-container--referral-modal button', 1000)
        const refModal = document.querySelector('.modal-container--referral-modal button')
        if(refModal){
            refModal.click()
        }
        await waitForElement('.btn-creditcard')
        document.querySelector('.btn-creditcard').click()


        await waitForElement('#LOCAL_NAME')

        await typing('#LOCAL_NAME', settings.name)
        await typing('#FIRST_NAME', settings.firstName)
        await typing('#LAST_NAME', settings.lastName)
        await typing('#EMAIL', settings.email)
        await typing('#EMAIL_CONFIRM', settings.email)
        await typing('#PHONE_NUMBER', settings.phone)

        document.querySelectorAll('.legal-disclaimer input[type="checkbox"]').forEach(i=>i.click())
        await waitForElement('.payment-order-button:not([disabled]')

        await sleep(200)

        document.querySelector(".payment-order-button").scrollIntoView({ behavior: "smooth", block: "top" });

        if(settings.autoOrder){
            document.querySelector(".payment-order-button").click()
        }
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

            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log('wait fail ' + selector)
    }
    async function typing(inputSelector, text, typingSpeed = 10) {
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
    async function check(checkSelector, checked = true) {
        const checkbox = document.querySelectorAll(check);
        if (!checkbox) {
            throw new Error("Checkbox element not found!");
        }


        const nativeCheckedSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "checked"
        ).set;
        for(const elm of checkbox){
            nativeCheckedSetter.call(elm, checked);

            // React의 `onChange` 이벤트 트리거
            const event = new Event("change", { bubbles: true });
            checkbox.dispatchEvent(event);
            await sleep(50)
        }



    }

})();
