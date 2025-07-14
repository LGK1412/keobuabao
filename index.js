const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const authRoute = require('./routes/authRoute')

app.use(cors())
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connect DB successfull!")
}).catch((err) => {
  console.log('Connect DB failed...' + err)
})

const socketHandler = require('./socket/socket');
socketHandler(io); // truyền io vào để xử lý

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/auth')));

app.use('/api/auth', authRoute)

app.get('/healthcheck', (req, res) => res.send('Oke still run...'));

app.get('/login', (req, res) => res.sendFile(__dirname + '/client/auth/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/client/auth/register.html'));

server.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
