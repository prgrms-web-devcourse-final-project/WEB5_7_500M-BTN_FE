# ChatControllerApi

All URIs are relative to *https://matjalalzz.shop*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**loadChatHistory**](#loadchathistory) | **GET** /parties/{partyId}/chat/load | |
|[**restoreChat**](#restorechat) | **GET** /parties/{partyId}/chat/restore | |

# **loadChatHistory**
> BaseResponseChatMessagePageResponse loadChatHistory()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let partyId: number; // (default to undefined)
let cursor: number; // (default to undefined)

const { status, data } = await apiInstance.loadChatHistory(
    partyId,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|
| **cursor** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseChatMessagePageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **restoreChat**
> BaseResponseListChatMessageResponse restoreChat()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from '@/api/generated';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let partyId: number; // (default to undefined)

const { status, data } = await apiInstance.restoreChat(
    partyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **partyId** | [**number**] |  | defaults to undefined|


### Return type

**BaseResponseListChatMessageResponse**

### Authorization

[JwtAuth](../README.md#JwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

