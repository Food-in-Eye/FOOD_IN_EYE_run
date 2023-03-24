"""
admin_menu
React에서 메뉴를 설정할 수 있도록 제공
"""

from fastapi import APIRouter
from core.models.store import MenuModel
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
menu_router = APIRouter(prefix="/menus")