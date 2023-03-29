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

mongo_food = MongodbController('food')
food_router = APIRouter(prefix="/foods")
storage = Storage('foodineye')

# todo: get(read), post(create), delete(delete) 추가할 것 
#       +) 음식 이미지 변경도 가능해야함

@food_router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/foods/hi'"}

@food_router.put('/{f_id}')
async def put_food(f_id:str, food:FoodModel):
    """ 해당하는 id의 document를 변경한다.(food 수정) """
    data = food.dict()

    try:
        if mongo_food.update(f_id, data):
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
        mongo = MongodbController('food')
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

