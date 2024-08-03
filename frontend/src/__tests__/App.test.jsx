import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// モックの設定
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
    FaTrash: vi.fn(() => null),
    FaEdit: vi.fn(() => null),
    FaPlus: vi.fn(() => null),
    FaSignOutAlt: vi.fn(() => null),
}));

// APIのモック
global.fetch = vi.fn();

describe('App Component', () => {
    it('renders login form when not logged in', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('switches to registration form', () => {
        render(<App />);
        fireEvent.click(screen.getByText('Need to register?'));
        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    });

    // さらにテストを追加...
});
