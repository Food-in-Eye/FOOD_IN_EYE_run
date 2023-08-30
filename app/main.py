from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

from v2.api import v2_router

app = FastAPI()
app.include_router(v2_router)
app.add_middleware(middleware_class=BaseHTTPMiddleware)


# @app.exception_handler(HTTPException)
# async def http_exception_handler(request:Request, e:HTTPException):
#     return JSONResponse(
#         status_code = e.status_code,
#         content = {"detail" : e.detail}
#     )

# @app.exception_handler(AssertionError)
# async def http_exception_handler(request:Request, e:AssertionError):
#     return JSONResponse(
#         status_code = 403,
#         content = {"detail" : str(e)}
#     )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:8000"],              # 허용된 오리진(도메인) 목록
#     allow_credentials=True,                               # (애매함) 클라이언트가 요청 시 자격증명(쿠키 http 인증)을 포함할 수 있는가
#     allow_methods=["POST", "GET", "PUT"],                 # 허용된 HTTP 메서드 목록
#     allow_headers=["Authorization", "Content-Type"],      # 허용된 HTTP 헤더 목록
# )

@app.get("/")
async def hello():
    return {"message": "Hello World"}