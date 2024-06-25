from fastapi import Depends
from app.db.dynamodb import get_dynamodb_client

async def get_db():
    async for client in get_dynamodb_client():
        yield client