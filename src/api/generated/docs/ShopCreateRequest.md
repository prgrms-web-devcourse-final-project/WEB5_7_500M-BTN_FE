# ShopCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**shopName** | **string** | 상점 이름 | [default to undefined]
**roadAddress** | **string** | 도로명 주소 | [default to undefined]
**detailAddress** | **string** | 상세 주소 | [default to undefined]
**sido** | **string** | 시/도 | [default to undefined]
**latitude** | **number** | 위도 | [default to undefined]
**longitude** | **number** | 경도 | [default to undefined]
**businessCode** | **string** | 사업자 등록번호 | [default to undefined]
**category** | **string** | 음식 카테고리 (아래 값 중 하나를 입력하세요): - CHICKEN: 치킨 - CHINESE: 중식 - JAPANESE: 일식 - PIZZA: 피자 - FASTFOOD: 패스트푸드 - STEW_SOUP: 찜/탕 - JOK_BO: 족발/보쌈 - KOREAN: 한식 - SNACK: 분식 - WESTERN: 양식 - DESSERT: 카페/디저트  | [default to undefined]
**reservationFee** | **number** | 예약 수수료 | [default to undefined]
**openTime** | **string** | 영업 시작 시간 | [optional] [default to undefined]
**closeTime** | **string** | 영업 종료 시간 | [optional] [default to undefined]
**description** | **string** | 상점 설명 | [default to undefined]
**tel** | **string** | 전화번호 | [default to undefined]
**imageCount** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ShopCreateRequest } from '@/api/generated';

const instance: ShopCreateRequest = {
    shopName,
    roadAddress,
    detailAddress,
    sido,
    latitude,
    longitude,
    businessCode,
    category,
    reservationFee,
    openTime,
    closeTime,
    description,
    tel,
    imageCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
