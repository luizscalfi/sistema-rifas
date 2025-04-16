# Sistema de Rifas

Projeto web completo para gerenciamento de rifas com frontend em React e backend em Flask (Python), utilizando banco de dados MariaDB.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, React Router, Axios
- **Backend**: Flask, Flask-CORS, Flask-SQLAlchemy
- **Banco de Dados**: MariaDB (via XAMPP/phpMyAdmin)

---

## 📦 Como Executar o Projeto

### 🔧 Backend (Flask)

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Crie e ative um ambiente virtual:
   - Linux/macOS:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Certifique-se de ter o banco MariaDB rodando com o banco `rifas_db` criado (use o `create.sql`).

5. Execute a aplicação:
   ```bash
   python app.py
   ```

---

### 🌐 Frontend (React)

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto:
   ```bash
   npm start
   ```

> O frontend será acessível em `http://localhost:3000`  
> O backend estará em `http://localhost:5000/api`

---

## 🧾 Estrutura do Banco de Dados

Use o script `create.sql` para criar as tabelas:

- **rifa**
- **comprador**

---

## 📡 Principais Endpoints da API

| Método | Rota                             | Descrição                       |
|--------|----------------------------------|----------------------------------|
| GET    | `/api/rifas`                    | Lista todas as rifas            |
| POST   | `/api/rifas`                    | Cria uma nova rifa              |
| GET    | `/api/rifas/<id>`               | Detalhes da rifa                |
| PUT    | `/api/rifas/<id>`               | Atualiza uma rifa               |
| DELETE | `/api/rifas/<id>`               | Deleta uma rifa                 |
| GET    | `/api/rifas/<id>/compradores`   | Lista os compradores da rifa    |
| POST   | `/api/rifas/<id>/compradores`   | Adiciona um comprador           |
| GET    | `/api/compradores/<id>`         | Ver detalhes de um comprador    |
| PUT    | `/api/compradores/<id>`         | Edita um comprador              |
| DELETE | `/api/compradores/<id>`         | Remove um comprador             |
| POST   | `/api/rifas/<id>/sortear`       | Realiza o sorteio da rifa       |

---

## ✨ Autor

Desenvolvido por Luiz Carlos Scalfi Theodoro como exemplo de sistema de rifas com CRUD completo e sorteio automatizado.
