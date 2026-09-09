import { useContext, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { loginUser, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registerFormData, setRegisterFormData] = useState({
        email: '',
        password: '',

    });
    const onInputChangeHandler = (e) => {
        const { name, value } = e.target;

        setRegisterFormData((prev) => ({ ...prev, [name]: value.trim() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loggedInUser = await loginUser(registerFormData);
            if (loggedInUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch {
            // Error is handled in context
        }
    };


    return (
        <main className="auth">
            <div className="auth-form-wrapper">
                <h1 className="auth-form__title">Kindly Login</h1>
                <p className="auth-form__subtitle">Enter your details to get started.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label htmlFor="email" className="auth-form__label">Email</label>
                        <input type="email" id="email" name="email" className="auth-form__input" placeholder="Enter your email" onChange={onInputChangeHandler} />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="password" className="auth-form__label">Password</label>
                        <input type="password" id="password" name="password" className="auth-form__input" placeholder="Enter your password" onChange={onInputChangeHandler} />
                    </div>


                    {error && <p className="auth-form__error">{error}</p>}

                    <button type="submit" className="auth-form__submit" disabled={loading} >{loading ? "loading..." : "Continue"}</button>
                </form>
            </div>
        </main>
    )
}

export default LoginPage
