from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scanner import scan_server
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

# Demo user
ADMIN_EMAIL = "admin@smartdb.com"
ADMIN_PASSWORD = "admin123"

# ---------------- LOGIN MODEL ----------------
class LoginData(BaseModel):
    email: str
    password: str

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "SmartDB Agent Running"}

# ---------------- LOGIN API ----------------
@app.post("/login")
def login(user: LoginData):
    if (
        user.email == ADMIN_EMAIL and
        user.password == ADMIN_PASSWORD
    ):
        payload = {
            "sub": user.email,
            "exp": datetime.datetime.utcnow() +
                   datetime.timedelta(hours=2)
        }

        token = jwt.encode(
            payload,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )

# ---------------- PROTECTED SCAN ----------------
@app.get("/scan")
def scan():
    return scan_server()