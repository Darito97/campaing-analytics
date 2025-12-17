from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from typing import Optional
from . import models, schemas

def get_campaigns(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    tipo_campania: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    query = db.query(models.Campaign)

    if tipo_campania:
        query = query.filter(models.Campaign.tipo_campania == tipo_campania)
    
    if start_date and end_date:
        query = query.filter(
            and_(
                models.Campaign.fecha_inicio >= start_date,
                models.Campaign.fecha_fin <= end_date
            )
        )
    
    total = query.count()
    campaings = query.offset(skip).limit(limit).all()
    
    return campaings, total

def get_campaign(db: Session, campaign_id: str):
    return db.query(models.Campaign).filter(models.Campaign.name == campaign_id).first()

def search_campaigns_by_date(
    db: Session,
    start_date: datetime,
    end_date: datetime
):
    return db.query(models.Campaign).filter(
        and_(
            models.Campaign.fecha_inicio <= end_date,
            models.Campaign.fecha_fin >= start_date
        )
    ).all()
