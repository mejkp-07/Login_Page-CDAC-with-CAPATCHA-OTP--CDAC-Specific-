// Dashboard.js
import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [employeeName, setEmployeeName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('employeeName');
        setEmployeeName(name);
    }, []);

    return (
        <div className="App">
            <div className="container">
                <h1>Welcome {employeeName}</h1>
            </div>
        </div>
    );
}

export default Dashboard;

