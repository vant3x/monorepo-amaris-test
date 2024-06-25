from fastapi import APIRouter, HTTPException
from app.schemas.notifications_schema import SMSNotification, SMSResponse
from app.services.notifications_service import NotificationsService

router = APIRouter()

@router.post("/sms", response_model=SMSResponse)
async def send_sms(notification: SMSNotification):
    try:
        await NotificationsService.send_sms(notification.to, notification.message)
        return SMSResponse(success=True, message="SMS sent successfully")
    except HTTPException as e:
        raise e