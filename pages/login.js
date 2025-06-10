import LoginForm from '../components/LoginForm/LoginForm';
import { LoginProvider } from '../components/Context/LoginContext';

export default function Login() {
    return (
        <LoginProvider>
            <LoginForm />
        </LoginProvider>
    );
}