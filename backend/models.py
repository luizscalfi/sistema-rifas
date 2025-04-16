from database import db

class Rifa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.String(255))
    total_numeros = db.Column(db.Integer)
    compradores = db.relationship('Comprador', backref='rifa', cascade="all, delete-orphan")

class Comprador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    contato = db.Column(db.String(120))
    numeros = db.Column(db.String(255))
    rifa_id = db.Column(db.Integer, db.ForeignKey('rifa.id'), nullable=False)
