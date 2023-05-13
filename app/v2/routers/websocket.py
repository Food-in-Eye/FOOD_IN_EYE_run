"""
websocket_router
"""

from fastapi import APIRouter
from core.common.mongo2 import MongodbController
from core.common.websocket import ConnectionManager

from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from typing import Optional

websocket_router = APIRouter(prefix="/websockets")

PREFIX = 'api/v2/websockets'
DB = MongodbController('FIE_DB')

@websocket_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}


html1 = """
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
            const wsUrl = 'ws://localhost:8000/api/v2/websockets/ws';
            let socket = null;

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;

                if (1) {
                    const wsId = username;
                    wsIdElem.textContent = wsId;
                    socket = new WebSocket(`${wsUrl}?s_id=${wsId}`);
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
html2 = """
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
            const wsUrl = 'ws://localhost:8000/api/v2/websockets/ws';
            let socket = null;

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;

                if (1) {
                    const wsId = username;
                    wsIdElem.textContent = wsId;
                    socket = new WebSocket(`${wsUrl}?h_id=${wsId}`);
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


websocket_manager = ConnectionManager()

@websocket_router.get("/web")
async def client_get():
    return HTMLResponse(html1)

@websocket_router.get("/app")
async def client_get():
    return HTMLResponse(html2)


@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, s_id:Optional[str] = None, h_id:Optional[str] = None): # token 이 추가되어야 함
    try:
        await websocket_manager.connect(websocket, s_id, h_id)

        while True:
            data = await websocket_manager.receive_client_json(websocket)
            await websocket_manager.handle_message(websocket, data)

    except WebSocketDisconnect as d:
        websocket_manager.check_connections(websocket)
        print(f'Websocket : {d}')




# # 어떤 오류를 세워야하는지 애매(http or websocket)
# @websocket_router.get("/websocket/connect")
# async def client_check_connect(id : str):
#     if DB.read_by_id('history', id):
#         data = {"type":"connect", "condition":"connected"}

#         if await websocket_manager.send_json(id, data):
#             response = data
#         else:
#             response = False
#     else:
#         response = False
#     return {
#         'request': f'{PREFIX}/websocket/connect?id={id}',
#         'status': 'OK',
#         'response': response
#     }

# @websocket_router.get("/websocket/close")
# async def client_check_connect(id : str):
#     if DB.read_by_id('history', id):
#         data = {"type":"connect", "condition":"closed"}

#         if await websocket_manager.send_json(id, data):
#             await websocket_manager.disconnect(id)
#             response = data
#         else:
#             response = False
#     else:
#         response = False
#     return {
#         'request': f'{PREFIX}/websocket/connect?id={id}',
#         'status': 'OK',
#         'response': response
#     }