const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const app = express();
require('dotenv').config();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asfadjsfadiofjkadvdfga';

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions)); //enables cors for all ports

mongoose.connect(process.env.MONGO_URL, {bufferCommands: false}).then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        }); 

        res.json(userDoc);
    } catch(e) {
        res.status(422).json(e);
    } 
});

app.post( '/login', async (req, res) => {
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json("Password ok!!");
            });
        }
        else{
            res.status(422).json("Password NOT ok!!");
        }
        // res.json('found');
    } else {
        res.json('not found');
    }
});


//Ai7fF4Jcp34DPBVm
//14.139.240.50

app.listen(4000, () => {
    console.log("Listening on port 4000");
});

// const http = require('http'); 
// const server = http.createServer(app); 
// server.listen(PORT);