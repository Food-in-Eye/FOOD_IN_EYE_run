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
- `GET /api/v1/user/hi` : 연결 테스트 문구이다.   
-> {"message": "Hello 'api/v1/admin/hi'"}
- `GET/api/v1/admin/store/<object_ID>` : object_ID를 가지는 가게 정보를 받아온다.   
1. 옳게 작성한 경우   
    {"request": "api/v1/admin/store/<object_ID>",   
    "status": "OK",   
    "response": {[{"_id(가게식별자)", "name(가게명)", "desc(설명)", "schedule(영업시간)", "notice(공지사항)", "status(영업상태)", "img_src(가게이미지)", "m_id(메뉴식별자)"}]}}
2. 잘못 작성한 경우(<object_ID>가 존재하지 않는 경우)   
    {"request": "api/v1/admin/store/<wrong object_ID>",   
    "status": "ERROR",   
    "message": "ERROR Failed to READ document with id '<wrong object_ID>'"}
3. 잘못 작성한 경우(<object_ID>의 길이가 형식과 맞지 않은 경우)   
    {..."message": "ERROR '<object_ID - 1>' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"}
- `PUT /api/v1/store/<object_ID>?=` : object_ID를 가지는 가게 정보를 수정한다.   
    `Body(raw .json)  {  "name": "str",  "desc": "str",  "schedule": "str",  "notice": "str",  "status": 1,  "img_src": "str",  "m_id": "str"  }` : 변경하고자 하는 데이터를 입력한다.
1. 옳게 작성한 경우  
    {"request": "api/v1/admin/store/641458bd4443f2168a32357a",  
    "status": "ERROR",  
    "message": "ERROR No write concern mode named 'majority\\\")' found in replica set configuration, full error: {'code': 79, 'codeName': 'UnknownReplWriteConcern', 'errmsg': 'No write concern mode named \\'majority\\\\\")\\' found in replica set configuration', 'errInfo': {'writeConcern': {'w': 'majority\")', 'wtimeout': 0, 'provenance': 'clientSupplied'}}}"
}
2. 잘못 작성한 경우(Body에 정보를 보내지 않은 경우)   
    {"detail": [{"loc": ["body"], "msg": "field required", "type": "value_error.missing"}]}
3. 잘못 작성한 경우(Body에 필수 작성해야 하는 정보를 입력하지 않은 경우)  
    {"detail": [{"loc": ["body","name"], "msg": "field required", "type": "value_error.missing"}]}
---
## Android APP과 상호작용 
- `GET /api/v1/user/hi` : 연결 테스트 문구이다.   
-> {"message": "Hello 'api/v1/user/hi'"}
- `GET /api/v1/user/stores` : 전체 가게 정보를 받아온다.   
1.  옳게 작성한 경우   
    {"request": "api/v1/user/stores",   
     "status": "OK",    
     "response": {[{"_id(가게식별자)", "name(가게명)", "desc(설명)", "schedule(영업시간)", "notice(공지사항)", "status(영업상태)", "img_src(가게이미지)", "m_id(메뉴식별자)"}]}}
2. 잘못 작성한 경우(식당이 존재하지 않는 경우)   
    {"request": "api/v1/user/stores", "status": "OK", "response": []}
