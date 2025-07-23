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
*APIApi* | [**completeParty**](docs/APIApi.md#completeparty) | **PATCH** /parties/{partyId}/complete | 파티 모집 완료 상태 변경
*APIApi* | [**confirm**](docs/APIApi.md#confirm) | **POST** /api/payments/confirm | Confirm
*APIApi* | [**confirmReservation**](docs/APIApi.md#confirmreservation) | **PATCH** /reservations/{reservationId}/confirm | 예약 수락
*APIApi* | [**createComment**](docs/APIApi.md#createcomment) | **POST** /parties/{partyId}/comments | 댓글 작성
*APIApi* | [**createParty**](docs/APIApi.md#createparty) | **POST** /parties | 파티 생성
*APIApi* | [**createReservation**](docs/APIApi.md#createreservation) | **POST** /shops/{shopId}/reservations | 예약 생성
*APIApi* | [**createReview**](docs/APIApi.md#createreview) | **POST** /reviews | 리뷰 작성
*APIApi* | [**createShop**](docs/APIApi.md#createshop) | **POST** /shops/presigned-urls | 식당 생성
*APIApi* | [**deleteComment**](docs/APIApi.md#deletecomment) | **DELETE** /comments/{commentId} | 댓글 삭제
*APIApi* | [**deleteParty**](docs/APIApi.md#deleteparty) | **DELETE** /parties/{partyId} | 파티 삭제
*APIApi* | [**deleteProfile**](docs/APIApi.md#deleteprofile) | **DELETE** /users/my-page/profile-img | 프로필 이미지 삭제
*APIApi* | [**deleteReview**](docs/APIApi.md#deletereview) | **DELETE** /reviews/{reviewId} | 리뷰 삭제
*APIApi* | [**deleteUser**](docs/APIApi.md#deleteuser) | **DELETE** /users/delete | 회원탈퇴
*APIApi* | [**getComments**](docs/APIApi.md#getcomments) | **GET** /parties/{partyId}/comments | 댓글 조회
*APIApi* | [**getDetailShop**](docs/APIApi.md#getdetailshop) | **GET** /shops/{shopId} | 식당 상세 조회
*APIApi* | [**getDetailShopOwner**](docs/APIApi.md#getdetailshopowner) | **GET** /owner/shops/{shopId} | 사장의 식당 상세 조회
*APIApi* | [**getMyInfo**](docs/APIApi.md#getmyinfo) | **GET** /users/my-page | 내 정보 조회
*APIApi* | [**getMyParties**](docs/APIApi.md#getmyparties) | **GET** /users/my-page/parties | 내 파티 정보 조회
*APIApi* | [**getMyReservations**](docs/APIApi.md#getmyreservations) | **GET** /users/my-page/reservations | 내 예약 정보 조회
*APIApi* | [**getMyReviews**](docs/APIApi.md#getmyreviews) | **GET** /users/my-page/reviews | 내 리뷰 정보 조회
*APIApi* | [**getOwnerShops**](docs/APIApi.md#getownershops) | **GET** /owner/shops | 사장이 가진 식당들 조회
*APIApi* | [**getParties**](docs/APIApi.md#getparties) | **GET** /parties | 파티 목록 조회
*APIApi* | [**getPartyDetail**](docs/APIApi.md#getpartydetail) | **GET** /parties/{partyId} | 파티 상세 조회
*APIApi* | [**getProfilePresignedUrl**](docs/APIApi.md#getprofilepresignedurl) | **POST** /users/my-page/presigned-urls | 프로필 이미지 업로드를 위한 pre-signed url 생성
*APIApi* | [**getReservations**](docs/APIApi.md#getreservations) | **GET** /reservations | 식당 예약 목록 조회
*APIApi* | [**getReviews**](docs/APIApi.md#getreviews) | **GET** /shops/{shopId}/reviews | 리뷰 조회
*APIApi* | [**getShops**](docs/APIApi.md#getshops) | **GET** /shops | 식당 목록 조회
*APIApi* | [**getShopsBySearch**](docs/APIApi.md#getshopsbysearch) | **GET** /shops/search | 식당 검색
*APIApi* | [**joinParty**](docs/APIApi.md#joinparty) | **POST** /parties/{partyId}/join | 파티 참여
*APIApi* | [**login**](docs/APIApi.md#login) | **POST** /users/login | Form 로그인
*APIApi* | [**logout**](docs/APIApi.md#logout) | **POST** /users/logout | 로그아웃
*APIApi* | [**oauth2Urls**](docs/APIApi.md#oauth2urls) | **GET** /users/authorization-info | OAuth2 로그인 진입점 URL 안내
*APIApi* | [**oauthSignup**](docs/APIApi.md#oauthsignup) | **POST** /users/signup/oauth | 회원가입
*APIApi* | [**ownerTest**](docs/APIApi.md#ownertest) | **GET** /owner/test | 
*APIApi* | [**quitParty**](docs/APIApi.md#quitparty) | **POST** /parties/{partyId}/quit | 파티 탈퇴
*APIApi* | [**refreshToken**](docs/APIApi.md#refreshtoken) | **POST** /users/reissue-token | 액세스 토큰 재발급
*APIApi* | [**refuseReservation**](docs/APIApi.md#refusereservation) | **PATCH** /reservations/{reservationId}/cancel | 예약 거절
*APIApi* | [**signup**](docs/APIApi.md#signup) | **POST** /users/signup | 회원가입
*APIApi* | [**updateMyInfo**](docs/APIApi.md#updatemyinfo) | **PUT** /users/my-page | 내 정보 수정
*APIApi* | [**updateShop**](docs/APIApi.md#updateshop) | **PUT** /owner/shops/{shopId} | 사장 식당 정보 수정
*APIApi* | [**userTest**](docs/APIApi.md#usertest) | **GET** /test | 


### Documentation For Models

 - [AccessTokenResponseDto](docs/AccessTokenResponseDto.md)
 - [BaseResponseAccessTokenResponseDto](docs/BaseResponseAccessTokenResponseDto.md)
 - [BaseResponseListCommentResponse](docs/BaseResponseListCommentResponse.md)
 - [BaseResponseMyInfoResponse](docs/BaseResponseMyInfoResponse.md)
 - [BaseResponseMyPartyPageResponse](docs/BaseResponseMyPartyPageResponse.md)
 - [BaseResponseMyReservationPageResponse](docs/BaseResponseMyReservationPageResponse.md)
 - [BaseResponseMyReviewPageResponse](docs/BaseResponseMyReviewPageResponse.md)
 - [BaseResponseOwnerShopsList](docs/BaseResponseOwnerShopsList.md)
 - [BaseResponsePartyDetailResponse](docs/BaseResponsePartyDetailResponse.md)
 - [BaseResponsePartyScrollResponse](docs/BaseResponsePartyScrollResponse.md)
 - [BaseResponsePaymentSuccessResponse](docs/BaseResponsePaymentSuccessResponse.md)
 - [BaseResponsePreSignedUrlListResponse](docs/BaseResponsePreSignedUrlListResponse.md)
 - [BaseResponsePreSignedUrlResponse](docs/BaseResponsePreSignedUrlResponse.md)
 - [BaseResponseReservationListResponse](docs/BaseResponseReservationListResponse.md)
 - [BaseResponseReviewPageResponse](docs/BaseResponseReviewPageResponse.md)
 - [BaseResponseShopDetailResponse](docs/BaseResponseShopDetailResponse.md)
 - [BaseResponseShopOwnerDetailResponse](docs/BaseResponseShopOwnerDetailResponse.md)
 - [BaseResponseShopPageResponse](docs/BaseResponseShopPageResponse.md)
 - [BaseResponseShopsResponse](docs/BaseResponseShopsResponse.md)
 - [BaseResponseVoid](docs/BaseResponseVoid.md)
 - [CommentCreateRequest](docs/CommentCreateRequest.md)
 - [CommentResponse](docs/CommentResponse.md)
 - [CreateReservationRequest](docs/CreateReservationRequest.md)
 - [CreateReservationResponse](docs/CreateReservationResponse.md)
 - [DeleteProfileRequest](docs/DeleteProfileRequest.md)
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
 - [OwnerShopItem](docs/OwnerShopItem.md)
 - [OwnerShopsList](docs/OwnerShopsList.md)
 - [PartyCreateRequest](docs/PartyCreateRequest.md)
 - [PartyDetailResponse](docs/PartyDetailResponse.md)
 - [PartyListResponse](docs/PartyListResponse.md)
 - [PartyScrollResponse](docs/PartyScrollResponse.md)
 - [PaymentSuccessResponse](docs/PaymentSuccessResponse.md)
 - [PreSignedUrlListResponse](docs/PreSignedUrlListResponse.md)
 - [PreSignedUrlResponse](docs/PreSignedUrlResponse.md)
 - [ReservationContent](docs/ReservationContent.md)
 - [ReservationListResponse](docs/ReservationListResponse.md)
 - [ReviewCreateRequest](docs/ReviewCreateRequest.md)
 - [ReviewPageResponse](docs/ReviewPageResponse.md)
 - [ReviewResponse](docs/ReviewResponse.md)
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
<a id="JwtAuth"></a>
### JwtAuth

- **Type**: Bearer authentication (Authorization)

