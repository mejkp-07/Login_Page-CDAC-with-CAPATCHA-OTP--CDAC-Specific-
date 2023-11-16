import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
//import Dashboard from './components/Dashboard';

function Register() {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    //const [token, setToken] = useState(localStorage.getItem('token'));
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpGenerated, setOtpGenerated] = useState('')
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false)
    
    const handleRegister = () => {
        axios
            .post('/register', { employeeName, employeeID, password })
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                setMessage(error.response.data.error);
            });
    };
    
    const handleSendOtp = () => {
        // Generate a random OTP
        const generatedOtp = Math.floor(1000 + Math.random() * 9000);

        // Send the OTP to the mobile number
        axios
            .post('/send-otp', { mobile, otp: generatedOtp })
            .then((response) => {
                setOtpSent(true);
                setOtpGenerated(response.data.otpGenerated)
                setMessage('OTP sent to your mobile number. Please check your messages.');
            })
            .catch((error) => {
                setMessage('Failed to send OTP. Please try again.');
            });
    };

    const handleVerifyOtp = () => {
        // Verify the OTP entered by the user
        axios
            .post('/verify-otp', { mobile, otp, otpGenerated})
            .then((response) => {
                if (response.data.verified) {
                    // OTP is valid
                    setVerified(true)
                    setMessage('OTP verified successfully.');
                } else {
                    // Invalid OTP
                    console.log("i am in")
                    setMessage('Invalid OTP. Please try again.');
                }
            })
            .catch((error) => {
                setMessage('Failed to verify OTP. Please try again.');
            });
    };

    return (
        <div className="App" >
        <div className='container'>
            <h1>Register</h1>
            <div>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                />
            </div>
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
            <div>
                <input
                        type="text"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
            </div>
            {otpSent ? (
            <div>
                <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
            </div>
            ) : (
                <button onClick={handleSendOtp}>Send OTP</button>
            )}

            {verified && <div>
                <button onClick={handleRegister} disabled={!verified}>Register</button>
            </div>}
            <div>{message}</div>
            </div>
        </div>
    );
}

export default Register;
