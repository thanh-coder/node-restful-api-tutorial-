var express = require('express');
var router = express.Router();
const mongoose=require("mongoose")
const multer = require('multer');
const checkAuth = require('../api/middleware/check-auth');
var Product = require('./../api/models/products');
var bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
router.get("/:productid",checkAuth,(req,res,next) => {
    const token = req.cookies.acces_token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData ={email:decoded.email,userId:decoded.userId}
     var token1 = jwt.sign( req.userData, process.env.JWT_KEY, { expiresIn: 300 })

    const id = req.params.productid;
    Product.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json({doc,token1});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })

})

router.post('/',checkAuth, function(req, res, next) {
    const products=[];
       
    

    console.log(products)
    
    const product=new Product({
        //  _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price
        
    });
    product.save().then(result=>{
        console.log(result)
    })
    .catch(err => console.log(err));
});

router.patch("/:productId",checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  router.delete("/:productId",checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
module.exports = router;
