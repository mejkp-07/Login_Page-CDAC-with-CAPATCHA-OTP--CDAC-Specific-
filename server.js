const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const axios = require('axios')

const app = express();
const port = process.env.PORT || 5000;

const pool = new pg.Pool({
    connectionString: 'postgresql://pms:Pms123@devEgovPMS.dcservices.in:5432/PMS_12072023',
});

app.use(cors());
app.use(bodyParser.json());

const SITE_SECRET = '6Ld9tWAoAAAAAJ14Ojt1n-zBddtIxrBw-Xq8-5Tb'

app.post('/send-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    const accountSid = 'AC53c120bbecab8b67720173051812cbd0';
    const authToken = 'ec356f2e6d09578ab9595d341c9a083b';
    const client = require('twilio')(accountSid, authToken);
    // Use Twilio to send OTP to the provided mobile number
    client.messages
        .create({
            body: `Your OTP is: ${otp}`,
            from: '+13343098132', // Your Twilio phone number
            to: mobile,
        })
        .then((message) => {
            res.status(200).json({ message: 'OTP sent successfully' , otpGenerated: otp});
        })
        .catch((error) => {
            res.status(400).json({ error: 'Failed to send OTP' });
        });
});

app.post('/verify-otp', async (req, res) => {
    const { mobile, otp, otpGenerated } = req.body;
    //console.log( otp)
    //console.log(typeof otp)
    //console.log(typeof otpGenerated)
    //console.log(otpGenerated)

    // Implement OTP verification logic here (e.g., comparing with the generated OTP)
    const isVerified = Number(otp) === otpGenerated; // Replace '1234' with the correct OTP
    //console.log(isVerified)
    if (isVerified) {
        res.status(200).json({ verified: true });
    } else {
        res.status(400).json({ verified: false });
    }
});

app.post("/verify", async (request, response) => {
    const { captchaValue } = request.body;
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SITE_SECRET}&response=${captchaValue}`
    );
    //console.log(data)
    response.send(data);
  });

// Register a new user
app.post('/register', async (req, res) => {
    const { employeeName, employeeID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
        'INSERT INTO pms.pms_employee_master (emp_id, str_emp_name, password) VALUES ($1, $2, $3)',
        [employeeID, employeeName, hashedPassword],
        (error, results) => {
            if (error) {
                //console.error('Error in user registration:', error);
                res.status(400).json({ error: 'User registration failed.' });
            } else {
                res.status(201).json({ message: 'User registered successfully.' });
            }
        }
    );
});

// Login and generate a JWT token
app.post('/login', async (req, res) => {
    const { employeeID, password } = req.body;

    pool.query('SELECT * FROM pms.pms_employee_master WHERE emp_id = $1', [employeeID], async (error, results) => {
        if (error || results.rows.length === 0) {
            res.status(401).json({ error: 'Authentication failed.' });
        } else {
            const user = results.rows[0];
            const userName = user.str_emp_name
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ userId: user.id }, 'your_secret_key_here', { expiresIn: '1h' });
                res.status(200).json({ token , userName});
            } else {
                res.status(401).json({ error: 'Authentication failed.' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
