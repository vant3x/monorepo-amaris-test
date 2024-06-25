from fastapi import APIRouter, Depends, HTTPException
from app.schemas.funds_schema import FundCreate, FundInDB
from app.services.funds_service import FundService
from app.core.dependencies import get_db

router = APIRouter()

@router.post("/", response_model=FundInDB)
async def create_fund(fund: FundCreate, db=Depends(get_db)):
    return await FundService.create_fund(fund, db)

@router.get("/{fund_id}", response_model=FundInDB)
async def get_fund(fund_id: str, db=Depends(get_db)):
    try:
        return await FundService.get_fund(fund_id, db)
    except HTTPException as e:
        raise e

@router.get("/", response_model=list[FundInDB])
async def get_all_funds(db=Depends(get_db)):
    return await FundService.get_all_funds(db)