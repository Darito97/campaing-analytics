from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from . import schemas, crud, auth, dependencies

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Welcome to Campaign Analytics API"}

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(dependencies.get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/campaigns", response_model=schemas.CampaignPagination)
def read_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tipo_campania: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(dependencies.get_db)
):
    """
    Get all campaigns with pagination and optional filtering by campaign type.
    """
    campaigns, total = crud.get_campaigns(db, skip=skip, limit=limit, tipo_campania=tipo_campania, start_date=start_date, end_date=end_date)
    return {
        "data": campaigns,
        "total": total,
        "page": skip // limit,
        "pageSize": limit
    }

@router.post("/campaigns", response_model=schemas.Campaign)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(dependencies.get_db), current_user: schemas.User = Depends(dependencies.get_current_user)):
    """
    Create a new campaign with all its details (sites, periods, demographics).
    """
    existing_campaign = crud.get_campaign(db, campaign_id=campaign.name)
    if existing_campaign:
        raise HTTPException(status_code=400, detail="Campaign with this name already exists")
    
    return crud.create_campaign_with_details(db=db, campaign=campaign)

@router.get("/campaigns/{campaign_id}", response_model=schemas.CampaignDetail)
def read_campaign(campaign_id: str, db: Session = Depends(dependencies.get_db)):
    """
    Get detailed information for a specific campaign.
    """
    campaign = crud.get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.get("/campaigns/search-by-date", response_model=List[schemas.Campaign])
def search_campaigns_by_date(
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(dependencies.get_db)
):
    """
    Search campaigns by date range.
    """
    if start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date must be before end date"
        )
    
    campaigns = crud.search_campaigns_by_date(
        db,
        start_date=start_date,
        end_date=end_date
    )
    return campaigns
