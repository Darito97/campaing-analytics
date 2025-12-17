import pytest
from datetime import date, datetime
from app.models import Campaign

def create_sample_campaign(session):
    campaign = Campaign(
        name="test_campaign",
        tipo_campania="mensual",
        fecha_inicio=date(2025, 1, 1),
        fecha_fin=date(2025, 1, 31),
        universo_zona_metro=1000,
        impactos_personas=500,
        impactos_vehiculos=200,
        frecuencia_calculada=1.5,
        frecuencia_promedio=1.2,
        alcance=300,
        nse_ab=0.1, nse_c=0.2, nse_cmas=0.1, nse_d=0.3, nse_dmas=0.1, nse_e=0.2,
        edad_0a14=0.1, edad_15a19=0.1, edad_20a24=0.1, edad_25a34=0.2,
        edad_35a44=0.2, edad_45a64=0.2, edad_65mas=0.1,
        hombres=0.5, mujeres=0.5
    )
    session.add(campaign)
    session.commit()
    return campaign

def test_read_campaigns_empty(client):
    response = client.get("/campaigns/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["data"] == []

def test_read_campaigns_with_data(client, session):
    create_sample_campaign(session)
    response = client.get("/campaigns/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["data"][0]["name"] == "test_campaign"

def test_pagination(client, session):
    for i in range(6):
        c = Campaign(
            name=f"campaign_{i}",
            tipo_campania="mensual",
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2025, 1, 31),
            universo_zona_metro=1, impactos_personas=1, impactos_vehiculos=1,
            frecuencia_calculada=1.0, frecuencia_promedio=1.0, alcance=1,
            nse_ab=0, nse_c=0, nse_cmas=0, nse_d=0, nse_dmas=0, nse_e=0,
            edad_0a14=0, edad_15a19=0, edad_20a24=0, edad_25a34=0,
            edad_35a44=0, edad_45a64=0, edad_65mas=0, hombres=0, mujeres=0
        )
        session.add(c)
    session.commit()
    
    response = client.get("/campaigns/")
    data = response.json()
    assert data["total"] == 6
    assert len(data["data"]) == 6
    assert data["pageSize"] == 10
    
    # Page 2
    response = client.get("/campaigns/?skip=5")
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["name"] == "campaign_5"

def test_filter_by_type(client, session):
    c1 = Campaign(name="mensual_c", tipo_campania="mensual", fecha_inicio=date(2025,1,1), fecha_fin=date(2025,1,1), universo_zona_metro=0, impactos_personas=0, impactos_vehiculos=0, frecuencia_calculada=0, frecuencia_promedio=0, alcance=0, nse_ab=0, nse_c=0, nse_cmas=0, nse_d=0, nse_dmas=0, nse_e=0, edad_0a14=0, edad_15a19=0, edad_20a24=0, edad_25a34=0, edad_35a44=0, edad_45a64=0, edad_65mas=0, hombres=0, mujeres=0)
    c2 = Campaign(name="catorcenal_c", tipo_campania="catorcenal", fecha_inicio=date(2025,1,1), fecha_fin=date(2025,1,1), universo_zona_metro=0, impactos_personas=0, impactos_vehiculos=0, frecuencia_calculada=0, frecuencia_promedio=0, alcance=0, nse_ab=0, nse_c=0, nse_cmas=0, nse_d=0, nse_dmas=0, nse_e=0, edad_0a14=0, edad_15a19=0, edad_20a24=0, edad_25a34=0, edad_35a44=0, edad_45a64=0, edad_65mas=0, hombres=0, mujeres=0)
    session.add(c1)
    session.add(c2)
    session.commit()
    
    response = client.get("/campaigns/?tipo_campania=mensual")
    data = response.json()
    assert data["total"] == 1
    assert data["data"][0]["name"] == "mensual_c"

def test_get_campaign_detail(client, session):
    create_sample_campaign(session)
    response = client.get("/campaigns/test_campaign")
    assert response.status_code == 200
    assert response.json()["name"] == "test_campaign"

def test_get_campaign_not_found(client, session):
    response = client.get("/campaigns/non_existent")
    assert response.status_code == 404
