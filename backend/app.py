from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# CORS(app) # これだけだと全てのリクエスト元からのリクエストを受け付けることになるが、なぜかCORSエラーになる
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) # リクエスト元がhttp://localhost:5173の場合のみ許可する

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), nullable=False)

    def __init__(self, content):
        self.content = content

    def __repr__(self):
        return self.content


# このコードがアプリケーションコンテキスト内で実行されることを保証する
with app.app_context():
    db.create_all()


@app.route('/')
def hello():
    return "Hello from Flask!"


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{'id': todo.id, 'content': todo.content} for todo in todos])


@app.route('/todos', methods=['POST'])
def add_todo():
    if not request.json or 'content' not in request.json:  # エラーハンドリング
        return jsonify({'error': 'Bad Request', 'message': 'Content is required'}), 400
    content = request.json['content']
    todo = Todo(content=content)
    db.session.add(todo)
    db.session.commit()
    return jsonify({'id': todo.id, 'content': todo.content}), 201


@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    # todo = Todo.query.get(id)  # エラーハンドリングができていない（idが存在しない場合はNoneを返すだけ）
    todo = Todo.query.get_or_404(id)  # idが存在しない場合は404エラーを返す
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'id': todo.id, 'content': todo.content}), 201


@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'Bad Request', 'message': 'Content is required'}), 400
    todo.content = request.json['content']
    db.session.commit()
    return jsonify({'id': todo.id, 'content': todo.content}), 200


if __name__ == '__main__':
    app.run(debug=True)
