from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Transaction(BaseModel):
    id: str
    user_id: str
    fund_id: str
    type: str
    amount: float
    created_at: datetime
    end_date: Optional[datetime] = None