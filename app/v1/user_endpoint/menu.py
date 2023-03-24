"""
user_menu
:Android APP에서 메뉴 정보를 불러오기
"""

from fastapi import APIRouter
from core.models.store import MenuModel
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
menu_router = APIRouter(prefix="/menus")