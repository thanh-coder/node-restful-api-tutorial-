var express = require('express');
var router = express.Router();
const mongoose=require("mongoose")
var bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');

var User = require('./../api/models/users');

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
                    const token = jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },
                   
                   process.env.JWT_KEY,
               {
                   expiresIn:'1h'
               })
                    return res.status(200).json({

                        messages:"Auth succsessfull",
                        token
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

module.exports = router;
