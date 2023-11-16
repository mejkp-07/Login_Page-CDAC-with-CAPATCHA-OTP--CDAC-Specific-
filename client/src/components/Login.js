import React, { useState, useRef } from 'react';
import '../App.css';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
//import Dashboard from './components/Dashboard';
const REACT_APP_SITE_KEY = '6Ld9tWAoAAAAAOi-X3suMPfhJUNRlyAbIZDJRwXb'
function Login() {
    const recaptcha = useRef();
    const [employeeID, setEmployeeID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    //const [token, setToken] = useState(localStorage.getItem('token'));

    

    const handleLogin = async (event) => {
        event.preventDefault();
        const captchaValue = recaptcha.current.getValue();
        //alert(captchaValue)
        if (!captchaValue) {
            alert("Please verify the reCAPTCHA!");
        } else {
            axios
                .post('/verify', {captchaValue})
                .then((captchaResponse)=>{
                    if(captchaResponse.data.success){
                        axios
                            .post('/login', { employeeID, password })
                            .then((response) => {
                                localStorage.setItem('token', response.data.token);
                                localStorage.setItem('employeeName', response.data.userName);
                                
                                setMessage('Login successful, Welcome ' + response.data.userName);
                                //window.location.href = '/dashboard'
                                setTimeout(() => window.location.href = '/dashboard', 2000)
                                
                                
                            })
                            .catch((error) => {
                                setMessage(error.response.data.error);
                            });
                            alert("Form submission successful!");
                    }else {
                        setMessage('CAPTCHA verification failed. Please try again.');
                    }
                }).catch((error)=>{
                        setMessage('CAPTCHA verification failed. Please try again: ' + error);
                })
            //using fetch()
            /*const res = await fetch("http://localhost:5000/verify", {
            method: "POST",
            body: JSON.stringify({ captchaValue }),
            headers: {
                "content-type": "application/json",
            },
            });
            const data = await res.json();
            if (data.success) {
            // make form submission
            axios
            .post('/login', { employeeID, password })
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('employeeName', response.data.userName);
                
                setMessage('Login successful, Welcome ' + response.data.userName);
                //window.location.href = '/dashboard'
                setTimeout(() => window.location.href = '/dashboard', 2000)
                
                
            })
            .catch((error) => {
                setMessage(error.response.data.error);
            });
            alert("Form submission successful!");
            } else {
            alert("reCAPTCHA validation failed!");
            }*/
        } 
    };

    return (
        <div className="App" >
        <div className='container'>
            <h1>Login</h1>
            <div>
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={employeeID}
                    onChange={(e) => setEmployeeID(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <ReCAPTCHA ref={recaptcha} sitekey={REACT_APP_SITE_KEY} />
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>{message}</div>
            </div>
        </div>
    );
}

export default Login;
