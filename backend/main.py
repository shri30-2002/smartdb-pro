from fastapi import FastAPI
from database import engine, SessionLocal
from models import Base, Server
from schemas import ServerCreate   # ✅ NEW
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartDB Pro API")

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "SmartDB Pro Backend Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/add-server")
def add_server(data: ServerCreate):   # ✅ FIXED
    db = SessionLocal()

    new_server = Server(
        name=data.name,   # ✅ changed
        host=data.host,
        port=data.port
    )

    db.add(new_server)
    db.commit()

    return {"message": "Server added"}

@app.get("/servers")
def get_servers():
    db = SessionLocal()
    servers = db.query(Server).all()
    return servers

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)