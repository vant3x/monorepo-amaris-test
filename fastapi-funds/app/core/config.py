from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    aws_region: str
    aws_access_key_id: str
    aws_secret_access_key: str
    dynamodb_table_name: str = "Funds"
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone_number: str

    class Config:
        env_file = ".env"

settings = Settings()