"""
Admin Router
:React WEB과 상호작용
"""

from fastapi import APIRouter
from .store import store_router

router = APIRouter(prefix="/admin", tags=["Web"])
router.include_router(store_router)

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/admin/hi'"}

