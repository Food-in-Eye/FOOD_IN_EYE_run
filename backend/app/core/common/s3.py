import os
import boto3
import uuid
import json
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from core.error.exception import CustomException

class Storage:
    
    def __init__(self, bucket_name:str) -> None:
        load_dotenv()
        
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY'],
            aws_secret_access_key=os.environ['AWS_SECRET_KEY']
            )
        
        self.bucket = bucket_name
    
    def upload(self, file_data, form:str, path:str, key=None)-> str:
        ''' 주어진 key로 S3에 파일을 저장하는 함수. Key값이 주어지지 않으면 랜덤한 값으로 생성함. '''
        if key is None:
            key = uuid.uuid4()
        key = path + '/' + str(key) + '.' + form

        if form == "json":
            file_data = json.dumps(file_data)

        try:
            self.s3.put_object(Bucket=self.bucket, Key=key, Body=file_data)
        except ClientError:
            raise CustomException(503.61)
        
        return str(key)
    
    def get_json(self, key:str) -> dict:
        response = self.s3.get_object(Bucket=self.bucket, Key=key)
        data = response['Body'].read().decode('utf-8')
        return json.loads(data)
        
    def delete(self, key:str) -> None:
        self.s3.delete_object(Bucket=self.bucket, Key=key)

    def get_list(self, prefix, extension=None):
        objects = self.s3.list_objects(Bucket=self.bucket, Prefix=prefix)
        result = []
        try:
            for content in objects['Contents']:
                key = content['Key']
                if extension is None:
                    result.append(key)
                elif key.endswith('.json'):
                    result.append(key)
            return result
        except:
            return "ERROR"