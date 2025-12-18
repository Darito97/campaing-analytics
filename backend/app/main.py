from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, crud, schemas
from .database import engine, SessionLocal
from .routes import router
from .dependencies import get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campaign Analytics API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        user = crud.get_user_by_username(db, "admin")
        if not user:
            print("Creating admin user...")
            crud.create_user(db, schemas.UserCreate(username="admin", password="admin123"))
    finally:
        db.close()

from mangum import Mangum
handler = Mangum(app)
