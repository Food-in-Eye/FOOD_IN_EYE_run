"""
WebSocket
"""

from core.common.mongo2 import MongodbController

from fastapi import WebSocket, WebSocketDisconnect
import json
from typing import Optional

DB = MongodbController('FIE_DB')


class ConnectionManager:
    """ 연결된 Web, App Websocket들을 관리하는 클래스

        1. self.web_connections : Web 연결 정보 
            -> {websocket, s_id}
        2. self.app_connections : app 연결 정보 
            -> {websocket, h_id, orders[{o_id, s_id, status}]}
    """

    def __init__(self):
        self.web_connections: list[dict[str, any]] = []
        self.app_connections: list[dict[str, any]] = []

    async def connect(self, websocket: WebSocket, s_id: str|None, h_id: str|None):
        """ websocket 연결을 허용하고 s_id, history 입력값에 따라 web, app을 구분하여 저장한다. 
            1. s_id 입력시, web_connections에 저장
                - web_connections = [{websocket, s_id}]
            2. h_id 입력시, app_connections에 저장
                - app_connections = [{websocket, h_id, orders}]
        """
        await websocket.accept()

        if check_client(s_id, h_id) == False:
            raise WebSocketDisconnect(f'The connection is denied due to the wrong ID.')
        
        data = {"type": "connect", "condition": "connected"}
        await self.send_client_json(websocket, data)

        if s_id:
            self.check_connections(s_id)
            connection = {"websocket": websocket, "s_id": s_id}
            self.web_connections.append(connection)

        elif h_id:
            self.check_connections(h_id)
            history = DB.read_by_id('history', h_id)

            count = 0
            orders_list = []
            for o_id in history['orders']:
                count += 1
                order = DB.read_by_id('order', o_id)
                orders_list.append({"o_id": o_id, "s_id": order['s_id'], "status": order['status']})

            connection = {"websocket": websocket, "h_id": history['_id'], "orders": orders_list}
            self.app_connections.append(connection)

        else:
            raise WebSocketDisconnect(f'The connection is denied.')
        self.printList()

    async def disconnect(self, client:WebSocket):
        """ client(web or app)의 연결을 해지한다.
            - input : client
                - client가 web이면, web_connections에서 삭제
                - client가 app이면, app_connections 삭제
            - return : X
            - error : raise WebSocketDisconnect()
            - 예외가 발생할 때 
        """
        await client.close()
        self.check_connections(client)


    async def handle_message(self, client:WebSocket, data:json, h_id:str): # 특수 문자열 체크, 이외의 문자열은 그대로 출력
        """ client(web or app)으로부터 받은 data에 따라 관리한다.
            - parameter : client, data, h_id
                - 'type' : 'update state' -> web이 주문 상태 변경, 전송 결과를 web에게 출력
                - 'type' : 'create order' -> app이 주문 접수, 전송 결과를 app에게 출력
                - 'type' : 'connect' -> 연결 확인
                - 그외 : 입력받은 문자열 그대로 출력
            - return : X
        """
        data = json.loads(data)

        if data['type'] == 'update_state':
            data = await self.send_update(data['o_id'])
            await self.send_client_json(client, data)          
        elif data['type'] == 'create_order':
            data = await self.send_create(data['h_id'])
            await self.send_client_json(client, data)          

        elif data['type'] == 'connect':
            if data['condition'] == "close":
                if h_id:
                    await self.send_connect_alarm(h_id, data)
                data['condition'] = 'closed'
                await self.send_client_json(client, data)
                await self.disconnect(client)
                raise WebSocketDisconnect(f'The client requested to close the connection.')
            elif data['condition'] == "connect":
                data['condition'] = 'connected'
                await self.send_client_json(client, data)
            else:
                data['message'] = 'connected'
                await self.send_client_json(client, data)
        else:
            await self.send_client_json(client, data)

    async def send_client_json(self, client:WebSocket, data:json):
        """ client(web or app)에게 data를 전송한다.
            - input : client, data
            - return : X
            - error_type : {"type": "send_client", "result": "ERROR"}
        """
        if client:
            await client.send_json(data)
            print(f"# Send To ({client}) : {data}")
        else:
            data = {"type": "send_client", "result": "ERROR", "reason" : "the client is not connected"}
            await client.send_json(data)
    
    async def receive_client_json(self, client:WebSocket):
        """ client(web or app)로부터 data를 수신한다.
            - input : client
            - return : data
            - error_type : {"type": "recieve_client", "result": "ERROR"}
        """
        if client:
            data = await client.receive_text()
            if json.dumps(data):
                return data
            print(f'# Receive From ({client}) : {data}')
        else:
            data = {"type": "recieve_client", "result": "ERROR", "result": "the client is not connected"}
            await self.send_client_json(client, data)



    def printList(self):
        """ web_connections, app_connections 관리를 위해 현재 상태를 출력한다. """
        for i in range(0, len(self.web_connections)):
            print(f"Web Connection : {i}, {self.web_connections[i]}")
        for i in range(0, len(self.app_connections)):
            print(f"App Connection : {i}, {self.app_connections[i]}")

    def check_connections(self, check:any):
        """ web_connections, app_connections의 요소들을 검사한다. 
            - input : check -> (websocket / s_id / h_id)
            - return : X
            1. self.connect() : s_id(web), h_id(app)을 이용해 list에서 존재하는 경우 삭제
            2. self.disconnect() : websocket을 이용해 list에서 삭제
        """
        for i, conn in enumerate(self.web_connections):
            if conn['websocket'] == check or conn['s_id'] == check:
                del self.web_connections[i]
                break
        for i, conn in enumerate(self.app_connections):
            if conn['websocket'] == check or conn['h_id'] == check:
                del self.app_connections[i]
                break



    async def get_app_connection(self, o_id: str) -> dict:
        """ o_id를 가지는 client(app)의 정보 리턴 
            - input : o_id
            - return 
                - app이 연결되어 있는 경우 : client{h_id, o_id, status, h_websocket}
                - app이 연결되지 않은 경우 : False
        """
        client = {}
        for connect in self.app_connections:
            for order in connect['orders']:
                if order['o_id'] == o_id:
                    client['h_id'] = connect['h_id']
                    client['o_id'] = order['o_id']
                    client['status'] = order['status']
                    client['h_websocket'] = connect['websocket']

                    return client
        return False
                   
    async def get_web_connection(self, h_id:str) -> list[dict]:
        """ web_connections에서 s_id를 찾아 web_connections에 저장된 client(web)의 정보를 리턴
            - input : h_id
            - return
                - web이 연결되어 있는 경우 : client[{o_id, s_id, s_websocket}]
                - 일부 web이 연결되어 있는 경우 : 연결되지 않은 web의 s_websocket은 빈 문자열
                - 모든 web이 연결되지 않은 경우 : []
        """
        clients = []
        if self.web_connections:
            app_order_list = []
            for app in self.app_connections:
                if app['h_id'] == h_id:
                    app_order_list = app['orders']
            
            for order in app_order_list:
                client = {}
                client['o_id'] = order['o_id']
                client['s_id'] = order['s_id']
                client['s_websocket'] = ""

                for web in self.web_connections:    
                    if web['s_id'] == order['s_id']:
                        client['s_websocket'] = web['websocket']
                clients.append(client)
        return clients

    async def send_connect_alarm(self, h_id:str, data:json):
        """ app이 연결 해지 요청 시, web에게 연결을 끊어도 된다는 data를 전송한다.
        
        """
        clients = await self.get_web_connection(h_id)

        if clients:
            for client in clients:
                s_id = client['s_id']
                data['condition'] = 'completion'

                if client['s_websocket']:
                    await self.send_client_json(client['s_websocket'], data)
                    print(f'# Send To ({s_id}): {data}')


            

    async def send_create(self, h_id:str):
        """ (POST order) app이 web에게 주문 생성을 알린다.
            - input : h_id
            - 전송 성공 
                - web : {"o_id" : o_id}
                - app : result = {"type": "create_order", "result": "success"}
            - 전송 실패 
                - app : result = {"type": "create_order", "result": "fail"}
            - return : result(전송 여부 list)
        """
        data = {}
        result = []
        clients = await self.get_web_connection(h_id)

        if clients:
            for client in clients:
                s_id = client['s_id']
                data['o_id'] = client['o_id']

                if client['s_websocket']:
                    await self.send_client_json(client['s_websocket'], data)
                    print(f'# Send To ({s_id}): {data}')

                    result.append({"type": "create_order", "result": "success", "reason": s_id})
                else:
                    result.append({"type": "create_order", "result": "fali", "reason": f'web client({s_id}) is not connected'})
        else:
            result.append({"type": "create_order", "result": "fali", "reason": f'all web client is not connected'})
        return result
    
    async def send_update(self, o_id : str):
        """ (PUT order) web이 app에게 주문 상태 변경을 알린다.
            - input : o_id
            - 전송 성공 
                - app : {"o_id" : o_id, 'status" : int}
                - web : {"type": "update_status", "result": "success"}
            - 전송 실패 
                - app :  {"type": "update_status", "result": "fail"}
            - return : data(전송 여부)
        """
        client = await self.get_app_connection(o_id)

        data = {}
        if client:

            data['o_id'] = client['o_id']
            if client['status'] < 2:
                client['status'] += 1
                data['status'] = client['status']
                await self.send_client_json(client['h_websocket'], data)

                h_id = client['h_id']
                print(f'# Send To ({h_id}): {data}')

                return {"type": "update_status", "result": "success"}
            return {"type": "update_status", "result": "fail", "reason": "status is already finish"}
        return {"type": "update_status", "result": "fail", "reason": "app client is not connected"}


def check_client(s_id:str, h_id:str):
    try:
        if s_id:
            if DB.read_by_id('store', s_id):
                print(s_id)
                return True
        elif h_id:
            if DB.read_by_id('history', h_id):
                print(h_id)
                return True
        else:
            False
    except Exception:
        pass
    return False