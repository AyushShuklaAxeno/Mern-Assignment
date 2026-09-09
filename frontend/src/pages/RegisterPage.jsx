import { useContext, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

    const { registerUser, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',

    });
    const onInputChangeHandler = (e) => {
        const { name, value } = e.target;

        setRegisterFormData((prev) => ({ ...prev, [name]: value.trim() }));

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(registerFormData);
            navigate('/login');
        } catch {
            // Error handled in context
        }
    };




    return (
        <main className="auth">
            <div className="auth-form-wrapper">
                <h1 className="auth-form__title">Create your account</h1>
                <p className="auth-form__subtitle">Enter your details to get started.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label htmlFor="name" className="auth-form__label">Name</label>
                        <input type="text" id="name" name="name" className="auth-form__input" placeholder="Enter your name" onChange={onInputChangeHandler} />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="email" className="auth-form__label">Email</label>
                        <input type="email" id="email" name="email" className="auth-form__input" placeholder="Enter your email" onChange={onInputChangeHandler} />
                    </div>

                    <div className="auth-form__field">
                        <label htmlFor="password" className="auth-form__label">Password</label>
                        <input type="password" id="password" name="password" className="auth-form__input" placeholder="Enter your password" onChange={onInputChangeHandler} />
                    </div>
                    <div className="auth-form__field">
                        <label htmlFor="phone" className="auth-form__label">Phone Number</label>
                        <input type="tel" id="phone" name="phone" className="auth-form__input" placeholder="Enter your phone number" onChange={onInputChangeHandler} />
                    </div>


                    {error && <p className="auth-form__error">{error}</p>}

                    <button type="submit" className="auth-form__submit" disabled={loading} >{loading ? "loading..." : "Continue"}</button>
                </form>
            </div>
        </main>
    )
}

export default RegisterPage
