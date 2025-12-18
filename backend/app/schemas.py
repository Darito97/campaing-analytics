from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Optional

class CampaignPeriodBase(BaseModel):
    period: str
    impactos_periodo_personas: int
    impactos_periodo_vehiculos: int

class CampaignPeriod(CampaignPeriodBase):
    id: int
    campaign_name: str

    model_config = ConfigDict(from_attributes=True)

class CampaignSiteBase(BaseModel):
    codigo_del_sitio: str
    tipo_de_mueble: str
    tipo_de_anuncio: str
    estado: str
    municipio: str
    zm: str
    frecuencia_catorcenal: Optional[float] = None
    frecuencia_mensual: Optional[float] = None
    impactos_catorcenal: Optional[int] = None
    impactos_mensuales: Optional[int] = None
    alcance_mensual: Optional[float] = None

class CampaignSite(CampaignSiteBase):
    id: int
    campaign_name: str

    model_config = ConfigDict(from_attributes=True)

class CampaignBase(BaseModel):
    name: str
    tipo_campania: str
    fecha_inicio: date
    fecha_fin: date
    universo_zona_metro: Optional[int] = None
    impactos_personas: Optional[int] = None
    impactos_vehiculos: Optional[int] = None
    frecuencia_calculada: Optional[float] = None
    frecuencia_promedio: Optional[float] = None
    alcance: Optional[int] = None
    nse_ab: Optional[float] = None
    nse_c: Optional[float] = None
    nse_cmas: Optional[float] = None
    nse_d: Optional[float] = None
    nse_dmas: Optional[float] = None
    nse_e: Optional[float] = None
    edad_0a14: Optional[float] = None
    edad_15a19: Optional[float] = None
    edad_20a24: Optional[float] = None
    edad_25a34: Optional[float] = None
    edad_35a44: Optional[float] = None
    edad_45a64: Optional[float] = None
    edad_65mas: Optional[float] = None
    hombres: Optional[float] = None
    mujeres: Optional[float] = None

class CampaignSiteCreate(CampaignSiteBase):
    pass

class CampaignPeriodCreate(CampaignPeriodBase):
    pass

class CampaignCreate(CampaignBase):
    sites: List[CampaignSiteCreate] = []
    periods: List[CampaignPeriodCreate] = []

class Campaign(CampaignBase):
    model_config = ConfigDict(from_attributes=True)

class CampaignDetail(Campaign):
    periods: List[CampaignPeriod]
    sites: List[CampaignSite]

    model_config = ConfigDict(from_attributes=True)

class CampaignPagination(BaseModel):
    data: List[Campaign]
    total: int
    page: int
    page: int
    pageSize: int

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None