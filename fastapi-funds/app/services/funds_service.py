from uuid import uuid4
from fastapi import HTTPException, Depends
from app.models.funds_model import Fund
from app.schemas.funds_schema import FundCreate, FundInDB
from app.core.config import settings
from app.core.dependencies import get_db

class FundService:
    TABLE_NAME = settings.dynamodb_table_name

    @staticmethod
    async def create_fund(fund: FundCreate, db=Depends(get_db)) -> Fund:
        fund_id = str(uuid4())
        item = {
            'id': {'S': fund_id},
            'name': {'S': fund.name},
            'minimumAmount': {'N': str(fund.minimum_amount)},
            'category': {'S': fund.category}
        }
        
        await db.put_item(
            TableName=FundService.TABLE_NAME,
            Item=item
        )
        
        return Fund(id=fund_id, **fund.dict())

    @staticmethod
    async def get_fund(fund_id: str, db=Depends(get_db)) -> Fund:
        response = await db.get_item(
            TableName=FundService.TABLE_NAME,
            Key={'id': {'S': fund_id}}
        )
        
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail=f"El fondo con el ID {fund_id} no se encontró")
        
        item = response['Item']
        return Fund(
            id=item['id']['S'],
            name=item['name']['S'],
            minimum_amount=float(item['minimumAmount']['N']),
            category=item['category']['S']
        )

    @staticmethod
    async def get_all_funds(db=Depends(get_db)) -> list[Fund]:
        response = await db.scan(
            TableName=FundService.TABLE_NAME
        )
        
        funds = []
        for item in response.get('Items', []):
            funds.append(Fund(
                id=item['id']['S'],
                name=item['name']['S'],
                minimum_amount=float(item['minimumAmount']['N']),
                category=item['category']['S']
            ))
        
        return funds