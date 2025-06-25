from sqlalchemy.orm import Session
from models import Template

def create_template(db: Session, data: dict):
    template = Template(**data)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

def get_template_by_user_id(db: Session, user_id: str):
    return db.query(Template).filter(Template.user_id == user_id).first()
