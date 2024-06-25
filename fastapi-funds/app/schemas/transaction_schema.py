from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CreateTransactionDto(BaseModel):
    user_id: str = Field(..., description="User ID")
    fund_id: str = Field(..., description="Fund ID")
    type: str = Field(..., description="Transaction type (subscription or cancellation)")
    amount: float = Field(..., description="Transaction amount")

class TransactionInDB(BaseModel):
    id: str
    user_id: str
    fund_id: str
    type: str
    amount: float
    created_at: datetime
    end_date: Optional[datetime] = None