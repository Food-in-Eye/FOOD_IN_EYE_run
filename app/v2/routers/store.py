"""
store_router
"""

from fastapi import APIRouter

store_router = APIRouter(prefix="/stores")

@store_router.get("/")
async def hello():
    return {"message": "Hello 'api/v2/stores'"}