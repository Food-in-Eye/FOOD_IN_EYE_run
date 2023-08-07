from mongo2 import MongodbController

from pydantic import Field

from datetime import datetime, timedelta
import pandas as pd

DB = MongodbController('FIE_DB2')

class StoreModel:
    def __init__(self, id, num):
        self.s_id = id
        self.s_num = num
        self.total_count: int = Field(title="number of ordered food per day")
        self.total_price: int = Field(title="sales per day")
        self.hourly_sale: int = Field(title="sales per hour")
        self.f_list: list[FoodModel] = Field(title="list of ordered food per day")

class FoodModel:
    def __init__(self, id, num):
        self.f_id = id
        self.f_num = num
        self.price: int = Field(title="price of food")
        self.count = 0


class OrderAnalysisController:
    """ pandas 모듈을 사용하여 판매 통계 분석을 돕는 클래스 """

    def create_flat_df(orders):
        df = pd.DataFrame(orders)

        # "date" 컬럼을 datetime 형식으로 변환
        df['date'] = pd.to_datetime(df['date'])
        
        # 데이터 내부의 리스트를 푼 df 생성
        flat_data = []
        for index, row in df.iterrows():
            for item in row['f_list']:
                new_row = {"date": row['date'], "f_id": item['f_id'], "price": item['price'], "count": item['count']}
                flat_data.append(new_row)
                
        return pd.DataFrame(flat_data)


analysis = OrderAnalysisController()


# DB에 저장된 store 정보 가져오기
store_list = DB.read_all('store')

# 자정 이후 분석하므로, 분석 날짜는 어제
# today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
# yesterday = today - timedelta(1)
today = datetime(2023, 7, 26)
yesterday = datetime(2023, 7, 25)

for store in store_list:
    analysis_store = StoreModel(store["_id"], store["num"])


    # orderDB에서 store['_id']의 어제 하루동안의 모든 주문내역 불러오기
    orders = DB.read_all_by_two_field('order', 's_id', store['_id'], 'date', yesterday, today)

    # 데이터프레임 생성하기
    df = analysis.create_flat_df(orders)
    
    for 
    break

def count_per_food(df, f_id):
    return df[df['f_id'] == f_id].sum()

def count_hourly_food_group_by_fid(df):
    return df.groupby(['f_id', pd.Grouper(freq='1H')])['count'].sum()

def count_hourly_food_group_by_hour(df):
    return df.groupby([pd.Grouper(freq='1H'), 'f_id'])['count'].sum()

# # 인덱스 설정
# flat_df.set_index('date', inplace=True)

# # 1시간 단위로 그룹화하여 각 id의 count 합계 계산
# result = flat_df.groupby(['f_id', pd.Grouper(freq='1H')])['count'].sum()
# result = flat_df.groupby([pd.Grouper(freq='1H'), 'f_id'])['count'].sum()
# max_count_time = result.idxmax()
# print(max_count_time)

# # 결과 출력
# print(result)




# # 필요한 내용만 남기기
# for store in store_list:
#     analysis_store = StoreModel()

#     analysis_store.s_id = store["_id"]
#     analysis_store.s_num = store["num"]
    

