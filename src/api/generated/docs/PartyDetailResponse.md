# PartyDetailResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**partyId** | **number** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**maxCount** | **number** |  | [optional] [default to undefined]
**minCount** | **number** |  | [optional] [default to undefined]
**currentCount** | **number** |  | [optional] [default to undefined]
**genderCondition** | **string** |  | [optional] [default to undefined]
**minAge** | **number** |  | [optional] [default to undefined]
**maxAge** | **number** |  | [optional] [default to undefined]
**metAt** | **string** |  | [optional] [default to undefined]
**deadline** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**shopId** | **number** |  | [optional] [default to undefined]
**shopName** | **string** |  | [optional] [default to undefined]
**shopRoadAddress** | **string** |  | [optional] [default to undefined]
**shopDetailAddress** | **string** |  | [optional] [default to undefined]
**shopImage** | **string** |  | [optional] [default to undefined]
**members** | [**Array&lt;PartyMemberResponse&gt;**](PartyMemberResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PartyDetailResponse } from '@/api/generated';

const instance: PartyDetailResponse = {
    partyId,
    title,
    description,
    status,
    maxCount,
    minCount,
    currentCount,
    genderCondition,
    minAge,
    maxAge,
    metAt,
    deadline,
    createdAt,
    shopId,
    shopName,
    shopRoadAddress,
    shopDetailAddress,
    shopImage,
    members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
