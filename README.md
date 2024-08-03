# Todo-App

![todo_fullstack](https://github.com/user-attachments/assets/9736efa1-77b3-41c2-8352-1df068969d4b)

# 使用技術
## front-end
- React(JavaScript)

## back-end
- Flask(Python)

## database
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
    - useRefで実現

- エラーハンドリングを実装
    - try ~ catch ~ 構文などで実現

- UI改善
    - CSS, react-ions, toastにより実現

- テストコードを実装
    - frontend
        - frontend/ディレクトリでターミナルを開き、`npm run test`を実行
        - Vitestで実現
    
    - backend
        - backend/ディレクトリでターミナルを開き、`pytest`を実行
        - pytestで実現

# Upcoming
[issue](https://github.com/clumsy-ug/Todo-Fullstack/issues)を参照
