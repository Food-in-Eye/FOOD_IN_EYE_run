from fastapi import FastAPI
from v2.api import v2_router

app = FastAPI()

app.include_router(v2_router)

@app.get("/")
async def hello():
    return {"message": "Hello World"}