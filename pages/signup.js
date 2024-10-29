import RegisterForm from '../components/LoginForm/RegisterForm';
import { FormProvider } from '../components/Context/RegisterContext';

export default function Signup() {
    return (
        <FormProvider>
            <RegisterForm />
        </FormProvider>
    );
}
