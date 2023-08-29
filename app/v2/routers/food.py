"""
food_router
"""
import io
from PIL import Image

from fastapi import APIRouter, UploadFile, Depends, Request
from core.models.store import FoodModel
from core.common.mongo import MongodbController
from core.common.s3 import Storage
from .src.util import Util

from core.common.authority import TokenManagement
TokenManager = TokenManagement()

food_router = APIRouter(prefix="/foods", dependencies=[Depends(TokenManager.dispatch)])

PREFIX = 'api/v2/foods'
DB = MongodbController('FIE_DB2')
storage = Storage('foodineye2')

@food_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@food_router.get("/q")
async def read_all_food(s_id:str): 
    """ 주어진 가게에 속하는 음식 정보를 모두 받아온다. """

    try:
        Util.check_id(s_id)

        response = DB.read_all('food', {'s_id': s_id})

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}?s_id={s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}?s_id={s_id}',
        'status': 'OK',
        'response': response
    }

@food_router.get("/food")
async def read_food(id:str):
    """ 해당하는 id의 음식 정보를 받아온다. """

    try:
        _id = Util.check_id(id)

        response = DB.read_one('food', {'_id': _id})
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}/food?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}/food?id={id}',
        'status': 'OK',
        'response': response
    }

@food_router.post("/food")
async def create_food(s_id:str, food:FoodModel):
    """ 해당하는 id의 음식 정보를 업데이트한다. """

    data = food.dict()

    data['s_id'] = s_id
    data['img_key'] = None

    try:
        food_list = DB.read_all('food', {'s_id': s_id})
        if not food_list:
            data['num'] = 1
        else:
            max_num = max(store['num'] for store in food_list)
            data['num'] = max_num + 1

        id = str(DB.insert_one('food', data))

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/food?s_id={s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'POST {PREFIX}/food?s_id={s_id}',
        'status': 'OK',
        'document_id': id
    }

@food_router.put('/food')
async def update_food(id:str, food:FoodModel):
    """ 해당하는 id의 food 정보를 변경한다. """
    data = food.dict()

    try:
        _id = Util.check_id(id)
        if DB.replace_one('food', {'_id':_id}, data):
            return {
                'request': f'PUT {PREFIX}/food?id={id}',
                'status': 'OK'
            }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'PUT {PREFIX}/food?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }


@food_router.put('/food/image')
async def update_food_image(id: str, file: UploadFile):
    try:
        _id = Util.check_id(id)

        current = DB.read_one('food', {'_id':_id})

        if current['img_key'] is not None:
            storage.delete(current['img_key'])

        file_content = await file.read()
        
        # re-size 기능 고민
        if file.content_type not in ["image/jpeg", "image/jpg"]:
            with Image.open(io.BytesIO(file_content)) as im:
                im = im.convert('RGB')
                with io.BytesIO() as output:
                    im.save(output, format='JPEG')
                    file_content = output.getvalue()
            
        image_key = storage.upload(file_content, form='jpg', path='images')
        
        if DB.update_one('food', {'_id': _id}, {'img_key': image_key}):
            return {
                'request':f'PUT {PREFIX}/food/image?id={id}',
                'status': 'OK',
                'img_url': 'https://foodineye2.s3.ap-northeast-2.amazonaws.com/' + image_key
            }
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'PUT {PREFIX}/food/image?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
