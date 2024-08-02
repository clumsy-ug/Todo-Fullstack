import { useState, useEffect, useRef } from 'react';
import Spinner from './components/Spinner';
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
    const [todos, setTodos] = useState([]);
    const [inputVal, setInputVal] = useState('');
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchTodos();
        }
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/todos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
        setLoading(false);
    };

    const addTodo = async () => {
        setLoading(true);
        try {
            if (!inputVal) {
                alert('Todoを入力してください');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: inputVal }),
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setTodos([...todos, data]);
            setInputVal('');
            inputRef.current.focus();
        } catch (err) {
            console.error('Error adding todo:', err);
        }
        setLoading(false);
    };

    const deleteTodo = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchTodos();
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
        setLoading(false);
    }

    const updateTodo = async (id, currentContent) => {
        const content = prompt('編集内容を入力してください', currentContent);
        if (!content) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchTodos();
        } catch (err) {
            console.error('Error updating todo:', err);
        }
        setLoading(false);
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        const url = isRegistering ? `${API_URL}/register` : `${API_URL}/login`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                if (!isRegistering) {
                    localStorage.setItem('token', data.access_token);
                    setIsLoggedIn(true);
                    fetchTodos();
                } else {
                    setIsRegistering(false);
                }
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setUsername('');
        setPassword('');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setTodos([]);
    }

    if (!isLoggedIn) {
        return (
            <div>
                <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                <form onSubmit={handleAuth}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have an account? Login' : 'Need to register?'}
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Todoリスト</h1>
            <button onClick={logout}>Logout</button>

            {loading && <Spinner />}

            {todos.map((todo) => (
                <div key={todo.id}>
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
                onChange={e => setInputVal(e.target.value)}
            />
            <button onClick={addTodo}>登録</button>
        </div>
    );
};

export default App;
