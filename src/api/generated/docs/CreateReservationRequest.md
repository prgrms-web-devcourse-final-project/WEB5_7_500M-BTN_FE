# CreateReservationRequest

예약 생성 요청 DTO

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**date** | **string** | 예약 날짜 (yyyy-MM-dd 형식) | [default to undefined]
**time** | **string** | 예약 시간 (HH:mm 형식) | [default to undefined]
**headCount** | **number** | 예약 인원 수 | [optional] [default to undefined]
**reservationFee** | **number** | 예약금 (최소 1000원) | [optional] [default to undefined]

## Example

```typescript
import { CreateReservationRequest } from '@/api/generated';

const instance: CreateReservationRequest = {
    date,
    time,
    headCount,
    reservationFee,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
