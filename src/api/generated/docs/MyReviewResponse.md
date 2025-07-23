# MyReviewResponse

리뷰 정보 요약

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reviewId** | **number** | 리뷰 ID | [optional] [default to undefined]
**shopName** | **string** | 가게 이름 | [optional] [default to undefined]
**rating** | **number** | 평점 | [optional] [default to undefined]
**content** | **string** | 리뷰 내용 | [optional] [default to undefined]
**createdAt** | **string** | 작성일 | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** | 리뷰 이미지 목록 | [optional] [default to undefined]

## Example

```typescript
import { MyReviewResponse } from '@/api/generated';

const instance: MyReviewResponse = {
    reviewId,
    shopName,
    rating,
    content,
    createdAt,
    images,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
