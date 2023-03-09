# FOOD_IN_EYE_run

## 실행 방법  

1. 최상위 디렉토리(Docker-compose.yaml이 있음)에서 
2. Docker Compose 빌드하기
    
    ```bash
    docker-compose up --build
    ```
    
3. 끝!  
`localhost`로 접속하면 웹페이지가 뜨는 것을 확인할 수 있다.  
`localhost/api/v1/hi` 등과 같이 `api/v1`으로 시작하는 경로를 입력하면 fastapi로 구축한 서버로 연결된다.
    