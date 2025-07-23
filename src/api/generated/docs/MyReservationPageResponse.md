# MyReservationPageResponse

내 예약 목록 응답

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | [**Array&lt;MyReservationResponse&gt;**](MyReservationResponse.md) | 예약 목록 | [optional] [default to undefined]
**nextCursor** | **number** | 다음 커서 ID | [optional] [default to undefined]

## Example

```typescript
import { MyReservationPageResponse } from '@/api/generated';

const instance: MyReservationPageResponse = {
    content,
    nextCursor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
