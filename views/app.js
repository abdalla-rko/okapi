const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const path = require('path'); // what is this
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const flash = require('express-flash');
const session = require('express-session');
const morgan = require('morgan');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const indexRoute = require('./routes/index/index');
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const feedRoute = require('./routes/feed');
const profileRoute = require('./routes/account/profile');
const editProfileRoute = require('./routes/account/editProfile');
const aboutRotue = require('./routes/about');
const chatRoute = require('./routes/chat');
const errorsRoute = require('./routes/errors');

const app = express();

const server = http.createServer(app)
const io = require('socket.io')(server);
const Room = require('./models/Room');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static('public'));
// app.use(cookieParser());
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 } // todo set true if hosting
  })
  );
  app.use(flash());
  app.use((req, res, next) => {
    req.io = io;
    next();
  })

app.use('/', indexRoute);
app.use('/posts', postsRoute);
app.use('/auth', authRoute);
app.use('/feedRoute', feedRoute);
app.use('/account', profileRoute);
app.use('/account/edit', editProfileRoute);
app.use('/about', aboutRotue);
app.use('/chat', chatRoute);
app.use('*', errorsRoute);

io.on('connection', socket => {
  socket.on('new-user', async (room, name) => {
    socket.join(room)
    await Room.updateOne({ $and: [{ name: room }, { users: { $elemMatch: {username: name} }}] },
    {
      $set: { "users.$.socketId" : socket.id }
    })
    
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', async (room, message, name) => {
    await Room.updateOne({ name: room }, {
      $push: {chats: { message: message, username: name, date: Date.now()}}
    })
    socket.to(room).broadcast.emit('chat-message', message, name)
  })
  socket.on('disconnect', async () => {
    const userData = await Room.findOne({ users: { $elemMatch: { socketId: socket.id}}}, {
      users: {
        $elemMatch: {
          socketId: socket.id
        }
      }, name: 1
    })

    if (userData){
      socket.to(userData.name).broadcast.emit('user-disconnected', userData.users[0].username)
      await Room.updateOne({ name: userData.name }, {
        $pull: {
          users: { username: userData.users[0].username } 
        }
      })
    }
  })
})

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('connected to DB')
);

server.listen(process.env.PORT, () => console.log(`Server has started on port ${process.env.PORT}`));

const auto = "auto";
module.exports =  app;