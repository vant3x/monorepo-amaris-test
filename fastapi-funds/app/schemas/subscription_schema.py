from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CreateSubscriptionDto(BaseModel):
    user_id: str = Field(..., description="User ID")
    fund_id: str = Field(..., description="Fund ID")
    amount: float = Field(..., description="Subscription amount")
    notification_type: str = Field(..., description="Notification type (sms or email)")
    notification_contact: str = Field(..., description="Contact for notifications")

class SubscriptionInDB(BaseModel):
    id: str
    user_id: str
    fund_id: str
    amount: float
    status: str
    created_at: datetime
    notification_type: str
    notification_contact: str
    end_date: Optional[datetime] = None