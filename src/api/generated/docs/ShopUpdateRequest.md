# ShopUpdateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**shopName** | **string** | 상점 이름 | [optional] [default to undefined]
**roadAddress** | **string** | 도로명 주소 | [optional] [default to undefined]
**detailAddress** | **string** | 상세 주소 | [optional] [default to undefined]
**sido** | **string** | 시/도 | [optional] [default to undefined]
**latitude** | **number** | 위도 | [optional] [default to undefined]
**longitude** | **number** | 경도 | [optional] [default to undefined]
**businessCode** | **string** | 사업자 등록번호 | [optional] [default to undefined]
**category** | **string** | 음식 카테고리 | [optional] [default to undefined]
**reservationFee** | **number** | 예약 수수료 | [optional] [default to undefined]
**openTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**closeTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**description** | **string** | 상점 설명 | [optional] [default to undefined]
**tel** | **string** | 전화번호 | [optional] [default to undefined]
**imageCount** | **number** | 이미지 개수 | [optional] [default to undefined]

## Example

```typescript
import { ShopUpdateRequest } from '@/api/generated';

const instance: ShopUpdateRequest = {
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
