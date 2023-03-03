from fastapi import FastAPI
from v1.api import v1_router

app = FastAPI()
app.include_router(v1_router)

@app.get("/")
async def hello():
    return {"message": "Hello World"}