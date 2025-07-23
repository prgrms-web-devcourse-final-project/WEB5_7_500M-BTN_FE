# ReservationContent

예약 요약 정보 DTO

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** | 예약 ID | [optional] [default to undefined]
**shopName** | **string** | 식당 이름 | [optional] [default to undefined]
**reservedAt** | **string** | 예약 일시 (yyyy-MM-dd HH:mm) | [optional] [default to undefined]
**headCount** | **number** | 예약 인원 수 | [optional] [default to undefined]
**phoneNumber** | **string** | 예약자 전화번호 | [optional] [default to undefined]
**status** | **string** | 예약상태 | [optional] [default to undefined]

## Example

```typescript
import { ReservationContent } from '@/api/generated';

const instance: ReservationContent = {
    reservationId,
    shopName,
    reservedAt,
    headCount,
    phoneNumber,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
