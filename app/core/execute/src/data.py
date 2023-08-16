
class FoodData:
    
    def __init__(self, f_num:int) -> None:
        self.f_num = f_num
        self.total_sales:int = 0                    # f_num의 하루 판매액이다.
        self.total_count:int = 0                    # f_num의 하루 판매 수량이다.
        self.hourly_sale_info:list[dict] = []       # f_num의 1시간 단위로 판매된 정보(hour, count, price)이다.
    

class StoreData:
    def __init__(self, s_num:int) -> None:
        self.s_num = s_num
        self.food_dict:dict[FoodData] = {}          # s_num의 f_num들의 정보를 저장한다. (f_num의 중복 없음)
        self.hourly_sale_info:list = []             # s_num의 1시간 단위로 판매된 정보(hour, count, price)이다.

        self.total_order:int = 0                    # 주문 건당 평균 금액을 알기 위해 order의 개수를 센다.
        self.order_list:list = []                   # 시간별 통계를 위해 각 가게에서 발생한 모든 order들을 저장한다. (f_num의 중복 있음)

