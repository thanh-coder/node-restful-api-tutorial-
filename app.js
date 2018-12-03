const express = require('express');
var app = express();
var redis   = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser')
require("dotenv").config();
var bodyParser = require("body-parser");
var mongoose=require('mongoose');
const http = require('http');
var redisClient = redis.createClient({host : 'localhost', port : 6379});


// const app = require('./app');

const port = process.env.PORT || 3000;

redisClient.on('ready',function() {
  console.log("Redis is ready");
 });
 
 redisClient.on('error',function() {
  console.log("Error in Redis");
 });
 redisClient.set("language","nodejs")
 redisClient.get("language",function(err,reply) {
  console.log(err);
  console.log(reply);
 });
// const server = http.createServer(app);

// server.listen(port,() => console.log("server run at port 3000"));
var orderRouter = require("./routes/orders")
var productRouter = require("./routes/products")
var userRouter = require("./routes/user")
// var authMiddleware=require("./middleware/auth.middleware")

mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW1 + '@rest-api-i5gkz.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true} )
.then(()=>console.log("succses"))
.catch((err)=>console.log("that bai"))

// console.log(process.env.SESSION_SECRET)
// app.use(cookieParser("process.env.SESSION_SECRET"))
// app.set('view engine', 'pug');
// app.set("views", "./views");
// app.use(express.static("public"));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cookieParser());
app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: redisClient,ttl :  260}),
  saveUninitialized: false,
  resave: false
}));
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
//     return next();
// });



app.get('/',function(req,res){  
  // create new session object.
  if(req.session.key) {
      // if email key is sent redirect.
      res.redirect('/admin');
  } else {
      // else go to home page.
      res.render('index.html');
  }
});
app.post('/login',function(req,res){
  // when user login set the key to redis.
  req.session.key=req.body.email;
  res.end('done');
});

app.get('/logout',function(req,res){
  req.session.destroy(function(err){
      if(err){
          console.log(err);
      } else {
          res.redirect('/');
      }
  });
});
app.use("/product",productRouter);
app.use("/order",orderRouter)
app.use("/signin",userRouter)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
app.listen(port,() => console.log("server run at port 3000"));

// module.exports = app;