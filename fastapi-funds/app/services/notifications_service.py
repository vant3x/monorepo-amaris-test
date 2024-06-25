from fastapi import HTTPException
from twilio.rest import Client
from app.core.config import settings

class NotificationsService:
    @staticmethod
    async def send_sms(to: str, body: str) -> None:
        try:
            client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
            message = client.messages.create(
                body=body,
                from_=settings.twilio_phone_number,
                to=to
            )
        except Exception as error:
            print(f'Error sending SMS: {error}')
            raise HTTPException(status_code=500, detail="Failed to send SMS")