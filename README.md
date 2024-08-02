# Todoアプリ

# 使用技術
### front-end
- React(JavaScript)

### back-end
- Flask(Python)
- SQLite

# 工夫点
- ログイン機能
    - usernameとpasswordによる認証
    - passwordはhash化することでセキュリティリスクを下げている
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