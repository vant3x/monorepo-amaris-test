from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    aws_region: str
    initial_balance: float = 500000 
    aws_access_key_id: str
    aws_secret_access_key: str
    dynamodb_table_name: str = "Funds"
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone_number: str
    frontend_url: str = "http://localhost:4200"
    class Config:
        env_file = ".env"

settings = Settings()