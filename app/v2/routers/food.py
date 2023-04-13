"""
food_router
"""

from fastapi import APIRouter

food_router = APIRouter(prefix="/foods")

@food_router.get("/")
async def hello():
    return {"message": "Hello 'api/v2/foods'"}