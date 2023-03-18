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

### `GET /api/v1/admin/store/hi`
Returns test message

```
{ 
    "message": "Hello 'api/v1/admin/hi'" 
}
```

### `GET /api/v1/admin/store/<object_ID>` 
object_ID를 가지는 가게 정보를 받아온다.  

#### Response 

```json
{
    "_id": {
        "$oid": "641458bd4443f2168a32357a"
    },
    "name": "니나노덮밥",  
    "desc": "맛있는 함박오므라이스와 카레라이스를 팝니다~!",  
    "schedule": "9시~18시 영업, 수요일 휴무",  
    "notice": "null",  
    "status": 1,  
    "img_src": "image/ninano/store",  
    "m_id": "null"
}
```

- error 1 (ID가 존재하지 않는 경우)   

    ```json
    { 
        "request": "api/v1/admin/store/<641458bd4443f2168a32357c>", 
        "status": "OK", 
        "message": "ERROR Failed to READ document with id '641458bd4443f2168a32357c'" 
    }
    ```

- error 2 (ID의 길이가 형식과 맞지 않은 경우)

    ```json
    {
        "request": "api/v1/admin/store/<641458bd4443f2168a32357>", 
            "status": "OK", 
        "message": "ERROR '641458bd4443f2168a32357' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    }
    ```

### `PUT /api/v1/store/<object_ID>?=` 
object_ID를 가지는 가게 정보를 수정한다.  
> Body에 다음과 같이 수정하고자 하는 정보를 적어 보내야 한다.

#### Request Body

```json
{  
    "name": "니나노덮밥",  
    "desc": "맛있는 함박오므라이스와 카레라이스를 팝니다~!",  
    "schedule": "9시~18시 영업, 목요일 휴무",  
    "notice": "null",  
    "status": 1,  
    "img_src": "image/ninano/store",  
    "m_id": "null" 
}
```

#### Response
  
```json
{
    "_id": {
        "$oid": "641458bd4443f2168a32357a"
    },
    "name": "니나노덮밥",  
    "desc": "맛있는 함박오므라이스와 카레라이스를 팝니다~!",  
    "schedule": "9시~18시 영업, 목요일 휴무",  
    "notice": "null",  
    "status": 1,  
    "img_src": "image/ninano/store",  
    "m_id": "null"
}
```

- error 1 (Body에 정보를 보내지 않은 경우)   
    
     ```json
    { 
        "detail": [
            {
                "loc": ["body"], 
                "msg": "field required", 
                "type": "value_error.missing"
            }
        ] 
    }
    ```

- error 2 (Body에 Not NULL인 정보를 입력하지 않은 경우)  

    ```json
    {  
        "detail": [
            {
                "loc": ["body","name"], 
                "msg": "field required", 
                "type": "value_error.missing"
            }
        ]
    }
    ```
---
## Android APP과 상호작용 

### `GET /api/v1/user/hi`
Returns test message

#### Response

```json
{
    "message": "Hello 'api/v1/user/hi'"
}
```

### `GET /api/v1/user/stores`
전체 가게 정보를 받아온다.

#### Response   

```json
{
    "data": [
        {
            "_id": {
                "$oid": "641458bd4443f2168a32357a"
            },
            "name": "니나노덮밥",  
            "desc": "맛있는 함박오므라이스와 카레라이스를 팝니다~!",  
            "schedule": "9시~18시 영업, 목요일 휴무",  
            "notice": "null",  
            "status": 1,  
            "img_src": "image/ninano/store",  
            "m_id": "null"
        },
        {
            "_id": {
                "$oid": "641459134443f2168a32357b"
            },
            "name": "파스타",  
            "desc": "다양한 양식 음식이 있습니다.",  
            "schedule": "9시~18시 영업, 주말 제외",  
            "notice": "개인사정으로 다음주 화요일까지 잠시 휴업합니다.",  
            "status": 2,  
            "img_src": "image/pasta/store",  
            "m_id": "null"
        }
    ]
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
