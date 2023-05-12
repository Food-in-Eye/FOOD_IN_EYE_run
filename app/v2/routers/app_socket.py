"""
app_socket_router
"""

from fastapi import APIRouter
from core.common.mongo2 import MongodbController
from .src.util import Util

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import json


app_socket_router = APIRouter(prefix="/app_socket")

PREFIX = 'api/v2/app_socket'
DB = MongodbController('FIE_DB')

@app_socket_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}


html = """
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>로그인</h1>
        <form id="loginForm" method="post">
            <label for="username">사용자 이름:</label>
            <input type="text" id="username" name="username">
            <br>

            <input type="submit" value="로그인">
        </form>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            const loginForm = document.getElementById('loginForm');
            const wsIdElem = document.querySelector('#ws-id');
            const wsUrl = 'ws://localhost:8000/api/v2/app_socket/ws';
            let socket = null;

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;

                if (1) {
                    const wsId = username;
                    wsIdElem.textContent = wsId;
                    socket = new WebSocket(`${wsUrl}?id=${wsId}`);
                    socket.onmessage = function(event) {
                        const messages = document.getElementById('messages');
                        const message = document.createElement('li');
                        const content = document.createTextNode(event.data);
                        message.appendChild(content);
                        messages.appendChild(message);
                    };
                } else {
                    console.log('로그인 실패');
                }
            });

            function sendMessage(event) {
                const input = document.getElementById('messageText');
                socket.send(input.value);
                input.value = '';
                event.preventDefault();
            }
        </script>
    </body>
</html>
"""

class CustomJSONEncoder(json.JSONEncoder):  # json.dumps() 변환 불가 시 return typeError -> return False
    def default(self, obj):
        try:
            return super().default(obj)
        except TypeError:
            return False

class websocketClient:

    def __init__(self):
        from .web_socket import manager as web_websocket
        self.websocket : WebSocket
    
    async def connect(self, websocket : WebSocket):
        self.websocket = websocket

        await self.websocket.accept()
        return True
    
    async def send_json(self, data : json):
        await self.websocket.send_json(data)
        return data

    async def receive_json(self):
        data = await self.websocket.receive_text()
        if json.dumps(data):
            return data
        self.send_json({'type' : 'error', 'event' : 'send data tpye is not json'})  # 혹시라도 json.dumps() 불가 시 에러(연결 종료)를 방지하기 위한 에러 메시지
    
    async def disconnect(self):
        if await self.websocket.close() == None:
            return True
        return False


    
