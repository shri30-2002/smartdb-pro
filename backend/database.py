from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:admin@localhost:5432/postgres"

#postgresql	database type
#postgres	username
#admin	password
#localhost	running locally
#5432	port
#postgres	database name

engine = create_engine(DATABASE_URL)
#Creates connection to database, Engine = gateway to database

SessionLocal = sessionmaker(bind=engine)

#Used to perform operations like: Insert,Select,Update,Delete

