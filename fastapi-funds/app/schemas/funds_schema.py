from pydantic import BaseModel, Field
from uuid import UUID

class FundCreate(BaseModel):
    name: str = Field(..., min_length=1)
    minimum_amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)

class FundInDB(FundCreate):
    id: UUID