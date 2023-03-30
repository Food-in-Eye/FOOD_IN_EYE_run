"""
user_food
:Android APP에서 음식 정보를 불러오기
"""
import io
from PIL import Image

from fastapi import APIRouter, UploadFile
from core.models.store import FoodModel
from core.common.mongo import MongodbController
from core.common.s3 import Storage

mongo = MongodbController('food')
food_router = APIRouter(prefix="/foods")
storage = Storage('foodineye')

@food_router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/foods/hi'"}

@food_router.get("/{f_id}")
async def get_food(f_id:str):
    """ 해당하는 id의 음식 정보를 받아온다. """

    try:
        response = mongo.read_one(f_id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/foods/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/foods/{f_id}',
        'status': 'OK',
        'response': response
    }

@food_router.post("/")
async def post_food(food:FoodModel):
    """ 해당하는 id의 음식 정보를 업데이트한다. """
    data = food.dict()
    try:
        id = mongo.create(data)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/foods',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/foods',
        'status': 'OK',
        'document_id': str(id)
    }

@food_router.put('/{f_id}')
async def put_food(f_id:str, food:FoodModel):
    """ 해당하는 id의 document를 변경한다.(food 수정) """
    data = food.dict()

    try:
        if mongo.update(f_id, data):
            return {
                'request': f'api/v1/admin/foods/{f_id}',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/foods/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/foods/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

@food_router.put('/image/{f_id}')
async def update_food_image(f_id: str, file: UploadFile):
    try:
        current = mongo.read_all_by_id(f_id)

        # 이전에 저장되어 있던 이미지는 삭제
        if current['img_key'] is not None:
            storage.delete(current['img_key'])
            
        file_content = await file.read()
        
        if file.content_type not in ["image/jpeg", "image/jpg"]:
            with Image.open(io.BytesIO(file_content)) as im:
                im = im.convert('RGB')
                with io.BytesIO() as output:
                    im.save(output, format='JPEG')
                    file_content = output.getvalue()
            
        # S3에 이미지 업로드
        image_key = storage.upload(file_content, form='jpg', path='images')
        
        # image_key를 데이터베이스에 업데이트
        if mongo.update_one(f_id, 'img_key', image_key):
            return {
                'request': f'api/v1/admin/foods/image/{f_id}',
                'status': 'OK',
                'img_url': 'https://foodineye.s3.ap-northeast-2.amazonaws.com/' + image_key
            }
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/foods/image/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

