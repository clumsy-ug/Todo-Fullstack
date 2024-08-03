# Todo-App

![todo_fullstack](https://github.com/user-attachments/assets/9736efa1-77b3-41c2-8352-1df068969d4b)

# Technology used
### front-end
- React(JavaScript)

### back-end
- Flask(Python)

### database
- SQLite

# Points
- ログイン機能
    - usernameとpasswordによる認証
    - passwordはSHA-256によりhash化することでセキュリティリスクを下げている
    - generate_password_hashなどで実現

- ロード中にスピナーを表示
    - UX向上
    - CSSで実現

- ページをリロードするごとに、input欄にfocusがあたる
    - 登録ボタンを押した後もfocusがinput欄に戻る
    - useRef, autofocus属性で実現

- エラーハンドリングを実装
    - try ~ catch ~ 構文などで実現

- UI改善
    - CSS, react-ions, toastにより実現

- テストコードを実装
    - frontend
        - frontend/ディレクトリでターミナルを開き、`npm run test`を実行
        - Vitestで実現
    
    - backend
        - backend/ディレクトリでターミナルを開き、用途別に以下から選んで実行
            - `pytest`
            - `pytest --cov=app tests/`
            - `pytest --cov=app --cov-report=html tests/`
        - pytestで実現

- コードスタイルのチェック
    - pylintで実現
        - backend/ディレクトリで`pylint app.py`実行

# 使用方法
1. backend serverを立ち上げる

backend/ディレクトリでターミナルを開き、以下を実行
```bash
python app.py
```

2. frontend serverを立ち上げる

frontend/ディレクトリでターミナルを開き、以下を実行
```bash
npm run dev
```

3. databaseを確認する(option)

backend/instanceディレクトリでターミナルを開き、
```bash
sqlite3 my_database.db
```
を実行する。そして
```sql
.tables
```
を実行してtodoテーブルとuserテーブルがあることを確認する。<br>
そしてそれぞれのテーブルの中身を確認する方法は以下。
```sql
select * from todo;
select * from user;
```

# Upcoming
[issue](https://github.com/clumsy-ug/Todo-Fullstack/issues)を参照
