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
    frecuencia_catorcenal: float
    frecuencia_mensual: float
    impactos_catorcenal: int
    impactos_mensuales: int
    alcance_mensual: float

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
    pageSize: int