"""
websocket_router
"""

from fastapi import APIRouter
from core.common.mongo import MongodbController
from core.common.websocket import ConnectionManager

from fastapi import WebSocket, WebSocketDisconnect

websocket_router = APIRouter(prefix="/websockets")

PREFIX = 'api/v2/websockets'
DB = MongodbController('FIE_DB2')

@websocket_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}


websocket_manager = ConnectionManager()

@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, s_id = None, h_id = None): 
    try:
        await websocket_manager.connect(websocket, s_id, h_id)

        while True:
            data = await websocket_manager.receive_client_data(websocket)
            await websocket_manager.handle_message(websocket, s_id, h_id, data)

    except WebSocketDisconnect as d:
        await websocket_manager.delete_connections(websocket, s_id, h_id)
        print(f'Websocket : {d}')
