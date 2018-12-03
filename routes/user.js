var express = require('express');
var router = express.Router();
const mongoose=require("mongoose")
var bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token') 

const checkAuth = require('../api/middleware/check-auth');

var User = require('./../api/models/users');
var config = require('./../api/config');

var tokenList = {} 


router.post('/',(req,res,next) => {

     User.find({email:req.body.email})
     .exec()
     .then(user => {
         if(user>=1) {
             return res.status(409).json({
                 message:"email exits"
             })
         }else{
             bcrypt.hash(req.body.password,10,(err,hash) => {
                 if(err){
                     return res.status(500).json({
                         errors:err
                     })
                 }else{
                     const user = new User({
                         email:req.body.email,

                         password:hash
                     })
                     user.save()
                     .then(result => {
                     
                         res.status(200).json({
                             result
                        })
                     })
                     .catch(err => {
                         res.status(500).json({errors:err})
                     })
                 }
             })
         }
     })
     .catch(err => {
        res.status(500).json({errors:err})
    })
})

router.post('/login',(req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                messages:"mail not found"
            })
        }
            bcrypt.compare(req.body.password,user[0].password,(err,result) => {
                if(err){
                    return res.status(401).json({
                       messages:"auth failed"
                    })
                 }
                if(result){
                    var users={
                        email:user[0].email,
                        userId:user[0]._id
                    }
                    const token = jwt.sign ({
                        users
                    },
                   
                   process.env.JWT_KEY,
               {
                   expiresIn:'2m'
               })
               const refreshToken = jwt.sign(users, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
               const response = {
                   "status": "Logged in",
                   "token": token,
                   "refreshToken": refreshToken,
               }
               tokenList[refreshToken] = response

               res.cookie("acces_token",token,{
                   httpOnly:true
               });
                    return res.status(200).json({

                        messages:"Auth succsessfull",
                        response
                    })
                }
                res.status(401).json({
                    message:"auth failed"
                })
                })          
         })
        .catch(err => {
            res.status(500).json({errors:err})
        })
        })

 //craete refresh token
 router.post('/token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "password": postData.password
        }
        const token = jwt.sign(user,process.env.JWT_KEY, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
})
       

          //delete token 
          router.post('/token/reject', function (req, res, next) { 
            var refreshToken = req.body.refreshToken 
            if(refreshToken in refreshTokens) { 
              delete refreshTokens[refreshToken]
            } 
            res.send(204) 
          })

router.delete("/:userid",(req,res,next) => {
    User.remove({_id:req.params.id})
    .exec()
    .then(res => {
        res.status(200).json({
            message:"user delete"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})
router.get('/secure',checkAuth, (req,res) => {
    // all secured routes goes here
    res.send('I am secured...')
})

module.exports = router;
