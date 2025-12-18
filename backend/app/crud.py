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

def create_campaign_with_details(db: Session, campaign: schemas.CampaignCreate):
    # Create Campaign instance
    db_campaign = models.Campaign(
        name=campaign.name,
        tipo_campania=campaign.tipo_campania,
        fecha_inicio=campaign.fecha_inicio,
        fecha_fin=campaign.fecha_fin,
        universo_zona_metro=campaign.universo_zona_metro,
        impactos_personas=campaign.impactos_personas,
        impactos_vehiculos=campaign.impactos_vehiculos,
        frecuencia_calculada=campaign.frecuencia_calculada,
        frecuencia_promedio=campaign.frecuencia_promedio,
        alcance=campaign.alcance,
        nse_ab=campaign.nse_ab,
        nse_c=campaign.nse_c,
        nse_cmas=campaign.nse_cmas,
        nse_d=campaign.nse_d,
        nse_dmas=campaign.nse_dmas,
        nse_e=campaign.nse_e,
        edad_0a14=campaign.edad_0a14,
        edad_15a19=campaign.edad_15a19,
        edad_20a24=campaign.edad_20a24,
        edad_25a34=campaign.edad_25a34,
        edad_35a44=campaign.edad_35a44,
        edad_45a64=campaign.edad_45a64,
        edad_65mas=campaign.edad_65mas,
        hombres=campaign.hombres,
        mujeres=campaign.mujeres
    )
    db.add(db_campaign)
    db.flush() # Flush to check for potential errors on campaign creation first

    # Create Sites
    for site in campaign.sites:
        db_site = models.CampaignSite(
            **site.model_dump(),
            campaign_name=campaign.name
        )
        db.add(db_site)

    # Create Periods
    for period in campaign.periods:
        db_period = models.CampaignPeriod(
            **period.model_dump(),
            campaign_name=campaign.name
        )
        db.add(db_period)

    db.commit()
    db.refresh(db_campaign)
    return db_campaign
