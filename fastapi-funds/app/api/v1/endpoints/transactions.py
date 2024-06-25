from fastapi import APIRouter, Depends
from app.schemas.transaction_schema import CreateTransactionDto, TransactionInDB
from app.services.transactions_service import TransactionService
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/", response_model=TransactionInDB)
async def create_transaction(transaction: CreateTransactionDto, db=Depends(get_db)):
    return await TransactionService.create_transaction(transaction, db)

@router.get("/user/{user_id}", response_model=list[TransactionInDB])
async def get_transactions_by_user(user_id: str, db=Depends(get_db)):
    return await TransactionService.get_transactions_by_user(user_id, db)