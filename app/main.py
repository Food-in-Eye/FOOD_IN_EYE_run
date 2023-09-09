from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from core.error.exception import APIException,CustomException

from v2.api import v2_router

app = FastAPI()
app.include_router(v2_router)

'''
현재 이 페이지에 주석처리 되어있는 코드들은 어떤 이유로 남겨져 있는지 궁금합니다.
만약 이제는 더 필요가 없다거나 과거 테스트 용이였다면 지우고, 적절한 이유가 있다면 주석을 추가해 주시길 바랍니다.
'''

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:8000"],              # 허용된 오리진(도메인) 목록
#     allow_credentials=True,                               # (애매함) 클라이언트가 요청 시 자격증명(쿠키 http 인증)을 포함할 수 있는가
#     allow_methods=["POST", "GET", "PUT"],                 # 허용된 HTTP 메서드 목록
#     allow_headers=["Authorization", "Content-Type"],      # 허용된 HTTP 헤더 목록
# )

exmanager = APIException()

@app.exception_handler(CustomException)
async def http_exception_handler(request:Request, ex:CustomException):
    status_code, detail = exmanager.get_status(ex)

    print(f'ERROR {ex.status_code}, {detail}')
    return JSONResponse(
        status_code = status_code, 
        content = {'detail' : detail}
    )


@app.get("/")
async def hello():
    return {"message": "Hello World"}