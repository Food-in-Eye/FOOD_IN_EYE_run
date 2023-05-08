"""
user_router
"""

from fastapi import APIRouter
from core.common.mongo2 import MongodbController
from .src.util import Util

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import json


user_router = APIRouter(prefix="/users")

PREFIX = 'api/v2/users'
DB = MongodbController('FIE_DB')

@user_router.get("/hello")
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
            <label for="token">토큰:</label>
            <input type="text" id="token" name="token">
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
            const wsUrl = 'ws://localhost:8000/api/v2/users/ws';
            let socket = null;

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const response = await fetch(`http://127.0.0.1:8000/api/v2/users/login?user_id=${username}`);
                const token = document.getElementById('token').value;
                if (token) {
                    const wsId = username;
                    wsIdElem.textContent = wsId;
                    socket = new WebSocket(`${wsUrl}/${wsId}?token=${token}`);
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

    async def connect(self, websocket : WebSocket):
        self.websocket = websocket
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

    async def connect(self, user_id : str, websocket: WebSocket):
        client = websocketClient()
        if await client.connect(websocket):
            connection = {"user_id": user_id, "websocket": client}
            self.active_connections.append(connection)
        self.printList()

    async def get_client(self, user_id : str):
        for connect in self.active_connections:
            if connect['user_id'] == user_id:
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
            # await self.disconnect(user_id)
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

@user_router.get("/")
async def get():
    return HTMLResponse(html)

@user_router.get("/websocket/list")
async def get():
    manager.printList()
    print(manager.active_connections)
    return f'hi {manager.active_connections}'

@user_router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id : str, token : str): # token 이 추가되어야 함
    try:
        await manager.connect(user_id, websocket)
        if await check_token(user_id, token):
            # asyncio.ensure_future(manager.send_heartbeat(websocket))

            while True:
                data = await manager.receive_json(user_id) # websocket 형식 정하고 json으로 바꿀 것 json_str = json.dumps(data)
                await manager.handle_message(user_id, data)
        else:
            raise WebSocketDisconnect(f'The client({websocket.client})\'s token does not match.')

    except WebSocketDisconnect as d:
        print(f'Websocket ERROR : {d}')

        await manager.disconnect(user_id)
        manager.printList()
        #await del_token(user_id) # 이 코드 없으면 접속하기 너무 힘듦 왜냐 html을 내가 못해서


from core.common.mongo2 import MongodbController
import random

def generate_token():
    return random.randint(10000, 99999)

# DB에 존재하는 id 입력시 랜덤값(token) return
@user_router.get("/login")
async def user_check(id : str): # 로그인으로 확장
    try:
        Util.check_id(id)

        user = DB.read_by_id('user', id)

        if user:
            token = generate_token()
            del user['_id'] # 삭제 하지 않는 경우 오류 발생 _id는 수정 불가
            user['token'] = token
            DB.update_by_id('user', id, user)

            response = token
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/login',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/login',
        'status': 'OK',
        'response': response
    }

# token 확인 -> true or false
@user_router.get("/token")
async def check_token(id : str, token : str):
    try:
        user = DB.read_by_id('user', id)

        if str(user['token']) == token:
            return user['_id']
        else :
             return False

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/token',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/token',
        'status': 'OK',
    }

# token 삭제
@user_router.get("/logout")
async def del_token(id : str): # 토큰 삭제
    try:
        user = DB.read_by_id('user', id)

        if user:
            del user['_id']
            user['token'] = ''
            DB.update_by_id('user', id, user)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/logout',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/logout',
        'status': 'OK',
    }