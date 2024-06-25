import aioboto3
from app.core.config import settings

async def get_dynamodb_client():
    session = aioboto3.Session()
    async with session.client(
        'dynamodb',
        region_name=settings.aws_region,
        aws_access_key_id=settings.aws_access_key_id,
        aws_secret_access_key=settings.aws_secret_access_key
    ) as client:
        yield client