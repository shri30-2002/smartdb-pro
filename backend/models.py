from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

# Step 1: Create base class  , Base = parent class for all models
Base = declarative_base()

# Step 2: Define table
class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    host = Column(String)
    port = Column(String)