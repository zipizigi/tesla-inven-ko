# Tesla 인벤토리 자동 새로고침 & 카드 자동입력 & 자동결제 스크립트/매크로
Tesla 인벤토리를 자동으로 새로고침하고, 필요시 결제 화면으로 이동합니다.  
결제 정보를 자동으로 입력하고, 필요시 자동결제를 시도합니다.

## 자동 입력 예시화면
<p align="center">
 <img src="https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/example.gif"/>
</p>

## 자동 새로고침 
인벤토리를 매시 56분부터 특정 시간 간격으로 정보를 불러오며, 인벤토리에 차량이 있을 경우 해당 차량 결제화면으로 이동합니다.  
카드 자동입력과 자동결제로 결제할 수 있습니다.  

## 설치하기
### 확장프로그램 설치
Tampermonkey를 통해 UserScript를 실행합니다. 브라우저에 해당 확장프로그램이 설치되어 있어야합니다.  
크롬으로 테스트하였으나, Edge 외에도 다른 브라우저도 가능할 수 있습니다.  

[https://www.tampermonkey.net/](https://www.tampermonkey.net/)  
[https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  

설치된 확장프로그램에서 대시보드 -> 도구로 이동합니다.   
(또는 `chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=utils` 으로 이동)  

하단의 import From URL에 아래 주소를 입력하고 설치를 누릅니다.  
`https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-autorefresh.js`  자동 새로고침  
`https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js`  카드 자동 입력  

#### 확장프로그램 개발자 모드 켜기 
https://www.tampermonkey.net/faq.php?ext=dhdg&version=5.3.3#Q209  
개발자 모드를 켜지 않으면, 동작을 하지 않습니다.  
확장 프로그램 관리(브라우저에서 chrome://extensions 또는 edge://extensions)으로 이동 후, 우측 상단의 개발자 모드 활성화  

### 카드 정보 수정  
설치된 유저 스크립트 탭에, 방금 추가한 유저스크립트가 있습니다.  Tesla 인벤 관련된 유저 스크립트로 들어갑니다.  
settings 부분에 주문 정보가 있습니다. 본인의 카드정보와 주소를 입력합니다.  

```js
    const settings = {
        referral: '', // 리퍼럴코드 적용. 공백일경우 처리하지 않음.
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
```
카드번호와 유효기간, 주소를 본인에 맞게 변경해주세요.  
`autoOrder`을 true로 변경하면, 카드 정보와 주소를 입력하고 마지막으로 결제까지 시도합니다. 마지막까지 테스트한 이후에 true로 변경하면 빠른 주문이 가능합니다.  
  
`referral`에 리퍼럴 적용을 위한 코드를 넣어두세요. 실수로 누락할 경우 자동으로 입력해줍니다.  
공백일경우 리퍼럴이 적용되어있거나, 적용되지 않았어도 다음 단계를 진행합니다.  

### 원하는 차량 옵션만 선택하기
auto refresh 스크립트의 설정 부분을 수정합니다.  
```js

    const settings = {
        referral: 'REFERRAL',
        model: 'my', // ms, mx, my, m3
        wheel: '', // EIGHTEEN, NINETEEN, TWENTY, TWENTY_ONE
        paint: '', // WHITE, BLACK, BLUE, SILVER, RED
        interior: '', //BLACK, WHITE
    }
```
Model Y/3에서는 대부분 가능하지만, S/X의 색상이나 휠 사이즈가 다를수 있습니다.  
공백 `''`으로 둘 경우 해당 옵션을 선택하지 않습니다.  
예로들어 wheel만 `NINETEEN`으로 하고 다른 옵션은 `''`으로 둘 경우 19인치중 아무 옵션 차량을 선택합니다.  

### 테스트하기  
#### 자동 새로고침 테스트
매시 56분부터 동작합니다. 해당 시간에 브라우저 F12를 눌러 개발자 도구를 연뒤, 콘솔 탭에서 `인벤토리 확인중...` 이라는 메시지가 나오는지 확인합니다.  

#### 카드 정보 입력 테스트
[인벤토리 바로가기](https://bit.ly/tesla-inven) 에서 인벤토리에 있는 아무 차량을 선택합니다.  
다른 모델도 상관 없습니다.  

차량을 선택하면 자동으로 카드 정보가 입력되고, 하단의 주문하기 버튼이 파란색을 활성화 되어 있는지 확인합니다.  
입력된 정보가 정상적인지 확인합니다.  

### 자동주문
`autoOrder`을 true로 변경하면 자동주문을 시도합니다.  

## 사용방법 
인벤토리 창을 뛰웁니다. (https://www.tesla.com/ko_KR/inventory/new/my)  
유저스크립트가 자동으로 정보를 확인하고, 모델이 나오면 첫번째 차량 결제 페이지로 이동합니다.  

수동으로 할 경우, 새로고침을 직접 하면서 원하는 차량 결제페이지로 이동합니다.  

유저스크립트로 카드정보가 자동으로 채워집니다.  
주문하기를 직접 누르거나 자동주문을 이용하여 빠르게 주문하세요.  

## 스크립트 활성화/비활성화 방법
<p align="center">
 <img src="https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/check-enabled.png"/>
</p>
인벤토리와 결제화면에서 확장프로그램(tampermonkey)를 눌렀을 때 tesla 관련 스크립트가 확인되야합니다.  
여기서 활성화, 비활성화를 할 수 있습니다.  

# 주의사항
해당 코드는 모두 공개되어 있으며, 외부로 어떠한 정보도 내보내지 않습니다.    
카드정보는 해당 브라우저에만 저장됩니다. 공용 PC일 경우 주문 완료 후 삭제해주세요.  

`autoOrder`으로 인하여 원치 않는 차량이나 다른 차량의 옵션이 결제될 수 있습니다.  
항상 주의해주세요.

중간의 링크를 리퍼럴 코드가 적용되어 있습니다. 지인의 리퍼럴 코드를 이용하셔도 됩니다.  

해당 스크립트는 Model S로 테스트하였습니다.  
동작에 문제가 있다면 [https://github.com/zipizigi/tesla-inven-ko/issues](https://github.com/zipizigi/tesla-inven-ko/issues) 에 이슈를 등록해주세요.  
