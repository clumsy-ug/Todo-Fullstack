import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# 環境に応じて.envファイルを読み込む
# if os.environ.get("FLASK_ENV") == "production":
if os.environ.get("ENVIRONMENT") == "production":
    load_dotenv(".env.production")
else:
    load_dotenv(".env.development")

app = Flask(__name__)

# 環境変数から設定を読み込む
# app.config["ENV"] = os.environ.get("FLASK_ENV", "development")
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "1") == "1"

# 環境変数から CORS の設定を読み込む
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

# 環境変数からデータベースURIを読み込む
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///my_database.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), nullable=False)

    def __init__(self, content):
        self.content = content

    def __repr__(self):
        return self.content


# アプリケーションコンテキスト内でデータベースを作成
with app.app_context():
    db.create_all()


@app.route("/")
def hello():
    return "Hello from Flask!"


@app.route("/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{"id": todo.id, "content": todo.content} for todo in todos])


@app.route("/todos", methods=["POST"])
def add_todo():
    if not request.json or "content" not in request.json:
        return jsonify({"error": "Bad Request", "message": "Content is required"}), 400
    content = request.json["content"]
    todo = Todo(content=content)
    db.session.add(todo)
    db.session.commit()
    return jsonify({"id": todo.id, "content": todo.content}), 201


@app.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"id": todo.id, "content": todo.content}), 200


@app.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    if not request.json or "content" not in request.json:
        return jsonify({"error": "Bad Request", "message": "Content is required"}), 400
    todo.content = request.json["content"]
    db.session.commit()
    return jsonify({"id": todo.id, "content": todo.content}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
