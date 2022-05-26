const { use } = require('bcrypt/promises');
var express = require('express');
const { ObjectId } = require('mongodb');

var router = express.Router();
const userhelpers = require('../helpers/userhelpers');

/* GET home page. */
 Verifylogin = function(req,res,next){
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect("/signin")
  }
}
router.get('/', function(req, res, next) {
  let user = req.session.user
  console.log(user);
  res.render('user',{user});
});
router.get("/signin",function(req,res){
  res.render("signin",{"LoginErr":req.session.logginErr})
  req.session.logginErr = false
})
router.get("/signup",function(req,res){
  res.render("signup")
})
router.post("/signup",function(req,res){

  userhelpers.dosignup(req.body).then(function(response,err){

    if(!err){
      console.log(req.body)
    }else{
      console.log(err)
    }

  })
  res.render("userdetails")

})
router.post("/userdetails",function(req,res){
  console.log(req.body)
  
  
  userhelpers.adduser(req.body,function(insertedId){
    let Image = req.files.Image
    Image.mv("./public/images/"+insertedId+".jpg",function(err,done){
      if(!err){
        res.render("user")
        console.log(req.body)
      }else{
        console.log(err)
      }
    })
    
  })
})
router.post("/signin",function(req,res){
  userhelpers.dologin(req.body).then(function(response){
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      
      res.redirect("/")
    }else{
      req.session.loginErr = true
      res.redirect("signin")
      
    }
  })
  
})
router.get("/card",Verifylogin,function(req,res){

  userhelpers.getuser().then(function(players){
      
    res.render("card",{players,user:true})
  })
  
})
router.get("/signout",function(req,res){
  req.session.destroy()
  res.redirect("/signin")

})


  
  




module.exports = router;
