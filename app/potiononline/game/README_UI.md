# POTION ONLINE Seller v2 — Front UI Prototype

이번 폴더는 **게임 로직을 거의 건드리지 않고 프론트 표면만 빠르게 리디자인한 버전**입니다.

## 디자인 기준
- 실제 쇼핑몰 판매자센터처럼 읽히는 정보 구조 유지
- 화이트 + 핑크가 기본, 라벤더/아쿠아를 작은 포인트로 사용
- 2000년대 쇼핑몰/Y2K 웹 감성은 배너·라벨·윈도우 프레임·스티커에 집중
- 주문 화면은 상대적으로 실무적으로, 홈/상품/MY는 조금 더 키치하게
- 게임 메뉴처럼 보이는 요소보다 주문·상품·고객·정산 같은 실제 커머스 용어를 우선

## 우선 수정 파일
- `components/shop/HomePage.tsx` : 홈 대시보드 / 프로모션 감도
- `components/TopHeader.tsx` : 브랜드 로고 / 상단 ticker
- `components/shop/ShopPage.tsx`, `OrderCard.tsx` : 주문 화면
- `components/manage/ManagePage.tsx` : 상품 / 재고
- `components/manage/MyPage.tsx` : 스토어 프로필 / 설정
- `potion.css` : 공용 색상 / retro-window / sticker 문법

## 다음 개선 후보
1. 실물 포션 상품 썸네일 에셋 추가
2. 고객 문의 화면을 실제 쇼핑몰 채팅 UI로 더 강화
3. 제작 화면도 현재 기능을 유지하며 ERP/제조지시서 느낌으로 리스킨
4. 작은 GIF풍 sparkle / NEW / HOT 에셋 추가
