# FOOD-IN-EYE_server

## 실행 방법  

1. `Dockerfile` 이 있는 경로에서 터미널 열기
2. Docker image 빌드하기
    
    ```bash
    docker build --tag myimage .
    ```
    
    참고: tag는 식별용임
    
3. Docker container 실행하기
    
    ```bash
    docker run -p 8000:8000 myimage
    ```
    
4. 브라우저에서 `localhost:8000` 으로 접속 가능
   
## .env 파일 작성 방법

1. 루트에 .env 파일 생성하기
2. mongoDB 연결하기

    ```bash
    mongodb+srv://<username>:<password>@food-in-eye-mongo.opxseft.mongodb.net/test
    ```

3. 개인 ID, PW 작성 후 저장하기

---
## test 용 api 리스트
- `GET /`  
-> {"message": "Hello World"}  
- `GET /api/v1/hi`  
-> {"message": "Hello 'api/v1'"}
- `GET /api/v1/user/hi`  
-> {"message": "Hello 'api/v1/user/hi'"}
- `GET /api/v1/admin/hi`  
-> {"message": "Hello 'api/v1/admin/hi'"}  
  
> 브라우저 주소창에 `localhost:8000/api/v1/hi`와 같이 입력하여 확인한다.
---

## React WEB과 상호작용

### `GET /api/v1/admin/store/<object_ID>` 
object_ID를 가지는 가게 정보를 받아온다.  

#### Response Body

```json
{
    "request": "api/v1/admin/store/<object_ID>",
    "status": "OK",
    "response": {
        "name": "string1"
    }
}
```

- error 1 (ID가 존재하지 않는 경우)   

    ```json
    { 
        "request": "api/v1/admin/store/<object_ID>", 
        "status": "OK", 
        "message": "ERROR Failed to READ document with id '<object_ID>'" 
    }
    ```

- error 2 (ID의 길이가 형식과 맞지 않은 경우)

    ```json
    {
        "request": "api/v1/admin/store/<object_ID>",   
        "status": "OK", 
        "message": "ERROR '<object_ID>' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    }
    ```

### `PUT /api/v1/admin/store/<object_ID>` 
object_ID를 가지는 가게 정보를 수정한다.  
> Body에 다음과 같이 수정하고자 하는 정보를 적어 보내야 한다.

#### Request Body

```json
{
    "request": "api/v1/admin/store/<object_ID>",
    "status": "OK",
    "response": {
        "name": "string2"
    }
}
```

#### Response Body
  
```json
{
    "request": "api/v1/admin/store/<object_ID>",
    "status": "OK",
}
```

- error 1 (저장된 값과 수정 값이 일치하는 경우)

    ```json
    {
        "request": "api/v1/admin/store/<object_ID>",   
        "status": "ERROR",   
        "message": "ERROR No write concern mode named 'majority\\\")' found in replica set configuration, full error: {'code': 79, 'codeName': 'UnknownReplWriteConcern', 'errmsg': 'No write concern mode named \\'majority\\\\\")\\' found in replica set configuration', 'errInfo': {'writeConcern': {'w': 'majority\")', 'wtimeout': 0, 'provenance': 'clientSupplied'}}}"
    }
    ```

---
## Android APP과 상호작용 

### `GET /api/v1/user/stores`
전체 가게 정보를 받아온다.

#### Response Body

```json
{
    "request": "api/v1/user/store/<object_ID>",
    "status": "OK",
    "response": {    
        "data": [
            {
                "name": "string2",
            },
            {
                "name": "string3",  
            }
        ]
    }
}
```

- error 1 (식당이 존재하지 않는 경우)

    ```json   
    { 
        "request": "api/v1/user/stores", 
        "status": "OK", 
        "response": [] 
    }
    ```
