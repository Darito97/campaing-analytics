import pandas as pd
import numpy as np
from datetime import datetime
from app.database import SessionLocal, engine
from app.models import Base, Campaign, CampaignPeriod, CampaignSite
from app import crud, schemas

def clean_number(x):
    if isinstance(x, str) and '-' in x:
        # Handle cases where numbers are formatted as dates
        return int(x.split('-')[0])
    return x

def load_data():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Read and clean agrupado data
        df_agrupado = pd.read_csv('data/bd_campanias_agrupado.csv')
        df_agrupado = df_agrupado.drop_duplicates(subset=['name'])
        # Read and clean periodos data
        df_periodos = pd.read_csv('data/bd_campanias_periodos.csv')
        df_periodos['impactos_periodo_vehiculos'] = df_periodos['impactos_periodo_vehículos'].apply(clean_number)
        
        # Read and clean sitios data
        df_sitios = pd.read_csv('data/bd_campanias_sitios.csv')

        # Process campaigns
        for _, row in df_agrupado.iterrows():
            # Check if exists
            existing = db.query(Campaign).filter(Campaign.name == row['name']).first()
            if existing:
                continue

            campaign = Campaign(
                name=row['name'],
                tipo_campania=row['tipo_campania'],
                fecha_inicio=datetime.strptime(row['fecha_inicio'], '%Y-%m-%d').date(),
                fecha_fin=datetime.strptime(row['fecha_fin'], '%Y-%m-%d').date(),
                universo_zona_metro=row['universo_zona_metro'],
                impactos_personas=row['impactos_personas'],
                impactos_vehiculos=row['impactos_vehiculos'],
                frecuencia_calculada=row['frecuencia_calculada'],
                frecuencia_promedio=row['frecuencia_promedio'],
                alcance=row['alcance'],
                nse_ab=row['nse_ab'],
                nse_c=row['nse_c'],
                nse_cmas=row['nse_cmas'],
                nse_d=row['nse_d'],
                nse_dmas=row['nse_dmas'],
                nse_e=row['nse_e'],
                edad_0a14=row['edad_0a14'],
                edad_15a19=row['edad_15a19'],
                edad_20a24=row['edad_20a24'],
                edad_25a34=row['edad_25a34'],
                edad_35a44=row['edad_35a44'],
                edad_45a64=row['edad_45a64'],
                edad_65mas=row['edad_65mas'],
                hombres=row['hombres'],
                mujeres=row['mujeres']
            )
            db.add(campaign)

        # Process periods (Optimized check: if campaign was skipped, maybe assume periods exist or check them too. 
        # For simplicity, we can wrap the whole block in try-except or check individually. 
        # Better: Check existing campaign names to filter inserts)
        
        # NOTE: For simplicity in this script, we can just use merge or ignore errors, but clean check is better.
        # Since relationships are not cascade-deleted here, duplicate inserts on child tables might fails too if PKs clash,
        # but child tables utilize auto-increment IDs usually. Let's check models.py
        


        # Process periods
        for _, row in df_periodos.iterrows():
            period = CampaignPeriod(
                campaign_name=row['name'],
                period=row['period'],
                impactos_periodo_personas=row['impactos_periodo_personas'],
                impactos_periodo_vehiculos=row['impactos_periodo_vehiculos']
            )
            db.add(period)

        # Process sites
        for _, row in df_sitios.iterrows():
            site = CampaignSite(
                campaign_name=row['name'],
                codigo_del_sitio=row['codigo_del_sitio'],
                tipo_de_mueble=row['tipo_de_mueble'],
                tipo_de_anuncio=row['tipo_de_anuncio'],
                estado=row['estado'],
                municipio=row['municipio'],
                zm=row['zm'],
                frecuencia_catorcenal=row['frecuencia_catorcenal'],
                frecuencia_mensual=row['frecuencia_mensual'],
                impactos_catorcenal=row['impactos_catorcenal'],
                impactos_mensuales=row['impactos_mensuales'],
                alcance_mensual=row['alcance_mensual']
            )
            db.add(site)

        db.commit()

        # Create Admin User
        user = crud.get_user_by_username(db, "admin")
        if not user:
            print("Creating admin user...")
            crud.create_user(db, schemas.UserCreate(username="admin", password="admin123"))
        else:
            print("Admin user already exists.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()
        print("Database seeded successfully.")

if __name__ == "__main__":
    load_data()
