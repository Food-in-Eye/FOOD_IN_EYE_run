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
        "name": "(Before the change) string1",
        "desc": str,
        "schedule": str,
        "notice": str,
        "status": int,
        "img_src": str,
        "m_id": str
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


### `PUT /api/v1/admin/store/<object_ID>` 
object_ID를 가지는 가게 정보를 수정한다.  
> Body에 다음과 같이 수정하고자 하는 정보를 적어 보내야 한다.

#### Request Body

```json
{
    "request": "api/v1/admin/store/<object_ID>",
    "status": "OK",
        "name": "(After the change) string2",
        "desc": str,
        "schedule": str,
        "notice": str,
        "status": int,
        "img_src": str,
        "m_id": str
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
                "name": str,
                "desc": str,
                "schedule": str,
                "notice": str,
                "status": int,
                "img_src": str,
                "m_id": str
            },
            {
                "name": str,
                "desc": str,
                "schedule": str,
                "notice": str,
                "status": int,
                "img_src": str,
                "m_id": str
            }
        ]
    }
}
```
