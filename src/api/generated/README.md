## @/api/generated@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @/api/generated@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *https://matjalalzz.shop*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*APIApi* | [**adminTest**](docs/APIApi.md#admintest) | **GET** /admin/test | 
*APIApi* | [**cancelReservation**](docs/APIApi.md#cancelreservation) | **PATCH** /reservations/{reservationId}/cancel | 예약 취소
*APIApi* | [**completeParty**](docs/APIApi.md#completeparty) | **PATCH** /parties/{partyId}/complete | 파티 모집 완료 상태 변경
*APIApi* | [**confirm**](docs/APIApi.md#confirm) | **POST** /payment/confirm | 결제 승인 api 
*APIApi* | [**confirmReservation**](docs/APIApi.md#confirmreservation) | **PATCH** /reservations/{reservationId}/confirm | 예약 수락
*APIApi* | [**createComment**](docs/APIApi.md#createcomment) | **POST** /parties/{partyId}/comments | 댓글 작성
*APIApi* | [**createInquiryComment**](docs/APIApi.md#createinquirycomment) | **POST** /inquiry/{inquiryId}/comments | 고객센터 댓글 작성
*APIApi* | [**createParty**](docs/APIApi.md#createparty) | **POST** /parties | 파티 생성
*APIApi* | [**createReservation**](docs/APIApi.md#createreservation) | **POST** /shops/{shopId}/reservations | 예약 생성
*APIApi* | [**createReview**](docs/APIApi.md#createreview) | **POST** /reviews | 리뷰 작성
*APIApi* | [**createShop**](docs/APIApi.md#createshop) | **POST** /shops/presigned-urls | 식당 생성
*APIApi* | [**deleteComment**](docs/APIApi.md#deletecomment) | **DELETE** /comments/{commentId} | 댓글 삭제
*APIApi* | [**deleteParty**](docs/APIApi.md#deleteparty) | **DELETE** /parties/{partyId} | 파티 삭제
*APIApi* | [**deleteProfile**](docs/APIApi.md#deleteprofile) | **DELETE** /users/my-page/profile-img | 프로필 이미지 삭제
*APIApi* | [**deleteReview**](docs/APIApi.md#deletereview) | **DELETE** /reviews/{reviewId} | 리뷰 삭제
*APIApi* | [**deleteUser**](docs/APIApi.md#deleteuser) | **DELETE** /users/delete | 회원탈퇴
*APIApi* | [**getAllInquiry**](docs/APIApi.md#getallinquiry) | **GET** /inquiry | 고객센터의 문의글 전체 조회
*APIApi* | [**getComments**](docs/APIApi.md#getcomments) | **GET** /parties/{partyId}/comments | 댓글 조회
*APIApi* | [**getDetailShop**](docs/APIApi.md#getdetailshop) | **GET** /shops/{shopId} | 식당 상세 조회
*APIApi* | [**getDetailShopOwner**](docs/APIApi.md#getdetailshopowner) | **GET** /owner/shops/{shopId} | 사장의 식당 상세 조회
*APIApi* | [**getInquiryComments**](docs/APIApi.md#getinquirycomments) | **GET** /inquiry/{inquiryId}/comments | 고객센터 댓글 조회
*APIApi* | [**getMyInfo**](docs/APIApi.md#getmyinfo) | **GET** /users/my-page | 내 정보 조회
*APIApi* | [**getMyParties**](docs/APIApi.md#getmyparties) | **GET** /users/my-page/parties | 내 파티 정보 조회
*APIApi* | [**getMyReservations**](docs/APIApi.md#getmyreservations) | **GET** /users/my-page/reservations | 내 예약 정보 조회
*APIApi* | [**getMyReviews**](docs/APIApi.md#getmyreviews) | **GET** /users/my-page/reviews | 내 리뷰 정보 조회
*APIApi* | [**getOneInquiry**](docs/APIApi.md#getoneinquiry) | **GET** /inquiry/{inquiryId} | 자신이 작성한 고객센터의 문의글 하나 상세 조회
*APIApi* | [**getOwnerShops**](docs/APIApi.md#getownershops) | **GET** /owner/shops | 사장이 가진 식당들 조회
*APIApi* | [**getParties**](docs/APIApi.md#getparties) | **GET** /parties | 파티 목록 조회
*APIApi* | [**getPartyDetail**](docs/APIApi.md#getpartydetail) | **GET** /parties/{partyId} | 파티 상세 조회
*APIApi* | [**getPartyMembers**](docs/APIApi.md#getpartymembers) | **GET** /parties/{partyId}/members | 파티원 목록 조회
*APIApi* | [**getPaymentHistories**](docs/APIApi.md#getpaymenthistories) | **GET** /payment | 결제 내역 조회 api
*APIApi* | [**getPendingShop**](docs/APIApi.md#getpendingshop) | **POST** /admin/shops/{shopId} | 관리자가 식당 등록에 대한 요청을 승인 또는 거절 
*APIApi* | [**getPendingShop1**](docs/APIApi.md#getpendingshop1) | **GET** /admin/shops | 관리자가 pending 상태인 식당들 리스트를 가져옴
*APIApi* | [**getProfilePresignedUrl**](docs/APIApi.md#getprofilepresignedurl) | **POST** /users/my-page/presigned-urls | 프로필 이미지 업로드를 위한 pre-signed url 생성
*APIApi* | [**getReservations**](docs/APIApi.md#getreservations) | **GET** /reservations | 식당 예약 목록 조회
*APIApi* | [**getReviews**](docs/APIApi.md#getreviews) | **GET** /shops/{shopId}/reviews | 리뷰 조회
*APIApi* | [**getShopAdminDetail**](docs/APIApi.md#getshopadmindetail) | **GET** /admin/shops/{shopId} | 관리자가 식당에 대한 정보를 봄
*APIApi* | [**getShops**](docs/APIApi.md#getshops) | **GET** /shops | 식당 목록 조회
*APIApi* | [**getShopsBySearch**](docs/APIApi.md#getshopsbysearch) | **GET** /shops/search | 식당 검색
*APIApi* | [**joinParty**](docs/APIApi.md#joinparty) | **POST** /parties/{partyId}/join | 파티 참여
*APIApi* | [**login**](docs/APIApi.md#login) | **POST** /users/login | Form 로그인
*APIApi* | [**logout**](docs/APIApi.md#logout) | **POST** /users/logout | 로그아웃
*APIApi* | [**newInquiry**](docs/APIApi.md#newinquiry) | **POST** /inquiry | 고객센터의 문의글 작성
*APIApi* | [**oauth2Urls**](docs/APIApi.md#oauth2urls) | **GET** /users/authorization-info | OAuth2 로그인 진입점 URL 안내
*APIApi* | [**oauthSignup**](docs/APIApi.md#oauthsignup) | **POST** /users/signup/oauth | 회원가입
*APIApi* | [**ownerTest**](docs/APIApi.md#ownertest) | **GET** /owner/test | 
*APIApi* | [**payPartyFee**](docs/APIApi.md#paypartyfee) | **POST** /parties/{partyId}/pay | 파티 예약금 지불
*APIApi* | [**quitParty**](docs/APIApi.md#quitparty) | **POST** /parties/{partyId}/quit | 파티 탈퇴
*APIApi* | [**quitParty1**](docs/APIApi.md#quitparty1) | **POST** /parties/{partyId}/kick/{userId} | 파티 강퇴
*APIApi* | [**refreshToken**](docs/APIApi.md#refreshtoken) | **POST** /users/reissue-token | 액세스 토큰 재발급
*APIApi* | [**refuseReservation**](docs/APIApi.md#refusereservation) | **PATCH** /reservations/{reservationId}/refuse | 예약 거절
*APIApi* | [**saveOrder**](docs/APIApi.md#saveorder) | **POST** /payment/order | 주문 정보 임시 저장 api
*APIApi* | [**signup**](docs/APIApi.md#signup) | **POST** /users/signup | 회원가입
*APIApi* | [**updateMyInfo**](docs/APIApi.md#updatemyinfo) | **PUT** /users/my-page | 내 정보 수정
*APIApi* | [**updateShop**](docs/APIApi.md#updateshop) | **PUT** /owner/shops/{shopId} | 사장 식당 정보 수정
*APIApi* | [**userTest**](docs/APIApi.md#usertest) | **GET** /test | 
*ChatControllerApi* | [**loadChatHistory**](docs/ChatControllerApi.md#loadchathistory) | **GET** /parties/{partyId}/chat/load | 
*ChatControllerApi* | [**restoreChat**](docs/ChatControllerApi.md#restorechat) | **GET** /parties/{partyId}/chat/restore | 


### Documentation For Models

 - [AccessTokenResponseDto](docs/AccessTokenResponseDto.md)
 - [ApproveRequest](docs/ApproveRequest.md)
 - [BaseResponseAccessTokenResponseDto](docs/BaseResponseAccessTokenResponseDto.md)
 - [BaseResponseChatMessagePageResponse](docs/BaseResponseChatMessagePageResponse.md)
 - [BaseResponseGetAllPendingShopListResponse](docs/BaseResponseGetAllPendingShopListResponse.md)
 - [BaseResponseInquiryAllGetResponse](docs/BaseResponseInquiryAllGetResponse.md)
 - [BaseResponseInquiryOneGetResponse](docs/BaseResponseInquiryOneGetResponse.md)
 - [BaseResponseListChatMessageResponse](docs/BaseResponseListChatMessageResponse.md)
 - [BaseResponseListCommentResponse](docs/BaseResponseListCommentResponse.md)
 - [BaseResponseListPartyMemberResponse](docs/BaseResponseListPartyMemberResponse.md)
 - [BaseResponseMyInfoResponse](docs/BaseResponseMyInfoResponse.md)
 - [BaseResponseMyPartyPageResponse](docs/BaseResponseMyPartyPageResponse.md)
 - [BaseResponseMyReservationPageResponse](docs/BaseResponseMyReservationPageResponse.md)
 - [BaseResponseMyReviewPageResponse](docs/BaseResponseMyReviewPageResponse.md)
 - [BaseResponseOwnerShopsList](docs/BaseResponseOwnerShopsList.md)
 - [BaseResponsePartyDetailResponse](docs/BaseResponsePartyDetailResponse.md)
 - [BaseResponsePartyScrollResponse](docs/BaseResponsePartyScrollResponse.md)
 - [BaseResponsePaymentScrollResponse](docs/BaseResponsePaymentScrollResponse.md)
 - [BaseResponsePaymentSuccessResponse](docs/BaseResponsePaymentSuccessResponse.md)
 - [BaseResponsePreSignedUrlListResponse](docs/BaseResponsePreSignedUrlListResponse.md)
 - [BaseResponsePreSignedUrlResponse](docs/BaseResponsePreSignedUrlResponse.md)
 - [BaseResponseReservationListResponse](docs/BaseResponseReservationListResponse.md)
 - [BaseResponseReviewPageResponse](docs/BaseResponseReviewPageResponse.md)
 - [BaseResponseShopAdminDetailResponse](docs/BaseResponseShopAdminDetailResponse.md)
 - [BaseResponseShopDetailResponse](docs/BaseResponseShopDetailResponse.md)
 - [BaseResponseShopOwnerDetailResponse](docs/BaseResponseShopOwnerDetailResponse.md)
 - [BaseResponseShopPageResponse](docs/BaseResponseShopPageResponse.md)
 - [BaseResponseShopsResponse](docs/BaseResponseShopsResponse.md)
 - [BaseResponseVoid](docs/BaseResponseVoid.md)
 - [ChatMessagePageResponse](docs/ChatMessagePageResponse.md)
 - [ChatMessageResponse](docs/ChatMessageResponse.md)
 - [CommentCreateRequest](docs/CommentCreateRequest.md)
 - [CommentResponse](docs/CommentResponse.md)
 - [CreateReservationRequest](docs/CreateReservationRequest.md)
 - [CreateReservationResponse](docs/CreateReservationResponse.md)
 - [DeleteProfileRequest](docs/DeleteProfileRequest.md)
 - [GetAllPendingShopListResponse](docs/GetAllPendingShopListResponse.md)
 - [InquiryAllGetResponse](docs/InquiryAllGetResponse.md)
 - [InquiryCreateRequest](docs/InquiryCreateRequest.md)
 - [InquiryItem](docs/InquiryItem.md)
 - [InquiryOneGetResponse](docs/InquiryOneGetResponse.md)
 - [LocalTime](docs/LocalTime.md)
 - [LoginRequest](docs/LoginRequest.md)
 - [MyInfoResponse](docs/MyInfoResponse.md)
 - [MyInfoUpdateRequest](docs/MyInfoUpdateRequest.md)
 - [MyPartyPageResponse](docs/MyPartyPageResponse.md)
 - [MyPartyResponse](docs/MyPartyResponse.md)
 - [MyReservationPageResponse](docs/MyReservationPageResponse.md)
 - [MyReservationResponse](docs/MyReservationResponse.md)
 - [MyReviewPageResponse](docs/MyReviewPageResponse.md)
 - [MyReviewResponse](docs/MyReviewResponse.md)
 - [OAuthSignUpRequest](docs/OAuthSignUpRequest.md)
 - [OrderSaveRequest](docs/OrderSaveRequest.md)
 - [OwnerShopItem](docs/OwnerShopItem.md)
 - [OwnerShopsList](docs/OwnerShopsList.md)
 - [PartyCreateRequest](docs/PartyCreateRequest.md)
 - [PartyDetailResponse](docs/PartyDetailResponse.md)
 - [PartyListResponse](docs/PartyListResponse.md)
 - [PartyMemberResponse](docs/PartyMemberResponse.md)
 - [PartyScrollResponse](docs/PartyScrollResponse.md)
 - [PaymentHistoryResponse](docs/PaymentHistoryResponse.md)
 - [PaymentScrollResponse](docs/PaymentScrollResponse.md)
 - [PaymentSuccessResponse](docs/PaymentSuccessResponse.md)
 - [PendingShop](docs/PendingShop.md)
 - [PreSignedUrlListResponse](docs/PreSignedUrlListResponse.md)
 - [PreSignedUrlResponse](docs/PreSignedUrlResponse.md)
 - [ReservationContent](docs/ReservationContent.md)
 - [ReservationListResponse](docs/ReservationListResponse.md)
 - [ReviewCreateRequest](docs/ReviewCreateRequest.md)
 - [ReviewPageResponse](docs/ReviewPageResponse.md)
 - [ReviewResponse](docs/ReviewResponse.md)
 - [ShopAdminDetailResponse](docs/ShopAdminDetailResponse.md)
 - [ShopCreateRequest](docs/ShopCreateRequest.md)
 - [ShopDetailResponse](docs/ShopDetailResponse.md)
 - [ShopElementResponse](docs/ShopElementResponse.md)
 - [ShopOwnerDetailResponse](docs/ShopOwnerDetailResponse.md)
 - [ShopPageResponse](docs/ShopPageResponse.md)
 - [ShopUpdateRequest](docs/ShopUpdateRequest.md)
 - [ShopsItem](docs/ShopsItem.md)
 - [ShopsResponse](docs/ShopsResponse.md)
 - [SignUpRequest](docs/SignUpRequest.md)
 - [TossPaymentConfirmRequest](docs/TossPaymentConfirmRequest.md)
 - [Writer](docs/Writer.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="accessToken"></a>
### accessToken

- **Type**: Bearer authentication (Authorization)

<a id="refreshToken"></a>
### refreshToken

- **Type**: API key
- **API key parameter name**: refreshToken
- **Location**: 

