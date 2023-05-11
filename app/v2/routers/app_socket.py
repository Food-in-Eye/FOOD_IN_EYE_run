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
        self.websocket : WebSocket
        self.history : dict
        self.order = []
    
    async def connect(self, websocket : WebSocket, history : dict, order : list):
        self.websocket = websocket
        self.history = history
        self.order = order
        print(self.order)

        await self.websocket.accept()
        return True
    
    async def send_json(self, data : json):
        await self.websocket.send_json({'data' : data}) # data : 'user_id' , 'message'
        return data

    async def receive_json(self):
        data = await self.websocket.receive_text()
        if json.dumps(data):
            return data
        self.send_json({'state' : 'error', 'event' : 'send data tpye is not json'})  # 혹시라도 json.dumps() 불가 시 에러(연결 종료)를 방지하기 위한 에러 메시지

    async def disconnect(self):
        if await self.websocket.close() == None:
            return True
        return False


    
class ConnectionManager:

    def __init__(self):
        self.active_connections: list[dict[str, any]] = []

    async def connect(self, h_id : str, websocket: WebSocket, history : dict, order : list):
        client = websocketClient()
        if await client.connect(websocket, history, order):
            connection = {"h_id": h_id, "websocket": client}
            self.active_connections.append(connection)
        self.printList()
    
    async def get_client(self, user_id : str):
        for connect in self.active_connections:
            if connect['h_id'] == user_id:
                return connect['websocket']
        return None
    
    async def send_json(self, user_id : str, data : json):
        client = await self.get_client(user_id)

        if client:
            await client.send_json({'client' : user_id, 'msg' : data})
            print(f"# Send To ({user_id}) : {data}")

    async def send_json_to_users(self, user_ids : list[str], data : json):
        for user_id in user_ids:
            client = await self.get_client(user_id)
            print(user_id)
            if client:
                print(client)
                await client.send_json({'client' : user_id, 'msg' : data})
                print(f"# Send To ({user_id}) : {data}")

    async def receive_json(self, user_id : str):
        client = await self.get_client(user_id)

        if client:
            data = await client.receive_json()
            print(f'# Receive From ({user_id}) : {data}')
            return data

    async def handle_message(self, user_id : str, data : json): # 특수 문자열 체크, 이외의 문자열은 그대로 출력

        if data == "close":
            data = 'closed'
            await self.send_json(user_id, data)
            raise WebSocketDisconnect(f'The client({user_id}) requested to terminate the connection.')
        else:
            if data == "connect": # 연결 확인 -> 정해진 문자열 입력 시 정해진 문자열 출력
                data = 'connected'

            await self.send_json(user_id, data)

    async def disconnect(self, user_id : str):
        client = await self.get_client(user_id)

        if client:
            if await client.disconnect():
                for i, conn in enumerate(self.active_connections):
                    if conn['user_id'] == user_id:
                        del self.active_connections[i]
                        break
    
    def printList(self):
        for i in range(0, len(self.active_connections)):
            print(f"Connection : {i}, {self.active_connections[i]}")


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
async def check_history(id : str):
    history = DB.read_by_id('history', id)
    if history:
        del history['date']
        del history['total_price']
        del history['gaze_path']
        return history
    return False

async def init_order(history : dict):
    count = []
    for i in range(len(history['orders'])):
        count.append(False)
    return count

@app_socket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, id : str): # token 이 추가되어야 함
    try:
        history = await check_history(id)
        order = await init_order(history)
        await manager.connect(id, websocket, history, order)
        

        if history:

            while True:
                data = await manager.receive_json(id) # websocket 형식 정하고 json으로 바꿀 것 json_str = json.dumps(data)
                await manager.handle_message(id, data)
        else:
            raise WebSocketDisconnect(f'The client({websocket.client})\'s h_id is not match.')

    except WebSocketDisconnect as d:
        print(f'Websocket ERROR : {d}')

        await manager.disconnect(id)
        manager.printList()
