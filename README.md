# Tesla 인벤토리 카드 자동입력 & 자동결제 스크립트/매크로

Tesla 인벤토리 결제 정보를 자동으로 입력하고, 필요시 자동결제를 시도합니다.
## 예시화면
<p align="center">
 <img src="https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/example.gif"/>
</p>

## 설치하기
### 확장프로그램 설치
Tampermonkey를 통해 UserScript를 실행합니다. 브라우저에 해당 확장프로그램이 설치되어 있어야합니다.  
크롬으로 테스트하였으나, Edge 외에도 다른 브라우저도 가능할 수 있습니다.  

[https://www.tampermonkey.net/](https://www.tampermonkey.net/)  
[https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  

설치된 확장프로그램에서 대시보드 -> 도구로 이동합니다.   
(또는 [chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=utils](chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=utils) 으로 이동)  

하단의 import From URL에 아래 주소를 입력하고 설치를 누릅니다.  
`https://raw.githubusercontent.com/zipizigi/tesla-inven-ko/refs/heads/main/inven-card-autoinput.js`  

### 카드 정보 수정  
설치된 유저 스크립트 탭에, 방금 추가한 유저스크립트가 있습니다.  Tesla 인벤 관련된 유저 스크립트로 들어갑니다.  
settings 부분에 주문 정보가 있습니다. 본인의 카드정보와 주소를 입력합니다.  

```js
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
```
카드번호와 유효기간, 주소를 본인에 맞게 변경해주세요.  
`autoOrder`을 true로 변경하면, 카드 정보와 주소를 입력하고 마지막으로 결제까지 시도합니다. 마지막까지 테스트한 이후에 true로 변경하면 빠른 주문이 가능합니다.

### 테스트하기  
[인벤토리 바로가기](https://bit.ly/tesla-inven) 에서 인벤토리에 있는 아무 차량을 선택합니다.  
다른 모델도 상관 없습니다.  

차량을 선택하면 자동으로 카드 정보가 입력되고, 하단의 주문하기 버튼이 파란색을 활성화 되어 있는지 확인합니다.  
입력된 정보가 정상적인지 확인합니다.  

### 자동주문
`autoOrder`을 true로 변경하면 자동주문을 시도합니다.  

## 사용방법 
인벤토리 페이지를 계속 새로고침하다가, 원하는 옵션이 나오면 바로 해당 차량을 선택합니다.  
이제 유저스크립트로 카드정보가 자동으로 채워집니다.  
주문하기를 직접 누르거나 자동주문을 이용하여 빠르게 주문하세요.  

# 주의사항
해당 코드는 모두 공개되어 있으며, 외부로 어떠한 정보도 내보내지 않습니다.    
카드정보는 해당 브라우저에만 저장됩니다. 공용 PC일 경우 주문 완료 후 삭제해주세요.  

`autoOrder`으로 인하여 원치 않는 차량이나 다른 차량의 옵션이 결제될 수 있습니다.  
항상 주의해주세요.

중간의 링크를 리퍼럴 코드가 적용되어 있습니다. 지인의 리퍼럴 코드를 이용하셔도 됩니다.  

해당 스크립트는 Model S로 테스트하였습니다.  
동작에 문제가 있다면 https://github.com/zipizigi/tesla-inven-ko/issues 에 이슈를 등록해주세요.  
