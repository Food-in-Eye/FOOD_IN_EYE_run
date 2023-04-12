import os
import boto3
import uuid
from dotenv import load_dotenv

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

        self.s3.put_object(Bucket=self.bucket, Key=key, Body=file_data)

        return key
        
    def delete(self, key:str) -> None:
        self.s3.delete_object(Bucket=self.bucket, Key=key)

