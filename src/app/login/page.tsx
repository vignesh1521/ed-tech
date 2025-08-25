'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { jwtDecode } from 'jwt-decode';


import './login.css'


export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setloading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { setUser } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        setloading(true)
        e.preventDefault();
        const query = `
        mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
        }
        `;

        const variables = { email: email, password };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                setErrorMessage(result.errors[0].message)
                setloading(false)
                return;
            }

            const token = result.data.login;
            localStorage.setItem('token', token);
            setUser(jwtDecode(token));
            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message || "Something went wrong");
                console.error('Network or GraphQL error:', err);
                setloading(false)

            } else {
                setErrorMessage("Something went wrong");
                console.error('Unknown error:', err);
                setloading(false)
            }
        }

    };



    return (

        <div className="form_container">
            <div className="form login_form">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    {errorMessage ?
                        <div className='err_msg'>
                            <i className="uil uil-exclamation-triangle text-red-600 text-1xl"></i>
                            <p>user not found</p>
                        </div>
                        :
                        <></>
                    }


                    <div className="input_box">
                        <input type="email" placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} required />
                        <i className="uil uil-envelope-alt email"></i>
                    </div>
                    <div className="input_box">
                        <input type="password" placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)} required />
                        <i className="uil uil-lock password"></i>
                    </div>
                    <div className="option_field">
                        <span className="checkbox">
                            <input type="checkbox" id="check" />
                            <label htmlFor="check">Remember me</label>
                        </span>
                        <a href="#" className="forgot_pw">Forgot password?</a>
                    </div>
                    <button className="button">
                        {
                            loading ? <div className="loader_black"></div> : "Login Now"
                        }
                    </button>
                    <div className="login_signup">Don&apos;t have an account? <a href="#" id="signup">Signup</a></div>
                </form>
            </div>
        </div>

    )
}
