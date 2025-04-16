from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from routes import bp as api_bp
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
app.config.from_object(Config)
db = SQLAlchemy(app)
CORS(app)

db.init_app(app)
app.register_blueprint(api_bp, url_prefix='/api')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
