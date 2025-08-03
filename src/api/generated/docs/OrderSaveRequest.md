# OrderSaveRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **string** | 클라이언트에서 생성한 주문 id | [default to undefined]
**amount** | **number** | 결제 금액은 포인트 충전 머니입니다.. 1000원부터 1000원 단위로 50000원까지 충전 가능합니다. | [optional] [default to undefined]

## Example

```typescript
import { OrderSaveRequest } from '@/api/generated';

const instance: OrderSaveRequest = {
    orderId,
    amount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
