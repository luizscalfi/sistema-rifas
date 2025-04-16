from flask import Flask
from flask_cors import CORS
from config import Config
from database import db  # usa a instância do db criada em database.py
from routes import bp as api_bp
import os

app = Flask(__name__)

# Configurações
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config.from_object(Config)

# Inicializa extensões
db.init_app(app)
CORS(app)

# Registra blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Cria as tabelas no banco de dados
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
