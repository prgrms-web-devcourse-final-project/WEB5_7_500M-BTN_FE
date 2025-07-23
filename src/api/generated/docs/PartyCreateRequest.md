# PartyCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | 게시글 제목 | [default to undefined]
**shopId** | **number** | 음식점 ID | [default to undefined]
**metAt** | **string** | 모임 일시 | [default to undefined]
**deadline** | **string** | 파티 모집 마감 일시 | [default to undefined]
**genderCondition** | **string** | 모집 성별(W(여자), M(남자), A(무관) 중 택 1 | [default to undefined]
**minAge** | **number** | 모집 최소 나이 | [optional] [default to undefined]
**maxAge** | **number** | 모집 최대 나이 | [optional] [default to undefined]
**minCount** | **number** | 파티 최소 인원(파티 호스트 포함) | [default to undefined]
**maxCount** | **number** | 파티 최대 인원(파티 호스트 포함) | [default to undefined]
**description** | **string** | 게시글 본문 | [optional] [default to undefined]

## Example

```typescript
import { PartyCreateRequest } from '@/api/generated';

const instance: PartyCreateRequest = {
    title,
    shopId,
    metAt,
    deadline,
    genderCondition,
    minAge,
    maxAge,
    minCount,
    maxCount,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
