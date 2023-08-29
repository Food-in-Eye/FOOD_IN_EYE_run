from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from v2.api import v2_router

app = FastAPI()
app.include_router(v2_router)


@app.exception_handler(HTTPException)
async def http_exception_handler(request:Request, e:HTTPException):
    return JSONResponse(
        status_code = e.status_code,
        content = {"detail" : e.detail}
    )

@app.exception_handler(AssertionError)
async def http_exception_handler(request:Request, e:AssertionError):
    return JSONResponse(
        status_code = 403,
        content = {"detail" : str(e)}
    )

@app.get("/")
async def hello():
    return {"message": "Hello World"}