"""
Admin Router
:React WEB과 상호작용
"""

from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Web"])

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/admin/hi'"}