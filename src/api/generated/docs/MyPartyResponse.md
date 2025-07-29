# MyPartyResponse

파티 정보 요약

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**partyId** | **number** | 파티 ID | [optional] [default to undefined]
**title** | **string** | 파티 제목 | [optional] [default to undefined]
**shopName** | **string** | 가게 이름 | [optional] [default to undefined]
**metAt** | **string** | 만남 일시 | [optional] [default to undefined]
**deadline** | **string** | 모집 마감 시간 | [optional] [default to undefined]
**status** | **string** | 파티 상태 | [optional] [default to undefined]
**maxCount** | **number** | 최대 인원 | [optional] [default to undefined]
**minCount** | **number** | 최소 인원 | [optional] [default to undefined]
**currentCount** | **number** | 현재 인원 | [optional] [default to undefined]
**genderCondition** | **string** | 성별 조건 | [optional] [default to undefined]
**minAge** | **number** | 최소 나이 | [optional] [default to undefined]
**maxAge** | **number** | 최대 나이 | [optional] [default to undefined]
**description** | **string** | 설명 | [optional] [default to undefined]
**isHost** | **boolean** | 호스트 여부 (본인이 이 파티의 파티장인지 확인) | [optional] [default to undefined]

## Example

```typescript
import { MyPartyResponse } from '@/api/generated';

const instance: MyPartyResponse = {
    partyId,
    title,
    shopName,
    metAt,
    deadline,
    status,
    maxCount,
    minCount,
    currentCount,
    genderCondition,
    minAge,
    maxAge,
    description,
    isHost,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
