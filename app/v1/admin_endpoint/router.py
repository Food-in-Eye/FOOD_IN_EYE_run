"""
Admin Router
:React WEB과 상호작용
"""

from fastapi import APIRouter
from .store import store_router
from .menu import menu_router
from .food import food_router

router = APIRouter(prefix="/admin", tags=["Web"])
router.include_router(store_router)
router.include_router(menu_router)
router.include_router(food_router)

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/admin/hi'"}

