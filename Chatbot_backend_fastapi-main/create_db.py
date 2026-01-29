from db import Base, engine
from models import ChatHistory

Base.metadata.create_all(bind=engine)
print("Database created successfully")
