from uuid import uuid4
from fastapi import HTTPException, Depends
from app.models.subscription_model import Subscription
from app.schemas.subscription_schema import CreateSubscriptionDto, SubscriptionInDB
from app.schemas.transaction_schema import CreateTransactionDto
from app.core.config import settings
from app.core.dependencies import get_db
from app.services.funds_service import FundService
from app.services.transactions_service import TransactionService
from app.services.notifications_service import NotificationsService
from datetime import datetime

class SubscriptionService:
    TABLE_NAME = "Subscriptions"
    
    def __init__(self):
        self.initial_balance = settings.initial_balance or 500000

    @staticmethod
    async def create_subscription(subscription: CreateSubscriptionDto, db=Depends(get_db)) -> Subscription:
        fund = await FundService.get_fund(subscription.fund_id, db)
        if not fund:
            raise HTTPException(status_code=404, detail=f"El fondo con el id {subscription.fund_id} no se encontró")
        
        if subscription.amount < fund.minimum_amount:
            raise HTTPException(status_code=400, detail=f"Minimum amount for this fund is {fund.minimum_amount}")
        
        if subscription.amount > SubscriptionService().initial_balance:
            raise HTTPException(status_code=400, detail=f"Insufficient balance to subscribe to fund {fund.name}")
        
        subscription_id = str(uuid4())
        created_at = datetime.now()
        
        new_subscription = Subscription(
            id=subscription_id,
            user_id=subscription.user_id,
            fund_id=subscription.fund_id,
            amount=subscription.amount,
            status='active',
            created_at=created_at,
            notification_type=subscription.notification_type,
            notification_contact=subscription.notification_contact
        )
        
        item = {
            'id': {'S': new_subscription.id},
            'user_id': {'S': new_subscription.user_id},
            'fund_id': {'S': new_subscription.fund_id},
            'amount': {'N': str(new_subscription.amount)},
            'status': {'S': new_subscription.status},
            'created_at': {'S': new_subscription.created_at.isoformat()},
            'notification_type': {'S': new_subscription.notification_type},
            'notification_contact': {'S': new_subscription.notification_contact}
        }
        
        await db.put_item(
            TableName=SubscriptionService.TABLE_NAME,
            Item=item
        )
        
        SubscriptionService().initial_balance -= subscription.amount
        
        await TransactionService.create_transaction(CreateTransactionDto(
            user_id=new_subscription.user_id,
            fund_id=new_subscription.fund_id,
            type='subscription',
            amount=new_subscription.amount
        ), db)
        
        await NotificationsService.send_sms(
            f"+57{subscription.notification_contact}", 
            f"Te has suscrito al fondo {fund.name}"
        )
        
        return new_subscription

    @staticmethod
    async def cancel_subscription(subscription_id: str, db=Depends(get_db)) -> Subscription:
        subscription = await SubscriptionService.get_subscription_by_id(subscription_id, db)
        if not subscription:
            raise HTTPException(status_code=404, detail=f"Subscription with ID {subscription_id} not found")
        
        end_date = datetime.now()
        update_expression = "SET #status = :status, endDate = :endDate"
        expression_attribute_names = {"#status": "status"}
        expression_attribute_values = {
            ":status": {"S": "canceled"},
            ":endDate": {"S": end_date.isoformat()}
        }
        
        await db.update_item(
            TableName=SubscriptionService.TABLE_NAME,
            Key={'id': {'S': subscription_id}},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values
        )
        
        SubscriptionService().initial_balance += subscription.amount
        await TransactionService.create_transaction(CreateTransactionDto(
            user_id=subscription.user_id,
            fund_id=subscription.fund_id,
            type='cancellation',
            amount=subscription.amount
        ), db)
        
        subscription.status = 'canceled'
        subscription.end_date = end_date
        return subscription

    @staticmethod
    async def get_subscriptions_by_user(user_id: str, db=Depends(get_db)) -> list[Subscription]:
        response = await db.scan(
            TableName=SubscriptionService.TABLE_NAME,
            FilterExpression="user_id = :user_id",
            ExpressionAttributeValues={":user_id": {"S": user_id}}
        )
    
        subscriptions = []
        for item in response.get('Items', []):
            subscription_data = {
                'id': item['id']['S'],
                'user_id': item['user_id']['S'],
                'fund_id': item['fund_id']['S'],
                'amount': float(item['amount']['N']),
                'status': item['status']['S'],
                'created_at': datetime.fromisoformat(item['created_at']['S']),
                'notification_type': item['notification_type']['S'],
                'notification_contact': item['notification_contact']['S'],
            }
            if 'endDate' in item:
                subscription_data['end_date'] = datetime.fromisoformat(item['endDate']['S'])
            
            subscriptions.append(Subscription(**subscription_data))
        
        return subscriptions
    
    @staticmethod
    async def get_subscription_by_id(subscription_id: str, db=Depends(get_db)) -> Subscription:
        response = await db.get_item(
            TableName=SubscriptionService.TABLE_NAME,
            Key={'id': {'S': subscription_id}}
        )
        
        item = response.get('Item')
        if not item:
            return None
        
        subscription_data = {
            'id': item['id']['S'],
            'user_id': item['user_id']['S'],
            'fund_id': item['fund_id']['S'],
            'amount': float(item['amount']['N']),
            'status': item['status']['S'],
            'created_at': datetime.fromisoformat(item['created_at']['S']),
            'notification_type': item['notification_type']['S'],
            'notification_contact': item['notification_contact']['S'],
        }
        if 'endDate' in item:
            subscription_data['end_date'] = datetime.fromisoformat(item['endDate']['S'])
        
        return Subscription(**subscription_data)