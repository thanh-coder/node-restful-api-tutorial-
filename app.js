const express = require('express');
var app = express();

var cookieParser = require('cookie-parser')
require("dotenv").config();
var bodyParser = require("body-parser");
var mongoose=require('mongoose');
const http = require('http');
// const app = require('./app');

const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port,() => console.log("server run at port 3001"));
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

app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
//     return next();
// });

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
module.exports = app;