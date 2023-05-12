"""
WebSocket
"""

from core.common.mongo2 import MongodbController

from fastapi import WebSocket, WebSocketDisconnect
import json

DB = MongodbController('FIE_DB')


class ConnectionManager:
    """ 연결된 Web, App Websocket들을 관리하는 클래스

        1. self.web_connections : Web 연결 정보 
            -> {websocket, s_id}
        2. self.app_connections : Web 연결 정보 
            -> {websocket, history{_id, orders[{o_id, s_id, status}]}}
    """

    def __init__(self):
        self.web_connections: list[dict[str, any]] = []
        self.app_connections: list[dict[str, any]] = []

    async def connect(self, websocket: WebSocket, s_id: str|None, h_id: str|None):
        """ websocket 연결을 허용하고 s_id, history 입력값에 따라 web, app을 구분하여 저장한다. """
        
        await websocket.accept()

        if s_id:        # web connection
            connection = {"websocket": websocket, "s_id": s_id}
            self.web_connections.append(connection)
        elif h_id:      # app connection      
            history = DB.read_by_id('history', h_id)

            orders_list = []
            for o_id in history['orders']:
                order = DB.read_by_id('order', o_id)
                status = order['status']
                orders_list.append({"o_id": o_id, "s_id": order['s_id'], "status": status})

            connection = {"websocket": websocket, "h_id": history['_id'], "orders": orders_list}
            self.app_connections.append(connection)
        else:
            raise WebSocketDisconnect(f'The connection is denied.')

        self.printList()

            
    async def get_app_connection(self, o_id: str):
        """ PUT (web -> app) : o_id를 가지는 app의 websocket 리턴 """

        for connect in self.app_connections:
            for order in connect['orders']:
                if order['o_id'] == o_id:
                    # order['status'] += 1
                    client = connect['websocket']
                    return client
        return False
                   
    async def get_web_connection(self, s_id:str):
        """ s_id를 가지는 web의 websocket 리턴 """

        for connect in self.web_connections:
            if connect['s_id'] == s_id:
                client = connect['websocket']
                return client
        return False
    
    
    async def send_client_json(self, client:WebSocket, data:json):
        """ client(web or app)에게 data를 전송한다.
            - parameter : WebSocket, json
            - return : X
            - error_type : send_client
        """
        if client:
            await client.send_json(data)
            print(f"# Send To ({client}) : {data}")
        else:
            data = {"type": "send_client", "condition": "ERROR 'the client is not connected'"}
            await self.send_client_json(client, data)
    
    async def receive_client_json(self, client:WebSocket):
        """ client(web or app)로부터 data를 수신한다.
            - parameter : WebSocket
            - return : data
            - error_type : recieve_client
        """
        if client:
            data = await client.receive_text()
            if json.dumps(data):
                return data
            print(f'# Receive From ({client}) : {data}')
        else:
            data = {"type": "recieve_client", "condition": "ERROR 'the client is not connected'"}
            await self.send_client_json(client, data)


    async def handle_message(self, client:WebSocket, data : json): # 특수 문자열 체크, 이외의 문자열은 그대로 출력
        """ client(web or app)으로부터 받은 data에 따라 관리한다.
            - parameter : WebSocket, json
                - 'type' : 'update state' -> web이 주문 상태 변경, 전송 결과를 web에게 출력
                - 'type' : 'create order' -> app이 주문 접수, 전송 결과를 app에게 출력
                - 'type' : 'connect' -> 연결 확인
                - 그외 : 입력받은 문자열 그대로 출력
            - return : X

        """
        data = json.loads(data)

        if data['type'] == 'update state':
            data = await self.send_update(data['o_id'])
            await client.send_json(data)                # 요청자에게 보내기
        elif data['type'] == 'create order':
            data = await self.send_create(data['h_id'])
            await client.send_json(data)                # 요청자에게 보내기

        elif data['type'] == 'connect':
            if data['condition'] == "close":
                data['condition'] = 'closed'
                await self.send_client_json(client, data)
                await self.disconnect(client)
                raise WebSocketDisconnect(f'The client requested to close the connection.')
            elif data['condition'] == "connect":
                data['condition'] = 'connected'
                await self.send_client_json(client, data)
        else:
            await self.send_client_json(client, data)

    async def disconnect(self, client:WebSocket):
        """ client(web or app)의 연결을 해지한다.
            - parameter : WebSocket
                - WebSocket이 web이면, web_connections에서 삭제
                - WebSocket이 app이면, app_connections 삭제
            - return : X
            - error : raise WebSocketDisconnect()
        """
        if await client.close() == None:
            for i, conn in enumerate(self.web_connections):
                if conn['websocket'] == client:
                    del self.web_connections[i]
                    break
            for i, conn in enumerate(self.app_connections):
                if conn['websocket'] == client:
                    del self.app_connections[i]
                    break
                
    def printList(self):
        """ web_connections, app_connections 관리를 위해 현재 상태를 출력한다.
            - patameter : X
            - return : X
        """
        for i in range(0, len(self.web_connections)):
            print(f"Web Connection : {i}, {self.web_connections[i]}")
        for i in range(0, len(self.app_connections)):
            print(f"App Connection : {i}, {self.app_connections[i]}")

            

    async def send_create(self, h_id:str):
        """ (POST order) app이 web에게 주문 생성을 알린다.
            - parameter : h_id
            - return : data
                - 전송 성공 : {"o_id" : o_id}
                - 전송 실패 : {"type": "create order", "condition": "ERROR"}
            - 예외 발생 대신 전송 여부를 요청자(app)에게 전송
        """
        data = {}
        for connect in self.app_connections:
            if connect['h_id'] == h_id:
                for order in connect['orders']:
                    client = await self.get_web_connection(order['s_id'])
                    data['type'] = 'create order'
                    data['o_id'] = order['o_id']
                    await client.send_json(data)

                    s_id = order['s_id']
                    print(f'# Send To ({s_id}): {data}')
                return data
            
        data = {"type": "create order", "condition": "ERROR 'web client is not connected'"}
        return data
    
    async def send_update(self, o_id : str):
        """ (PUT order) web이 app에게 주문 상태 변경을 알린다.
            - parameter : o_id
            - return : data
                - 전송 성공 : {"o_id" : o_id, 'status" : int}
                - 전송 실패 : {"type": "update status", "condition": "ERROR"}
            - 예외 발생 대신 전송 여부를 요청자(app)에게 전송
        """
        client = await self.get_app_connection(o_id)

        data = {}
        if client:
            for connect in self.app_connections:
                if connect['websocket'] == client:
                    for order in connect['orders']:
                        if order['o_id'] == o_id:
                            data['o_id'] = order['o_id']
                            order['status'] += 1
                            data['status'] = order['status']
                    await client.send_json(data)
                    print(f'# Send To : {data}')
            return data

        data = {"type": "update status", "condition": "ERROR 'app client is not connected'"}
        return data
