from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///evodoc.db"

#connects database to the python code
engine = create_engine(DATABASE_URL,connect_args={"check_same_thread": False}) #needed for connecting to fastapi server

#declares base for all tables
Base = declarative_base()

#declares sessions that will make determine how to add and save data to the db
SessionLocal = sessionmaker(autoflush=False, autocommit = False, bind = engine)
#autoflush - doesnt let you save changes to db until you commmit
#autoflush - changes arent saved until db.commit() is encountered

def get_db():
    db = SessionLocal() #create session
    try:
        yield db
    finally:
        db.close()