"""
menu_router
"""

from fastapi import APIRouter

menu_router = APIRouter(prefix="/menus")

PREFIX = 'api/v2/menus'

@menu_router.get("/")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}