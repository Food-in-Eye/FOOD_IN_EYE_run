from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from core.error.exception import APIException,CustomException

from v2.api import v2_router

app = FastAPI()
app.include_router(v2_router)

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
    
    # 아래 코드로 동작 시 에러 발생
    # if ex_status_code != 500:
    #     raise HTTPException(status_code=ex_status_code, detail=ex_detail)
    # raise HTTPException(status_code=500, detail=ex)

@app.exception_handler(AssertionError)
async def assert_exception_handler(request:Request, ex:AssertionError):
    status_code, detail = exmanager.get_status_assert(ex)

    print(f'ERROR {ex.args[0]}, {detail}')
    return JSONResponse(
        status_code = status_code, 
        content = {'detail' : detail}
    )
# @app.exception_handler(AssertionError)
# async def http_exception_handler(request:Request, e:AssertionError):
#     ex_status_code, ex_detail = exmanager.get_status(e)

#     if ex_status_code != 500:
#         return JSONResponse(
#             status_code = ex_status_code,
#             content = {"detail" : ex_detail}
#         )

        # 아래 코드로 동작 시 에러 발생
        # raise HTTPException(status_code=ex_status_code, detail=ex_detail)


@app.get("/")
async def hello():
    return {"message": "Hello World"}