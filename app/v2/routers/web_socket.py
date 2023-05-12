"""
web_socket_router
"""

from fastapi import APIRouter
from core.common.mongo2 import MongodbController
from .src.util import Util

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import json

from .app_socket import manager as app_websocket

web_socket_router = APIRouter(prefix="/web_socket")

PREFIX = 'api/v2/web_socket'
DB = MongodbController('FIE_DB')

@web_socket_router.get("/hello")
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
            const wsUrl = 'ws://localhost:8000/api/v2/web_socket/ws';
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

    async def connect(self, s_id : str, websocket: WebSocket):

        client = websocketClient()
        if await client.connect(websocket):
            connection = {"websocket": client, "s_id": s_id}
            self.active_connections.append(connection)
        self.printList()
    
    async def get_client(self, s_id : str):
        for connect in self.active_connections:
            if connect['s_id'] == s_id:
                return connect['websocket']
        return None
    
    async def send_json(self, s_id : str, data : json):
        client = await self.get_client(s_id)
        
        if client:
            await client.send_json(data)
            print(f"# Send To ({s_id}) : {data}")
            return True

    async def receive_json(self, s_id : str):
        client = await self.get_client(s_id)

        if client:
            data = await client.receive_json()
            print(f'# Receive From ({s_id}) : {data}')
            return data

    async def handle_message(self, s_id : str, data : json): # 특수 문자열 체크, 이외의 문자열은 그대로 출력
        data = json.loads(data)

        if data['type'] == 'update':
            order_state = await app_websocket.send_update(data['o_id'])
            await self.send_json(s_id, order_state)
        elif data['type'] == 'connect':
            if data['condition'] == "close":
                data['condition'] = 'closed'
                await self.send_json(s_id, data)
                await self.disconnect(s_id)
                raise WebSocketDisconnect(f'The client({s_id}) requested to terminate the connection.')
            elif data['condition'] == "connect": # 연결 확인 -> 정해진 문자열 입력 시 정해진 문자열 출력
                data['condition'] = 'connected'
                await self.send_json(s_id, data)
            else:
                await self.send_json(s_id, data)

    async def disconnect(self, s_id : str):
        client = await self.get_client(s_id)

        if client:
            if await client.disconnect():
                for i, conn in enumerate(self.active_connections):
                    if conn['s_id'] == s_id:
                        del self.active_connections[i]
                        break
    
    def printList(self):
        for i in range(0, len(self.active_connections)):
            print(f"Web Connection : {i}, {self.active_connections[i]}")


    # app에게 update 전송하기
    async def send_update(self, s_id : str):
        client = await app_websocket.get_client(s_id)

        if client:
            data = await client.receive_json()
            print(f'# Receive From ({s_id}) : {data}')
            return data


    # async def send_update(self, u_ids : list[str]):
    #     for u_id in u_ids:    
    #         client = await self.get_client(u_id)
    #         print(user_id)
    #         if client:
    #             print(client)
    #             await client.send_json({'client' : user_id, 'msg' : data})
    #             print(f"# Send To ({user_id}) : {data}")


    # 테스트 중 -> client 에서 보내면 server 는 응답
    # async def send_heartbeat(self, websocket : WebSocket):
    #     while websocket.client_state == WebSocketState.CONNECTED:
    #         await asyncio.sleep(30)
    #         try:
    #             await websocket.send_json({'type': 'heartbeat'})
    #         except WebSocketDisconnect:
    #             break


manager = ConnectionManager()

@web_socket_router.get("/")
async def client_get():
    return HTMLResponse(html)

# client가 사용할지 의문이라서 우선 주석 처리
# @web_socket_router.get("/websocket/list")
# async def get():
#     manager.printList()
#     print(manager.active_connections)
#     return f'hi {manager.active_connections}'

# websocket을 연견할 때 서버가 id, token이 일치하는지 확인하는 코드
# async def check_token(id : str, token : str):
#     user = DB.read_by_id('user', id)

#     if str(user['token']) == token:
#         return user['_id']
#     else :
#         return False

@web_socket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, id : str): # token 이 추가되어야 함
    try:
        await manager.connect(id, websocket)
        
        while True:
            data = await manager.receive_json(id) # websocket 형식 정하고 json으로 바꿀 것 json_str = json.dumps(data)
            await manager.handle_message(id, data)

    except WebSocketDisconnect as d:
        print(f'Websocket : {d}')

        # await manager.disconnect(id)
        # manager.printList()
        # await del_token(id)



# import random

# def generate_token():
#     return random.randint(10000, 99999)

@web_socket_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

# @web_socket_router.get("/login")
# async def client_check_login(id : str): # 로그인으로 확장
#     try:
#         Util.check_id(id)

#         user = DB.read_by_id('user', id)

#         if user:
#             token = generate_token()
#             del user['_id'] # 삭제 하지 않는 경우 오류 발생 _id는 수정 불가
#             user['token'] = token
#             DB.update_by_id('user', id, user)

#             response = token
        
#     except Exception as e:
#         print('ERROR', e)
#         return {
#             'request': f'{PREFIX}/login?id={id}',
#             'status': 'ERROR',
#             'message': f'ERROR {e}'
#         }
    
#     return {
#         'request': f'{PREFIX}/login?id={id}',
#         'status': 'OK',
#         'response': response
#     }

# # check_token랑 코드 일치한데 애매함
# @web_socket_router.get("/token")
# async def client_check_token(id : str, token : str):
#     try:
#         user = DB.read_by_id('user', id)

#         if str(user['token']) == token:
#             response =  user['_id']

#     except Exception as e:
#         print('ERROR', e)
#         return {
#             'request': f'{PREFIX}/token?id={id}?token={token}',
#             'status': 'ERROR',
#             'message': f'ERROR {e}'
#         }
    
#     return {
#         'request': f'{PREFIX}/token?id={id}?token={token}',
#         'status': 'OK',
#         'response': response
#     }

# token 삭제 -> http 뺄지 말지 고민
# @web_socket_router.get("/logout")
# async def del_token(id : str): # 토큰 삭제
#     try:
#         user = DB.read_by_id('user', id)

#         if user:
#             del user['_id']
#             user['token'] = ''
#             DB.update_by_id('user', id, user)

#     except Exception as e:
#         print('ERROR', e)
#         return {
#             'request': f'{PREFIX}/logout?id={id}',
#             'status': 'ERROR',
#             'message': f'ERROR {e}'
#         }
    
#     return {
#         'request': f'{PREFIX}/logout?id={id}',
#         'status': 'OK',
#     }

# client가 websocket이 연결되었는지 websocket으로 확인 받을 코드
# 어떤 오류를 세워야하는지 애매(http or websocket)
@web_socket_router.get("/websocket/connect")
async def client_check_connect(id : str):
    if DB.read_by_id('store', id):
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

@web_socket_router.get("/websocket/close")
async def client_check_connect(id : str):
    if DB.read_by_id('store', id):
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

@web_socket_router.get("/websocket/update")
async def client_send_to_app(o_id : str):
    try:
        Util.check_id(o_id)

        response = await app_websocket.send_update(o_id)
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/websocket/update?o_id={o_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/websocket/update?o_id={o_id}',
        'status': 'OK',
        'response': response
    }
