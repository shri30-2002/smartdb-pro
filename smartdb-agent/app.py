from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scanner import scan_server, servers, save_servers
import jwt
import datetime

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- JWT CONFIG ----------------
SECRET_KEY = "smartdb_secret_key"
ALGORITHM = "HS256"

ADMIN_EMAIL = "admin@smartdb.com"
ADMIN_PASSWORD = "admin123"

# ---------------- MODELS ----------------
class LoginData(BaseModel):
    email: str
    password: str


class ServerData(BaseModel):
    name: str
    host: str
    port: int


# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "SmartDB Agent Running"}


# ---------------- LOGIN ----------------
@app.post("/login")
def login(user: LoginData):
    if (
        user.email == ADMIN_EMAIL and
        user.password == ADMIN_PASSWORD
    ):
        payload = {
            "sub": user.email,
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(hours=2)
        }

        token = jwt.encode(
            payload,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "access_token": token
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )


# ---------------- SCAN ----------------
@app.get("/scan")
def scan():
    return scan_server()


# ---------------- GET SERVERS ----------------
@app.get("/servers")
def get_servers():
    return servers


# ---------------- ADD SERVER ----------------
@app.post("/add-server")
def add_server(server: ServerData):
    servers.append({
        "name": server.name,
        "host": server.host,
        "port": server.port
    })

    save_servers(servers)

    return {
        "message": "Server Added Successfully"
    }


# ---------------- DELETE SERVER ----------------
@app.delete("/delete-server/{index}")
def delete_server(index: int):
    if index < 0 or index >= len(servers):
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    deleted = servers.pop(index)

    save_servers(servers)

    return {
        "message": "Server deleted",
        "server": deleted
    }

# ---------------- UPDATE SERVER ----------------
@app.put("/update-server/{index}")
def update_server(index: int, server: ServerData):
    if index < 0 or index >= len(servers):
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    servers[index] = {
        "name": server.name,
        "host": server.host,
        "port": server.port
    }

    save_servers(servers)

    return {
        "message": "Server updated successfully"
    }