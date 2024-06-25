from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Subscription(BaseModel):
    id: str
    user_id: str
    fund_id: str
    amount: float
    status: str
    created_at: datetime
    notification_type: str
    notification_contact: str
    end_date: Optional[datetime] = None