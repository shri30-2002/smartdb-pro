from database import engine
from backend.models import Base
from fastapi import FastAPI

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartDB Pro API")

@app.get("/")
def home():
    return {"message": "SmartDB Pro Backend Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}