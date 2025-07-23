# MyReservationResponse

예약 정보 요약

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** | 예약 ID | [optional] [default to undefined]
**shopName** | **string** | 가게 이름 | [optional] [default to undefined]
**name** | **string** | 예약자 이름 | [optional] [default to undefined]
**reservedAt** | **string** | 예약 일시 | [optional] [default to undefined]
**headCount** | **number** | 예약 인원 | [optional] [default to undefined]
**reservationFee** | **number** | 예약금 | [optional] [default to undefined]
**status** | **string** | 예약 상태 | [optional] [default to undefined]

## Example

```typescript
import { MyReservationResponse } from '@/api/generated';

const instance: MyReservationResponse = {
    reservationId,
    shopName,
    name,
    reservedAt,
    headCount,
    reservationFee,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
