# CreateReservationResponse

예약 생성 응답 DTO

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** | 예약 ID | [optional] [default to undefined]
**shopName** | **string** | 식당 이름 | [optional] [default to undefined]
**dateTime** | **string** | 예약 일시 (yyyy-MM-dd HH:mm) | [optional] [default to undefined]
**headCount** | **number** | 예약 인원 수 | [optional] [default to undefined]
**status** | **string** | 예약 상태 | [optional] [default to undefined]

## Example

```typescript
import { CreateReservationResponse } from '@/api/generated';

const instance: CreateReservationResponse = {
    reservationId,
    shopName,
    dateTime,
    headCount,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