class ConnectionManager:

    def __init__(self):
        self.active_connections: list[dict[str, any]] = []

    async def connect(self, h_id : str, websocket: WebSocket, history : dict):
        client = websocketClient()
        if await client.connect(websocket):
            connection = {"websocket": client, "history": history}
            self.active_connections.append(connection)
        self.printList()
    
    async def get_client(self, h_id : str):
        for connect in self.active_connections:
            history = connect['history']
            if history['_id'] == h_id:
                return connect['websocket']
        return None
    
    async def send_json(self, h_id : str, data : json):
        client = await self.get_client(h_id)

        if client:
            await client.send_json(data)
            print(f"# Send To ({h_id}) : {data}")
            return True
    
    async def receive_json(self, h_id : str):
        client = await self.get_client(h_id)

        if client:
            data = await client.receive_json()
            print(f'# Receive From ({h_id}) : {data}')
            return data

    async def handle_message(self, h_id : str, data : json): # 특수 문자열 체크, 이외의 문자열은 그대로 출력
        data = json.loads(data)

        if data['type'] == 'update':
            await self.send_update(data['o_id'])
        elif data['type'] == 'connect':
            if data['condition'] == "close":
                data['condition'] = 'closed'
                await self.send_json(h_id, data)
                await self.disconnect(h_id)
                raise WebSocketDisconnect(f'The client({h_id}) requested to terminate the connection.')
            elif data['condition'] == "connect": # 연결 확인 -> 정해진 문자열 입력 시 정해진 문자열 출력
                data['condition'] = 'connected'
                await self.send_json(h_id, data)
            else:
                await self.send_json(h_id, data)

    async def disconnect(self, h_id : str):
        client = await self.get_client(h_id)

        if client:
            if await client.disconnect():
                for i, conn in enumerate(self.active_connections):
                    history = conn['history']
                    if history['_id'] == h_id:
                        del self.active_connections[i]
                        break
    
    def printList(self):
        for i in range(0, len(self.active_connections)):
            print(f"App Connection : {i}, {self.active_connections[i]}")

            
    # web에게 create 전송하기
    # async def send_create(self, user_id : str):
    #     client = await web_websocket.get_client(user_id)

    #     if client:
    #         data = await client.receive_json()
    #         print(f'# Receive From ({user_id}) : {data}')
    #         return data
    
    async def get_client_to_o_id(self, o_id : str):
        for connect in self.active_connections:
            history = connect['history']
            orders = history['orders']

            for order in orders:
                if order['o_id'] == o_id:
                    order['status'] += 1

                    return connect['websocket']
        return None
    
    async def send_update(self, o_id : str):
        client = await self.get_client_to_o_id(o_id)

        if client:
            for connect in self.active_connections:
                if connect['websocket'] == client:
                    data = connect['history']
            await client.send_json(data)
            print(f'# Send To : {data}')
            return data
        else:
            data = {"type": "update", "condition": "error"}
            return data


    # 테스트 중 -> client 에서 보내면 server 는 응답
    # async def send_heartbeat(self, websocket : WebSocket):
    #     while websocket.client_state == WebSocketState.CONNECTED:
    #         await asyncio.sleep(30)
    #         try:
    #             await websocket.send_json({'type': 'heartbeat'})
    #         except WebSocketDisconnect:
    #             break


manager = ConnectionManager()

@app_socket_router.get("/")
async def client_get():
    return HTMLResponse(html)

# client가 사용할지 의문이라서 우선 주석 처리
# @app_socket_router.get("/websocket/list")
# async def get():
#     manager.printList()
#     print(manager.active_connections)
#     return f'hi {manager.active_connections}'

# websocket을 연견할 때 서버가 id, token이 일치하는지 확인하는 코드
# order의 status를 가져오므로 연결이 끊어져도 현황 유지 가능
async def check_history(id : str):
    history = DB.read_by_id('history', id)
    if history:
        del history['date']
        del history['total_price']
        del history['gaze_path']

        orders_list = []
        for o_id in history['orders']:
            order = DB.read_by_id('order', o_id)
            s_id = order['s_id']
            if order:
                status = order['status']
            orders_list.append({"o_id": o_id, "s_id": s_id, "status": status})
        history["orders"] = orders_list
        return history
    return False


@app_socket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, id : str): # token 이 추가되어야 함
    try:
        history = await check_history(id)
        await manager.connect(id, websocket, history)

        while True:
            data_list = []

            data = await manager.receive_json(id) # websocket 형식 정하고 json으로 바꿀 것 json_str = json.dumps(data)
            await manager.handle_message(id, data)

            

    except WebSocketDisconnect as d:
        print(f'Websocket : {d}')

        await manager.disconnect(id)
        manager.printList()


# 어떤 오류를 세워야하는지 애매(http or websocket)
@app_socket_router.get("/websocket/connect")
async def client_check_connect(id : str):
    if DB.read_by_id('history', id):
        data = {"type":"connect", "condition":"connected"}

        if await manager.send_json(id, data):
            response = data
        else:
            response = False
    else:
        response = False
    return {
        'request': f'{PREFIX}/websocket/connect?id={id}',
        'status': 'OK',
        'response': response
    }

@app_socket_router.get("/websocket/close")
async def client_check_connect(id : str):
    if DB.read_by_id('history', id):
        data = {"type":"connect", "condition":"closed"}

        if await manager.send_json(id, data):
            await manager.disconnect(id)
            response = data
        else:
            response = False
    else:
        response = False
    return {
        'request': f'{PREFIX}/websocket/connect?id={id}',
        'status': 'OK',
        'response': response
    }