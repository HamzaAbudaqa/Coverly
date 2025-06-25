from sqlalchemy import Column, Integer, String
from database import Base

class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    full_name = Column(String)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    resume = Column(String)
    experience = Column(String)
    skills = Column(String)
    projects = Column(String)
