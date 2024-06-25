from pydantic import BaseModel, Field
from uuid import UUID

class Fund(BaseModel):
    id: UUID
    name: str
    minimum_amount: float
    category: str

    class Config:
        from_attributes = True