"""
user_router
"""

from fastapi import APIRouter
from core.models import *
from core.common.mongo2 import MongodbController

user_router = APIRouter(prefix="/users")

PREFIX = 'api/v2/users'
DB = MongodbController('FIE_DB2')

@user_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

