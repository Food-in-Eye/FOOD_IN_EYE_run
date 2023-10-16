"""
exhibition_router
"""

from fastapi import APIRouter, Depends, Request
from datetime import timedelta
from core.common.mongo import MongodbController
from core.common.s3 import Storage
from .src.util import Util

exhibition_router = APIRouter(prefix="/exhibition")

PREFIX = 'api/v2/exhibition'
DB = MongodbController('FIE_DB2')

storage = Storage('foodineye2')


@exhibition_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@exhibition_router.get("/historys")
async def get_todat_history():
    today = Util.get_utc_time()
    # today = Util.get_utc_time_by_str("2023-09-20")

    pipeline = [
        { "$match": { "date": {"$gte": today, "$lt": today + timedelta(days=1)} } },
        { "$project": { "_id":1, "date":1, "fixation_path":1 }} 
    ]

    historys = DB.aggregate_pipline('history', pipeline)

    for history in historys:
        history['_id'] = str(history['_id'])
        history['date'] = Util.get_local_time(history['date'])
    
    return historys