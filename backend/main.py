from fastapi import FastAPI

app = FastAPI(title="SmartDB Pro API")

@app.get("/")
def home():
    return {"message": "SmartDB Pro Backend Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}