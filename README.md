# Custom Channel Integration Example

In this example we will be integrating the respond.io platform with the third party platform to use them as a channel inside respond.io.

In this example we will be using the [ClickSend](https://clicksend.com) SMS provider as a reference

## Endpoints

| Method | Path | Description |
| ---- | ------ | ------------------ |
| POST| /message | Handle outbound messages i.e. receive messages from the respond.io and pass them to the clicksend using API |
| POST| /clicksend/push_message | Handle inbound messages i .e receive messages from the clicksend and pass them to the respond.io using webhook |


## Sequence Diagrams
We will be explaining the outbound and inbound message handling with the help of sequence diagrams
### Outbound Message
```mermaid
sequenceDiagram
    participant Respond.io
    participant Integration Server
    participant Click Send
    Respond.io->>Integration Server: Outbound message (send message endpoint)
    Integration Server->>Click Send: Calls SMS send API with the outbound message
    Click Send->>Integration Server: Response 200 OK or 4xx
    Integration Server->>Respond.io: Response 200 OK or 4xx with error message
    
```
### Inbound Message
```mermaid
sequenceDiagram
    participant Respond.io
    participant Integration Server
    participant Click Send
    
    Click Send->>Integration Server: Inbound message (push_message endpoint)
    Integration Server->>Respond.io: Calls webhook with the inbound message
    
    Respond.io->>Integration Server: Response 200 OK or 4xx
    Integration Server->>Click Send: Response 200 OK or 4xx
    
```





