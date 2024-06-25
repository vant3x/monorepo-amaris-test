from pydantic import BaseModel, Field

class SMSNotification(BaseModel):
    to: str = Field(..., min_length=10)  # Asumiendo un número de teléfono de al menos 10 dígitos
    message: str = Field(..., min_length=1)

class SMSResponse(BaseModel):
    success: bool
    message: str