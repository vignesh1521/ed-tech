'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { jwtDecode } from 'jwt-decode';


import './signup.css'


export default function Signup() {

    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('');
    const [loading, setloading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { setUser } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        setloading(true)
        e.preventDefault();
        const query = `
            mutation($email: String!, $username: String!, $password: String!){
        signup(email: $email, username: $username, password: $password)          
        
        
        }
        `;

        const variables = { email: email, password : password, username: name };

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

            const token = result.data.signup;
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
                    <h2>Sign Up</h2>

                    {errorMessage ?
                        <div className='err_msg'>
                            <i className="uil uil-exclamation-triangle text-red-600 text-1xl"></i>
                            <p>{errorMessage}</p>
                        </div>
                        :
                        <></>
                    }
                    <div className="input_box">
                        <input type="text" placeholder="Enther your name"
                            value={name}
                            onChange={e => setName(e.target.value)} required />
                        <i className="uil uil-user email"></i>
                    </div>
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
                    </div>
                    <button className="button">
                        {
                            loading ? <div className="loader_black"></div> : "Sign Up"
                        }
                    </button>
                    <div className="login_signup">Already have an account? <a onClick={() => router.push("/login")} id="signup">login</a></div>
                </form>
            </div>
        </div>

    )
}
