# ReservationListResponse

예약 목록 응답 DTO

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | [**Array&lt;ReservationContent&gt;**](ReservationContent.md) | 예약 요약 정보 리스트 | [optional] [default to undefined]
**nextCursor** | **number** | 다음 페이지 커서. 더 이상 없으면 null | [optional] [default to undefined]

## Example

```typescript
import { ReservationListResponse } from '@/api/generated';

const instance: ReservationListResponse = {
    content,
    nextCursor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
