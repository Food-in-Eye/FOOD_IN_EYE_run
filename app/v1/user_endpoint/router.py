"""
User Router
:Android APP과 상호작용
"""

from fastapi import APIRouter
from .store import store_router

router = APIRouter(prefix="/user", tags=["Android"])
router.include_router(store_router)

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/hi'"}
