# ShopOwnerDetailResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**shopId** | **number** |  | [optional] [default to undefined]
**shopName** | **string** |  | [optional] [default to undefined]
**category** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**roadAddress** | **string** |  | [optional] [default to undefined]
**detailAddress** | **string** |  | [optional] [default to undefined]
**tel** | **string** |  | [optional] [default to undefined]
**openTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**closeTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**rating** | **number** |  | [optional] [default to undefined]
**reservationFee** | **number** |  | [optional] [default to undefined]
**reviewCount** | **number** |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**businessCode** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ShopOwnerDetailResponse } from '@/api/generated';

const instance: ShopOwnerDetailResponse = {
    shopId,
    shopName,
    category,
    description,
    roadAddress,
    detailAddress,
    tel,
    openTime,
    closeTime,
    rating,
    reservationFee,
    reviewCount,
    images,
    businessCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
