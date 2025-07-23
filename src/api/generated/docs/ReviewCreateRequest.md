# ReviewCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** | 예약 ID | [default to undefined]
**shopId** | **number** | 음식점 ID | [default to undefined]
**content** | **string** | 리뷰 내용 | [default to undefined]
**rating** | **number** | 별점(0.5~5.0) | [default to undefined]
**imageCount** | **number** | 리뷰 이미지 목록 | [optional] [default to undefined]

## Example

```typescript
import { ReviewCreateRequest } from '@/api/generated';

const instance: ReviewCreateRequest = {
    reservationId,
    shopId,
    content,
    rating,
    imageCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
