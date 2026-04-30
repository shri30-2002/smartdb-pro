from fastapi import FastAPI
from database import engine, SessionLocal
from models import Base, Server

# Step 1: Create app FIRST
app = FastAPI(title="SmartDB Pro API")

# Step 2: Create tables
Base.metadata.create_all(bind=engine)

# Step 3: Routes

@app.get("/")
def home():
    return {"message": "SmartDB Pro Backend Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/add-server")
def add_server(data: dict):
    db = SessionLocal()

    new_server = Server(
        name=data["name"],
        host=data["host"],
        port=data["port"]
    )

    db.add(new_server)
    db.commit()

    return {"message": "Server added"}

@app.get("/servers")
def get_servers():
    db = SessionLocal()
    servers = db.query(Server).all()
    return servers