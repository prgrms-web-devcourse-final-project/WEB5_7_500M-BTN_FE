# APIApi

All URIs are relative to *https://matjalalzz.shop*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminTest**](#admintest) | **GET** /admin/test | |
|[**completeParty**](#completeparty) | **PATCH** /parties/{partyId}/complete | 파티 모집 완료 상태 변경|
|[**confirm**](#confirm) | **POST** /payment/confirm | 결제 승인 api |
|[**confirmReservation**](#confirmreservation) | **PATCH** /reservations/{reservationId}/confirm | 예약 수락|
|[**createComment**](#createcomment) | **POST** /parties/{partyId}/comments | 댓글 작성|
|[**createInquiryComment**](#createinquirycomment) | **POST** /inquiry/{inquiryId}/comments | 고객센터 댓글 작성|
|[**createParty**](#createparty) | **POST** /parties | 파티 생성|
|[**createReservation**](#createreservation) | **POST** /shops/{shopId}/reservations | 예약 생성|
|[**createReview**](#createreview) | **POST** /reviews | 리뷰 작성|
|[**createShop**](#createshop) | **POST** /shops/presigned-urls | 식당 생성|
|[**deleteComment**](#deletecomment) | **DELETE** /comments/{commentId} | 댓글 삭제|
|[**deleteParty**](#deleteparty) | **DELETE** /parties/{partyId} | 파티 삭제|
|[**deleteProfile**](#deleteprofile) | **DELETE** /users/my-page/profile-img | 프로필 이미지 삭제|
|[**deleteReview**](#deletereview) | **DELETE** /reviews/{reviewId} | 리뷰 삭제|
|[**deleteUser**](#deleteuser) | **DELETE** /users/delete | 회원탈퇴|
|[**getAllInquiry**](#getallinquiry) | **GET** /inquiry | 고객센터의 문의글 전체 조회|
|[**getComments**](#getcomments) | **GET** /parties/{partyId}/comments | 댓글 조회|
|[**getDetailShop**](#getdetailshop) | **GET** /shops/{shopId} | 식당 상세 조회|
|[**getDetailShopOwner**](#getdetailshopowner) | **GET** /owner/shops/{shopId} | 사장의 식당 상세 조회|
|[**getInquiryComments**](#getinquirycomments) | **GET** /inquiry/{inquiryId}/comments | 고객센터 댓글 조회|
|[**getMyInfo**](#getmyinfo) | **GET** /users/my-page | 내 정보 조회|
|[**getMyParties**](#getmyparties) | **GET** /users/my-page/parties | 내 파티 정보 조회|
|[**getMyReservations**](#getmyreservations) | **GET** /users/my-page/reservations | 내 예약 정보 조회|
|[**getMyReviews**](#getmyreviews) | **GET** /users/my-page/reviews | 내 리뷰 정보 조회|
|[**getOneInquiry**](#getoneinquiry) | **GET** /inquiry/{inquiryId} | 자신이 작성한 고객센터의 문의글 하나 상세 조회|
|[**getOwnerShops**](#getownershops) | **GET** /owner/shops | 사장이 가진 식당들 조회|
|[**getParties**](#getparties) | **GET** /parties | 파티 목록 조회|
|[**getPartyDetail**](#getpartydetail) | **GET** /parties/{partyId} | 파티 상세 조회|
|[**getPaymentHistories**](#getpaymenthistories) | **GET** /payment | 결제 내역 조회 api|
|[**getPendingShop**](#getpendingshop) | **POST** /admin/shops/{shopId} | 관리자가 식당 등록에 대한 요청을 승인 또는 거절 |
|[**getPendingShop1**](#getpendingshop1) | **GET** /admin/shops | 관리자가 pending 상태인 식당들 리스트를 가져옴|
|[**getProfilePresignedUrl**](#getprofilepresignedurl) | **POST** /users/my-page/presigned-urls | 프로필 이미지 업로드를 위한 pre-signed url 생성|
|[**getReservations**](#getreservations) | **GET** /reservations | 식당 예약 목록 조회|
|[**getReviews**](#getreviews) | **GET** /shops/{shopId}/reviews | 리뷰 조회|
|[**getShopAdminDetail**](#getshopadmindetail) | **GET** /admin/shops/{shopId} | 관리자가 식당에 대한 정보를 봄|
|[**getShops**](#getshops) | **GET** /shops | 식당 목록 조회|
|[**getShopsBySearch**](#getshopsbysearch) | **GET** /shops/search | 식당 검색|
|[**joinParty**](#joinparty) | **POST** /parties/{partyId}/join | 파티 참여|
|[**login**](#login) | **POST** /users/login | Form 로그인|
|[**logout**](#logout) | **POST** /users/logout | 로그아웃|
|[**newInquiry**](#newinquiry) | **POST** /inquiry | 고객센터의 문의글 작성|
|[**oauth2Urls**](#oauth2urls) | **GET** /users/authorization-info | OAuth2 로그인 진입점 URL 안내|
|[**oauthSignup**](#oauthsignup) | **POST** /users/signup/oauth | 회원가입|
|[**ownerTest**](#ownertest) | **GET** /owner/test | |
|[**quitParty**](#quitparty) | **POST** /parties/{partyId}/quit | 파티 탈퇴|
|[**refreshToken**](#refreshtoken) | **POST** /users/reissue-token | 액세스 토큰 재발급|
|[**refuseReservation**](#refusereservation) | **PATCH** /reservations/{reservationId}/cancel | 예약 거절|
|[**saveOrder**](#saveorder) | **POST** /payment/order | 주문 정보 임시 저장 api|
|[**signup**](#signup) | **POST** /users/signup | 회원가입|
|[**updateMyInfo**](#updatemyinfo) | **PUT** /users/my-page | 내 정보 수정|
|[**updateShop**](#updateshop) | **PUT** /owner/shops/{shopId} | 사장 식당 정보 수정|
|[**userTest**](#usertest) | **GET** /test | |

# **adminTest**
> string adminTest()


### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.adminTest();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeParty**
> BaseResponseVoid completeParty()

모집중인 파티를 모집종료 상태로 변경합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.completeParty(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **confirm**
> BaseResponsePaymentSuccessResponse confirm(tossPaymentConfirmRequest)

결제 성공 시 (WidgetSuccess로 이동할 때) 이 api를 호출해서 최종 결제 승인 및 저장을 실행합니다. 이 api 에서 에러가 발생할 시 fail path로 리다이렉트합니다. (Completed) 

### Example

```typescript
import {
    APIApi,
    Configuration,
    TossPaymentConfirmRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let tossPaymentConfirmRequest: TossPaymentConfirmRequest; //

const { status, data } = await apiInstance.confirm(
    tossPaymentConfirmRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tossPaymentConfirmRequest** | **TossPaymentConfirmRequest**|  | |


### Return type

**BaseResponsePaymentSuccessResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **confirmReservation**
> BaseResponseVoid confirmReservation()

reservationId에 해당하는 예약을 CONFIRMED 상태로 변경한다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let reservationId: number; // (default to undefined)

const { status, data } = await apiInstance.confirmReservation(
    reservationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 예약 수락 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createComment**
> BaseResponseVoid createComment(commentCreateRequest)

특정 모임에 댓글을 작성합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    CommentCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)
let commentCreateRequest: CommentCreateRequest; //

const { status, data } = await apiInstance.createComment(
    partyId,
    commentCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentCreateRequest** | **CommentCreateRequest**|  | |
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createInquiryComment**
> BaseResponseVoid createInquiryComment(commentCreateRequest)

특정 모임에 댓글을 작성합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    CommentCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let inquiryId: number; // (default to undefined)
let commentCreateRequest: CommentCreateRequest; //

const { status, data } = await apiInstance.createInquiryComment(
    inquiryId,
    commentCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentCreateRequest** | **CommentCreateRequest**|  | |
| **inquiryId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createParty**
> BaseResponseVoid createParty(partyCreateRequest)

맛집 탐험 파티 모집 게시글을 작성합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    PartyCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyCreateRequest: PartyCreateRequest; //

const { status, data } = await apiInstance.createParty(
    partyCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyCreateRequest** | **PartyCreateRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createReservation**
> CreateReservationResponse createReservation(createReservationRequest)

shopId에 해당하는 식당에 예약을 생성한다. 파티 예약인 경우 partyId를 쿼리 파라미터로 전달해야 한다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    CreateReservationRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)
let createReservationRequest: CreateReservationRequest; //
let partyId: number; //파티 ID (선택값). 파티 예약일 경우 전달. (optional) (default to undefined)

const { status, data } = await apiInstance.createReservation(
    shopId,
    createReservationRequest,
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createReservationRequest** | **CreateReservationRequest**|  | |
| **shopId** | [**number**] |  | defaults to undefined|
| **partyId** | [**number**] | 파티 ID (선택값). 파티 예약일 경우 전달. | (optional) defaults to undefined|


### Return type

**CreateReservationResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 예약 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createReview**
> BaseResponsePreSignedUrlListResponse createReview(reviewCreateRequest)

리뷰를 작성합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    ReviewCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let reviewCreateRequest: ReviewCreateRequest; //

const { status, data } = await apiInstance.createReview(
    reviewCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewCreateRequest** | **ReviewCreateRequest**|  | |


### Return type

**BaseResponsePreSignedUrlListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createShop**
> BaseResponsePreSignedUrlListResponse createShop(shopCreateRequest)

사용자는 새로운 식당을 생성합니다.(Completed)  사진 전송 시 헤더에 Cache-Control 값이 no-cache,no-store,must-revalidate 되어 있어야 합니다  

### Example

```typescript
import {
    APIApi,
    Configuration,
    ShopCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopCreateRequest: ShopCreateRequest; //

const { status, data } = await apiInstance.createShop(
    shopCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopCreateRequest** | **ShopCreateRequest**|  | |


### Return type

**BaseResponsePreSignedUrlListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteComment**
> deleteComment()

특정 댓글을 삭제합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let commentId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteComment(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteParty**
> deleteParty()

맛집 탐험 파티 게시글을 삭제합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteParty(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProfile**
> deleteProfile(deleteProfileRequest)

프로필 수정 작업 중 예외 발생으로 업로드된 이미지를 삭제합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    DeleteProfileRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let deleteProfileRequest: DeleteProfileRequest; //

const { status, data } = await apiInstance.deleteProfile(
    deleteProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteProfileRequest** | **DeleteProfileRequest**|  | |


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 삭제 성공 |  -  |
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteReview**
> deleteReview()

특정 리뷰를 삭제합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let reviewId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteReview(
    reviewId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUser**
> deleteUser()

회원 탈퇴 기능(Inprogress)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let refreshToken: string; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
    refreshToken
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshToken** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllInquiry**
> BaseResponseInquiryAllGetResponse getAllInquiry()

문의글 전체를 조회합니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let cursor: number; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllInquiry(
    cursor,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cursor** | [**number**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**BaseResponseInquiryAllGetResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getComments**
> BaseResponseListCommentResponse getComments()

특정 모임의 댓글 목록을 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.getComments(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseListCommentResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailShop**
> BaseResponseShopDetailResponse getDetailShop()

사용자가 특정 식당의 상세 정보를 조회합니다. 식당 등록 상태가 APPROVED인 식당들만 조회 가능 (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)

const { status, data } = await apiInstance.getDetailShop(
    shopId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseShopDetailResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailShopOwner**
> BaseResponseShopOwnerDetailResponse getDetailShopOwner()

자신이 가진 식당의 상세 정보를 조회합니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)

const { status, data } = await apiInstance.getDetailShopOwner(
    shopId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseShopOwnerDetailResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInquiryComments**
> BaseResponseListCommentResponse getInquiryComments()

특정 모임의 댓글 목록을 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let inquiryId: number; // (default to undefined)

const { status, data } = await apiInstance.getInquiryComments(
    inquiryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inquiryId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseListCommentResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyInfo**
> BaseResponseMyInfoResponse getMyInfo()

로그인한 사용자의 마이페이지 정보를 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.getMyInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseMyInfoResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyParties**
> BaseResponseMyPartyPageResponse getMyParties()

로그인한 사용자의 파티 목록을 커서 기반 페이징 방식으로 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let size: number; // (optional) (default to 10)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getMyParties(
    size,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **size** | [**number**] |  | (optional) defaults to 10|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**BaseResponseMyPartyPageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyReservations**
> BaseResponseMyReservationPageResponse getMyReservations()

로그인한 사용자의 예약 목록을 커서 기반 페이징 방식으로 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let size: number; // (optional) (default to 10)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getMyReservations(
    size,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **size** | [**number**] |  | (optional) defaults to 10|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**BaseResponseMyReservationPageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyReviews**
> BaseResponseMyReviewPageResponse getMyReviews()

로그인한 사용자가 작성한 리뷰 목록을 커서 기반 페이징 방식으로 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let size: number; // (optional) (default to 10)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getMyReviews(
    size,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **size** | [**number**] |  | (optional) defaults to 10|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**BaseResponseMyReviewPageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOneInquiry**
> BaseResponseInquiryOneGetResponse getOneInquiry()

본인이 작성한 경우이거나 관리자의 경우에만 조회가 가능합니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let inquiryId: number; // (default to undefined)

const { status, data } = await apiInstance.getOneInquiry(
    inquiryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inquiryId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseInquiryOneGetResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOwnerShops**
> BaseResponseOwnerShopsList getOwnerShops()

사장 한명이 가진 식당들 리스트들을 조회합니다. 승인 여부 상태와 상관없이 조회 (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.getOwnerShops();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseOwnerShopsList**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getParties**
> BaseResponsePartyScrollResponse getParties()

파티 상태, 위치, 음식 카테고리로 필터링한 파티 게시글 목록을 조회합니다. (Completed)  예시 /parties?status=RECRUITING&minAge=10&categories=CHICKEN&categories=JAPANESE  | 필드 명     | 자료형    | 필수 여부  | 설명                                            | 기본값                   | |------------|---------|-----------|-------------------------------------------------|------------------------| | status     | string  | Optional  | 파티 상태                                        | 전체                    | | gender     | string  | Optional  | 모집 성별 조건(A일 시 성별 무관인 파티만 조회합니다.)   |  전체                   | | minAge     | int     | Optional  | 모집 최소 나이                                    | 전체                    | | maxAge     | int     | Optional  | 모집 최대 나이                                    | 전체                    | | location   | string  | Optional  | 시/도 단위 파티 위치                               | 전체                    | | category   | string  | Optional  | 음식 카테고리 (다중 선택 가능)                       | 전체                    | | query      | string  | Optional  | 파티 제목 검색 키워드                               | 전체                    | | cursor       | int  | Optional   | 페이징 마지막 파티 id                               | 첫번째 페이지            | 

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let status: 'RECRUITING' | 'COMPLETED' | 'TERMINATED'; // (optional) (default to undefined)
let gender: 'M' | 'W' | 'A'; // (optional) (default to undefined)
let minAge: number; // (optional) (default to undefined)
let maxAge: number; // (optional) (default to undefined)
let location: string; // (optional) (default to undefined)
let categories: Array<'CHICKEN' | 'CHINESE' | 'JAPANESE' | 'PIZZA' | 'FASTFOOD' | 'STEW_SOUP' | 'JOK_BO' | 'KOREAN' | 'SNACK' | 'WESTERN' | 'DESSERT'>; // (optional) (default to undefined)
let query: string; // (optional) (default to undefined)
let cursor: number; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getParties(
    status,
    gender,
    minAge,
    maxAge,
    location,
    categories,
    query,
    cursor,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;RECRUITING&#39; | &#39;COMPLETED&#39; | &#39;TERMINATED&#39;**]**Array<&#39;RECRUITING&#39; &#124; &#39;COMPLETED&#39; &#124; &#39;TERMINATED&#39;>** |  | (optional) defaults to undefined|
| **gender** | [**&#39;M&#39; | &#39;W&#39; | &#39;A&#39;**]**Array<&#39;M&#39; &#124; &#39;W&#39; &#124; &#39;A&#39;>** |  | (optional) defaults to undefined|
| **minAge** | [**number**] |  | (optional) defaults to undefined|
| **maxAge** | [**number**] |  | (optional) defaults to undefined|
| **location** | [**string**] |  | (optional) defaults to undefined|
| **categories** | **Array<&#39;CHICKEN&#39; &#124; &#39;CHINESE&#39; &#124; &#39;JAPANESE&#39; &#124; &#39;PIZZA&#39; &#124; &#39;FASTFOOD&#39; &#124; &#39;STEW_SOUP&#39; &#124; &#39;JOK_BO&#39; &#124; &#39;KOREAN&#39; &#124; &#39;SNACK&#39; &#124; &#39;WESTERN&#39; &#124; &#39;DESSERT&#39;>** |  | (optional) defaults to undefined|
| **query** | [**string**] |  | (optional) defaults to undefined|
| **cursor** | [**number**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**BaseResponsePartyScrollResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPartyDetail**
> BaseResponsePartyDetailResponse getPartyDetail()

맛집 탐험 파티 게시글 상세 정보를 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.getPartyDetail(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponsePartyDetailResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPaymentHistories**
> BaseResponsePaymentScrollResponse getPaymentHistories()

결제 내역을 스크롤 방식으로 조회합니다. 사용자의 마이페이지 란에서 조회 가능합니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let size: number; // (optional) (default to 10)
let cursor: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getPaymentHistories(
    size,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **size** | [**number**] |  | (optional) defaults to 10|
| **cursor** | [**number**] |  | (optional) defaults to undefined|


### Return type

**BaseResponsePaymentScrollResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPendingShop**
> getPendingShop(approveRequest)

APPROVED(승인) 또는 REJECTED(거절) (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    ApproveRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)
let approveRequest: ApproveRequest; //

const { status, data } = await apiInstance.getPendingShop(
    shopId,
    approveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **approveRequest** | **ApproveRequest**|  | |
| **shopId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPendingShop1**
> BaseResponseGetAllPendingShopListResponse getPendingShop1()

관리자는 등록을 원하는 식당 리스트를 볼 수 있습니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.getPendingShop1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponseGetAllPendingShopListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfilePresignedUrl**
> BaseResponsePreSignedUrlResponse getProfilePresignedUrl()

내 정보 수정 항목 중 프로필 이미지를 업로드하기 위한 pre-signed url을 생성합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.getProfilePresignedUrl();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BaseResponsePreSignedUrlResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 생성 성공 |  -  |
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getReservations**
> ReservationListResponse getReservations()

식당의 예약 목록을 필터와 커서 기반으로 조회한다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let filter: 'PENDING' | 'CANCELLED' | 'CONFIRMED' | 'REFUSED' | 'TERMINATED'; // (optional) (default to undefined)
let cursor: number; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)
let shopId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getReservations(
    filter,
    cursor,
    size,
    shopId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filter** | [**&#39;PENDING&#39; | &#39;CANCELLED&#39; | &#39;CONFIRMED&#39; | &#39;REFUSED&#39; | &#39;TERMINATED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;CANCELLED&#39; &#124; &#39;CONFIRMED&#39; &#124; &#39;REFUSED&#39; &#124; &#39;TERMINATED&#39;>** |  | (optional) defaults to undefined|
| **cursor** | [**number**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|
| **shopId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ReservationListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 예약 목록 조회 성공 |  -  |
|**404** | 존재하지 않는 shopId |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getReviews**
> BaseResponseReviewPageResponse getReviews()

특정 가게의 리뷰 목록을 조회합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)
let cursor: number; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getReviews(
    shopId,
    cursor,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**BaseResponseReviewPageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getShopAdminDetail**
> BaseResponseShopAdminDetailResponse getShopAdminDetail()

관리자는 식당에 대한 정보를 볼 수 있습니다. (식당의 등록 상태가 뭐든 볼 수 있음) (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)

const { status, data } = await apiInstance.getShopAdminDetail(
    shopId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseShopAdminDetailResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getShops**
> BaseResponseShopsResponse getShops()

일반 사용자가 위치 기반으로 식당 목록을 조회합니다. (식당 상태가 APPROVED인 식당들만 조회 가능) (Completed)  반경은 m 단위로 주시면 되며 ->  3km (3000) 만약 사용자가 자신의 위치를 허용한다면 latitude과 longitude에 사용자 위도 경도, 원하는 범위를 넣어서 요청을 보내고 그렇지 않는다면 기본값으론 종로구 좌표에 3km 범위 식당을 가져옵니다  예시 /shops?radius=1000000&sort=rating  | 필드 명     | 자료형  | 필수 여부 | 설명                   | 기본값           | |------------|---------|-----------|-------------------------|------------------| | latitude   | double  | Required  | 사용자 위치의 위도         | 37.5724          | | longitude  | double  | Required  | 사용자 위치의 경도         | 126.9794         | | radius     | double  | Optional  | 검색 반경 (단위: m)       | 3000.0           | | category   | string  | Optional  | 음식 카테고리             | 전체             | | sort       | string  | Optional  | 정렬 기준 (근처순, 평점순) | 근처 순(distance) |  

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let latitude: number; // (optional) (default to undefined)
let longitude: number; // (optional) (default to undefined)
let radius: number; // (optional) (default to undefined)
let category: Array<'CHICKEN' | 'CHINESE' | 'JAPANESE' | 'PIZZA' | 'FASTFOOD' | 'STEW_SOUP' | 'JOK_BO' | 'KOREAN' | 'SNACK' | 'WESTERN' | 'DESSERT'>; // (optional) (default to undefined)
let sort: string; // (optional) (default to 'distance')
let cursor: number; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getShops(
    latitude,
    longitude,
    radius,
    category,
    sort,
    cursor,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **latitude** | [**number**] |  | (optional) defaults to undefined|
| **longitude** | [**number**] |  | (optional) defaults to undefined|
| **radius** | [**number**] |  | (optional) defaults to undefined|
| **category** | **Array<&#39;CHICKEN&#39; &#124; &#39;CHINESE&#39; &#124; &#39;JAPANESE&#39; &#124; &#39;PIZZA&#39; &#124; &#39;FASTFOOD&#39; &#124; &#39;STEW_SOUP&#39; &#124; &#39;JOK_BO&#39; &#124; &#39;KOREAN&#39; &#124; &#39;SNACK&#39; &#124; &#39;WESTERN&#39; &#124; &#39;DESSERT&#39;>** |  | (optional) defaults to undefined|
| **sort** | [**string**] |  | (optional) defaults to 'distance'|
| **cursor** | [**number**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**BaseResponseShopsResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getShopsBySearch**
> BaseResponseShopPageResponse getShopsBySearch()

키워드로 식당을 검색합니다.정렬기준: NAME, CREATED_AT, RATING  (식당 상태가 APPROVED인 식당들만 조회 가능)(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let query: string; // (optional) (default to undefined)
let sort: 'RATING' | 'CREATED_AT' | 'NAME'; // (optional) (default to 'CREATED_AT')
let cursor: string; // (optional) (default to undefined)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getShopsBySearch(
    query,
    sort,
    cursor,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **query** | [**string**] |  | (optional) defaults to undefined|
| **sort** | [**&#39;RATING&#39; | &#39;CREATED_AT&#39; | &#39;NAME&#39;**]**Array<&#39;RATING&#39; &#124; &#39;CREATED_AT&#39; &#124; &#39;NAME&#39;>** |  | (optional) defaults to 'CREATED_AT'|
| **cursor** | [**string**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**BaseResponseShopPageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **joinParty**
> BaseResponseVoid joinParty()

맛집 탐험 파티를 참여합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.joinParty(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
> BaseResponseVoid login(loginRequest)

폼 로그인으로 로그인합니다. 성공 시 액세스 토큰은 헤더, 리프레시 토큰은 쿠키에 포함됩니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    LoginRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> BaseResponseVoid logout()

쿠키의 리프레시 토큰을 무효화하고 로그아웃 처리합니다.

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let refreshToken: string; // (default to undefined)

const { status, data } = await apiInstance.logout(
    refreshToken
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshToken** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **newInquiry**
> BaseResponsePreSignedUrlListResponse newInquiry(inquiryCreateRequest)

 제목과 내용을 작성하여 문의글을 작성합니다   사진 전송 시 헤더에  Cache-Control 값이 no-cache,no-store,must-revalidate 되어 있어야 합니다  (Completed) 

### Example

```typescript
import {
    APIApi,
    Configuration,
    InquiryCreateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let inquiryCreateRequest: InquiryCreateRequest; //

const { status, data } = await apiInstance.newInquiry(
    inquiryCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inquiryCreateRequest** | **InquiryCreateRequest**|  | |


### Return type

**BaseResponsePreSignedUrlListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **oauth2Urls**
> { [key: string]: string; } oauth2Urls()

프론트는 이 URL로 리디렉션하여 OAuth2 로그인을 시작합니다. 예: /oauth2/authorization/google

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.oauth2Urls();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: string; }**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **oauthSignup**
> BaseResponseVoid oauthSignup(oAuthSignUpRequest)

OAuth 추가 회원가입(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    OAuthSignUpRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let oAuthSignUpRequest: OAuthSignUpRequest; //

const { status, data } = await apiInstance.oauthSignup(
    oAuthSignUpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **oAuthSignUpRequest** | **OAuthSignUpRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ownerTest**
> string ownerTest()


### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.ownerTest();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **quitParty**
> quitParty()

맛집 탐험 파티를 참여를 취소합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.quitParty(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refreshToken**
> BaseResponseAccessTokenResponseDto refreshToken()

쿠키의 리프레시 토큰을 이용해 새로운 액세스 토큰을 재발급합니다.

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let refreshToken: string; // (default to undefined)

const { status, data } = await apiInstance.refreshToken(
    refreshToken
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshToken** | [**string**] |  | defaults to undefined|


### Return type

**BaseResponseAccessTokenResponseDto**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refuseReservation**
> BaseResponseVoid refuseReservation()

reservationId에 해당하는 예약을 CANCELLED 상태로 변경한다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let reservationId: number; // (default to undefined)

const { status, data } = await apiInstance.refuseReservation(
    reservationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 예약 거절 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **saveOrder**
> BaseResponseVoid saveOrder(orderSaveRequest)

1. 결제 요청 전에 주문 정보를 서버에 저장    결제하기 버튼을 누를 때 (실제 결제 요청 api 보내기 전) 호출하면 됩니다. orderId는 클라이언트에서 임의의 랜덤한 숫자로 제작합니다. 2. orderId, amount 저장 3. 이후 결제 요청 / 결제 성공 시 서버에 저장된 값과 비교  → 변조 방지, 악의적인 금액 조작 차단  (Completed) 

### Example

```typescript
import {
    APIApi,
    Configuration,
    OrderSaveRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let orderSaveRequest: OrderSaveRequest; //

const { status, data } = await apiInstance.saveOrder(
    orderSaveRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderSaveRequest** | **OrderSaveRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signup**
> BaseResponseVoid signup(signUpRequest)

폼 로그인 회원가입(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    SignUpRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let signUpRequest: SignUpRequest; //

const { status, data } = await apiInstance.signup(
    signUpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpRequest** | **SignUpRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateMyInfo**
> BaseResponseVoid updateMyInfo(myInfoUpdateRequest)

로그인한 사용자의 마이페이지 정보를 수정합니다.(Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    MyInfoUpdateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let myInfoUpdateRequest: MyInfoUpdateRequest; //

const { status, data } = await apiInstance.updateMyInfo(
    myInfoUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **myInfoUpdateRequest** | **MyInfoUpdateRequest**|  | |


### Return type

**BaseResponseVoid**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 수정 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateShop**
> BaseResponsePreSignedUrlListResponse updateShop(shopUpdateRequest)

자신이 가진 식당 정보를 수정합니다. (Completed)

### Example

```typescript
import {
    APIApi,
    Configuration,
    ShopUpdateRequest
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

let shopId: number; // (default to undefined)
let shopUpdateRequest: ShopUpdateRequest; //

const { status, data } = await apiInstance.updateShop(
    shopId,
    shopUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shopUpdateRequest** | **ShopUpdateRequest**|  | |
| **shopId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponsePreSignedUrlListResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userTest**
> string userTest()


### Example

```typescript
import {
    APIApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new APIApi(configuration);

const { status, data } = await apiInstance.userTest();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

