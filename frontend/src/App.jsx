import { useState, useEffect, useRef } from 'react';

import Spinner from './components/Spinner';
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL;

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [inputVal, setinputVal] = useState('');
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/todos`);
            if (!res.ok) {
                throw new Error(`fetchTodos関数内でHTTP errorが発生した。 status: ${res.status}`);
            }

            const data = await res.json();
            setTodos(data);
        } catch (err) {
            console.log('fetchTodos関数内でエラーが発生した->', err);
        }

        setLoading(false);
    };

    const addTodo = async () => {
        setLoading(true);

        try {
            if (!inputVal) return;

            const res = await fetch(`${API_URL}/todos`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: inputVal }),
            });
            if (!res.ok) {
                throw new Error(`addTodo関数内でHTTP errorが発生した。 status: ${res.status}`);
            }

            const data = await res.json();
            setTodos([...todos, data]);
            setinputVal('');
            inputRef.current.focus(); // 新規登録したら、focusを、登録ボタンのままではなくinput欄に戻す（UX改善）
        } catch (err) {
            console.log('addTodo関数内でエラーが発生した->', err);
        }

        setLoading(false);
    };

    const deleteTodo = async (id) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`deleteTodo関数内でHTTP errorが発生した。 status: ${response.status}`);
            }

            await fetchTodos();
        } catch (err) {
            console.log('deleteTodo関数内でエラーが発生した->', err);
        }

        setLoading(false);
    }

    const updateTodo = async (id, currentContent) => {
        const content = prompt('編集内容を入力してください', currentContent);
        if (!content) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) {
                throw new Error(`updateTodo関数内でHTTP errorが発生した。 status: ${response.status}`);
            }

            await fetchTodos();
        } catch (err) {
            console.log('updateTodo関数内でエラーが発生した->', err);
        }

        setLoading(false);
    }

    return (
        <div>
            <h1>Todoリスト</h1>

            {loading && <Spinner />}

            {todos.map((todo, index) => (
                <div key={index}>
                    <span className='list-todo'>{todo.content}</span>
                    <button className='list-todo' onClick={() => deleteTodo(todo.id)}>削除</button>
                    <button className='list-todo' onClick={() => updateTodo(todo.id, todo.content)}>編集</button>
                </div>
            ))}

            <br />

            <input
                type="text"
                value={inputVal}
                placeholder='新しいTodoを入力'
                ref={inputRef}
                autoFocus
                onChange={e => setinputVal(e.target.value)}
            />
            <button onClick={addTodo}>登録</button>
        </div>
    );
};

export default Todo;
