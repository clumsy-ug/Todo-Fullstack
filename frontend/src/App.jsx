import { useState, useEffect, useRef } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import Spinner from './components/Spinner';
import toast, { Toaster } from 'react-hot-toast';
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
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
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
            toast.error('Error fetching todos');
            console.error('Error fetching todos:', err);
        }
        setLoading(false);
    };

    const addTodo = async () => {
        setLoading(true);
        try {
            if (!inputVal) {
                toast.error('空のTodoは登録できません');
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
            toast.success('Todo added successfully');
        } catch (err) {
            toast.error('Error adding todo');
            console.error('Error adding todo:', err);
        }
        setLoading(false);
    };

    const deleteTodo = async (todo_id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/todos/${todo_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchTodos();
            toast.success('Todo deleted successfully');
        } catch (err) {
            toast.error('Error deleting todo');
            console.error('Error deleting todo:', err);
        }
        setLoading(false);
    }

    const updateTodo = async (todo_id, currentContent) => {
        const content = prompt('編集内容を入力してください', currentContent);
        if (!content) {
            toast.error('空のTodoは登録できません');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/todos/${todo_id}`, {
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
            toast.success('Todo updated successfully');
        } catch (err) {
            toast.error('Error updating todo');
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
                    localStorage.setItem('username', username);
                    setIsLoggedIn(true);
                    fetchTodos();
                    toast.success('Login successful');
                } else {
                    setIsRegistering(false);
                    toast.success(data.msg);
                }
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error('Error during authentication');
            console.error('Error:', error);
        }
        setPassword('');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        setTodos([]);
        toast.success('Logged out successfully');
    }

    if (!isLoggedIn) {
        return (
            <div className="auth-container">
                <Toaster />
                <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                <form onSubmit={handleAuth}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="btn register-or-login">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                <button onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link">
                    {isRegistering ? 'Already have an account? Login' : 'Need to register?'}
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <Toaster />
            <div className="header">
                <div className="welcome-message">Welcome, <b>{username}</b> !</div>
                <h1>Todoリスト</h1>
                <button onClick={logout} className="btn btn-logout"><FaSignOutAlt /> Logout</button>
            </div>

            {loading && <Spinner />}

            <div className="todo-list">
                {todos.map((todo) => (
                    <div key={todo.id} className="todo-item">
                        <span>{todo.content}</span>
                        <div className="todo-actions">
                            <button onClick={() => updateTodo(todo.id, todo.content)} className="btn btn-edit"><FaEdit /></button>
                            <button onClick={() => deleteTodo(todo.id)} className="btn btn-delete"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="todo-input">
                <input
                    type="text"
                    value={inputVal}
                    placeholder='新しいTodoを入力'
                    ref={inputRef}
                    onChange={e => setInputVal(e.target.value)}
                />
                <button onClick={addTodo} className="btn btn-add">
                    <FaPlus /> <span>登録</span>
                </button>
            </div>
        </div>
    );
};

export default App;
