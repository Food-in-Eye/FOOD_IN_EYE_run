
from fastapi import APIRouter
from core.common.mongo2 import MongodbController

from datetime import datetime, timedelta

router = APIRouter(prefix="/testt")
DB = MongodbController('FIE_DB2')


class OrderAnalysisController:
    def __init__(self):
        self.s_num = int
    
@router.get('/')
async def read_all_store():
    """ DB에 존재하는 모든 식당의 정보를 받아온다 """

    try:
        result = DB.read_all('store')
        response = []

        for r in result:
            response.append(r)
            

    except Exception as e:
        print('ERROR', e)
        return {
            'message': f'ERROR {e}'
        }
    
    return {
        'response': response
    }