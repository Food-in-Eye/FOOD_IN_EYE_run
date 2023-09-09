from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from core.error.exception import APIException,CustomException

from v2.api import v2_router

app = FastAPI()
app.include_router(v2_router)

exmanager = APIException()

@app.exception_handler(CustomException)
async def http_exception_handler(request:Request, ex:CustomException):
    status_code, detail = exmanager.get_status(ex)

    print(f'ERROR {ex.status_code}, {detail}')
    return JSONResponse(
        status_code = status_code, 
        content = {'detail' : detail}
    )
    
@app.exception_handler(AssertionError)
async def assert_exception_handler(request:Request, ex:AssertionError):
    status_code, detail = exmanager.get_status_assert(ex)

    print(f'ERROR {ex.args[0]}, {detail}')
    return JSONResponse(
        status_code = status_code, 
        content = {'detail' : detail}
    )


@app.get("/")
async def hello():
    return {"message": "Hello World"}