# PartyMemberResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** | 파티원 ID | [optional] [default to undefined]
**userNickname** | **string** | 파티원 닉네임 | [optional] [default to undefined]
**userProfile** | **string** | 파티원 프로필 이미지 URL | [optional] [default to undefined]
**isHost** | **boolean** | 파티장 여부 | [optional] [default to undefined]

## Example

```typescript
import { PartyMemberResponse } from '@/api/generated';

const instance: PartyMemberResponse = {
    userId,
    userNickname,
    userProfile,
    isHost,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
