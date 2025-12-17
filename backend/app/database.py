import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./campaigns.db"

# Fix for AWS Lambda read-only file system
if os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    source_db = "campaigns.db"
    target_db = "/tmp/campaigns.db"
    
    if os.path.exists(source_db):
        if not os.path.exists(target_db):
            shutil.copy2(source_db, target_db)
        SQLALCHEMY_DATABASE_URL = f"sqlite:///{target_db}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
