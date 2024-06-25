from uuid import uuid4
from fastapi import HTTPException, Depends
from app.models.subscription_model import Subscription
from app.schemas.subscription_schema import CreateSubscriptionDto, SubscriptionInDB
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
            raise HTTPException(status_code=404, detail=f"Fund with ID {subscription.fund_id} not found")
        
        if subscription.amount < fund.minimum_amount:
            raise HTTPException(status_code=400, detail=f"Minimum amount for this fund is {fund.minimum_amount}")
        
        if subscription.amount > SubscriptionService().initial_balance:
            raise HTTPException(status_code=400, detail=f"Insufficient balance to subscribe to fund {fund.name}")
        
        subscription_id = str(uuid4())
        created_at = datetime.now()
        item = {
            'id': {'S': subscription_id},
            'user_id': {'S': subscription.user_id},
            'fund_id': {'S': subscription.fund_id},
            'amount': {'N': str(subscription.amount)},
            'status': {'S': 'active'},
            'created_at': {'S': created_at.isoformat()},
            'notification_type': {'S': subscription.notification_type},
            'notification_contact': {'S': subscription.notification_contact}
        }
        
        await db.put_item(
            TableName=SubscriptionService.TABLE_NAME,
            Item=item
        )
        
        SubscriptionService().initial_balance -= subscription.amount
        
        await TransactionService.create_transaction({
            'user_id': subscription.user_id,
            'fund_id': subscription.fund_id,
            'type': 'subscription',
            'amount': subscription.amount
        }, db)
        
        await NotificationsService.send_sms(
            f"+57{subscription.notification_contact}", 
            f"You have just subscribed to {fund.name}"
        )
        
        return Subscription(**item)

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
        await TransactionService.create_transaction({
            'user_id': subscription.user_id,
            'fund_id': subscription.fund_id,
            'type': 'cancellation',
            'amount': subscription.amount,
            'end_date': end_date
        }, db)
        
        subscription.status = 'canceled'
        subscription.end_date = end_date
        return subscription

    @staticmethod
    async def get_subscriptions_by_user(user_id: str, db=Depends(get_db)) -> list[Subscription]:
        response = await db.scan(
            TableName=SubscriptionService.TABLE_NAME,
            FilterExpression="userId = :userId",
            ExpressionAttributeValues={":userId": {"S": user_id}}
        )
    
        subscriptions = []
        for item in response.get('Items', []):
            subscription_data = {
                'id': item['id']['S'],
                'user_id': item['userId']['S'],
                'fund_id': item['fundId']['S'],
                'amount': float(item['amount']['N']),
                'status': item['status']['S'],
                'created_at': datetime.fromisoformat(item['createdAt']['S']),
                'notification_type': item['notification_type']['S'],
                'notification_contact': item['notification_contact']['S'],
            }
            if 'endDate' in item:
                subscription_data['end_date'] = datetime.fromisoformat(item['endDate']['S'])
            
            subscriptions.append(Subscription(**subscription_data))
        
        return subscriptions