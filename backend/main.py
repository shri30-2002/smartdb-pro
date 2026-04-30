from database import SessionLocal
from models import Server

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