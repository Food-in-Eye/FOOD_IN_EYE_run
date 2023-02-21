from fastapi import FastAPI

app = FastAPI()


@app.get("/api")
async def hello_world():
    return {"message": "Hello World"}