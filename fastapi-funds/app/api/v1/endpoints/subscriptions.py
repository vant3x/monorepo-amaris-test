from fastapi import APIRouter, Depends, HTTPException
from app.schemas.subscription_schema import CreateSubscriptionDto, SubscriptionInDB
from app.services.subscriptions_service import SubscriptionService
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/", response_model=SubscriptionInDB)
async def create_subscription(subscription: CreateSubscriptionDto, db=Depends(get_db)):
    return await SubscriptionService.create_subscription(subscription, db)

@router.put("/{subscription_id}/cancel", response_model=SubscriptionInDB)
async def cancel_subscription(subscription_id: str, db=Depends(get_db)):
    return await SubscriptionService.cancel_subscription(subscription_id, db)

@router.get("/user/{user_id}", response_model=list[SubscriptionInDB])
async def get_subscriptions_by_user(user_id: str, db=Depends(get_db)):
    return await SubscriptionService.get_subscriptions_by_user(user_id, db)

@router.get("/{subscription_id}", response_model=SubscriptionInDB)
async def get_subscription_by_id(subscription_id: str, db=Depends(get_db)):
    subscription = await SubscriptionService.get_subscription_by_id(subscription_id, db)
    if not subscription:
        raise HTTPException(status_code=404, detail=f"La Subscripción con el ID {subscription_id} no se encontró")
    return subscription