from pydantic import BaseModel

class ServerCreate(BaseModel):
    name: str
    host: str
    port: str