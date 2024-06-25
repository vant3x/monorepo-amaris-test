from uuid import uuid4
from fastapi import Depends
from app.models.transaction_model import Transaction
from app.schemas.transaction_schema import CreateTransactionDto, TransactionInDB
from app.core.config import settings
from app.core.dependencies import get_db
from datetime import datetime

class TransactionService:
    TABLE_NAME = "Transactions"

    @staticmethod
    async def create_transaction(transaction: CreateTransactionDto, db=Depends(get_db)) -> Transaction:
        transaction_id = f"TRA-{str(uuid4())}"
        created_at = datetime.now()
        
        item = {
            'id': {'S': transaction_id},
            'user_id': {'S': transaction.user_id},
            'fund_id': {'S': transaction.fund_id},
            'type': {'S': transaction.type},
            'amount': {'N': str(transaction.amount)},
            'created_at': {'S': created_at.isoformat()}
        }

        await db.put_item(
            TableName=TransactionService.TABLE_NAME,
            Item=item
        )

        return Transaction(
            id=transaction_id,
            user_id=transaction.user_id,
            fund_id=transaction.fund_id,
            type=transaction.type,
            amount=transaction.amount,
            created_at=created_at
        )

    @staticmethod
    async def get_transactions_by_user(user_id: str, db=Depends(get_db)) -> list[Transaction]:
        response = await db.scan(
            TableName=TransactionService.TABLE_NAME,
            FilterExpression="userId = :userId",
            ExpressionAttributeValues={":userId": {"S": user_id}}
        )

        transactions = []
        for item in response.get('Items', []):
            transaction_data = {
                'id': item['id']['S'],
                'user_id': item['user_id']['S'],
                'fund_id': item['fund_i d']['S'],
                'type': item['type']['S'],
                'amount': float(item['amount']['N']),
                'created_at': datetime.fromisoformat(item['created_at']['S']),
            }
            if 'endDate' in item:
                transaction_data['end_date'] = datetime.fromisoformat(item['endDate']['S'])
            
            transactions.append(Transaction(**transaction_data))

        return transactions