from fastapi import APIRouter

from .admin_endpoint.router import router as admin_router
from .user_endpoint.router import router as user_router

v1_router = APIRouter(prefix="/api/v1", tags=["v1"])
v1_router.include_router(admin_router)
v1_router.include_router(user_router)

@v1_router.get("/")
async def hello_api():
    return {"message": "Hello 'api/v1'"}