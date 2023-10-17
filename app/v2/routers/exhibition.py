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

@exhibition_router.get("/visualize")
async def get_fixation_data(fix_key:str):
    fix_data = storage.get_json(fix_key)
    result = []
    
    for page in fix_data:
        new_fixs = []
        for fix in page['fixations']:
            new_fixs.append({
                'x':int(fix['cx']),
                'y':int(fix['cy']),
                'd':fix['et'] - fix['st']
            })
        result.append({
            "page": page['page'],
            "s_num": page['s_num'],
            "f_num": page['f_num'],
            "fixations": new_fixs
        })
        
    return result