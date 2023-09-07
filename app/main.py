from fastapi import FastAPI
from v2.api import v2_router

app = FastAPI()

app.include_router(v2_router)

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from core.statistics.run import CallAnalysis


scheduler = BackgroundScheduler()
scheduler.add_job(CallAnalysis.daily_summary, 'cron', hour=0, minute=0)  # 매일 자정에 실행
scheduler.start()


@app.get("/")
async def hello():
    return {"message": "Hello World"}