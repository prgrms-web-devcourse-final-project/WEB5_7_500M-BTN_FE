# CommentCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**parentId** | **number** | 부모 댓글 ID (대댓글인 경우) | [optional] [default to undefined]
**content** | **string** | 댓글 내용 | [default to undefined]

## Example

```typescript
import { CommentCreateRequest } from '@/api/generated';

const instance: CommentCreateRequest = {
    parentId,
    content,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
