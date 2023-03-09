"""
User Router
:Android APP과 상호작용
"""

from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["Android"])

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/hi'"}