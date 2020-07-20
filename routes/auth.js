const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
router.use(bodyparser.urlencoded({extended:true}));
const User = mongoose.model("User")
const Person = mongoose.model("Person")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {JWT_KEYS} = require('../keys')
const requirel = require('../middleware/requirelogin')
const nodemailer = require('nodemailer'); 


const crypto = require('crypto')

//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
//router.get("/",(req,res)=>{
  // res.sendFile('login.html');
//})



let mailTransporter = nodemailer.createTransport({ 
	service: 'gmail', 
	auth: { 
		user: 'kavitaprajapati132004@gmail.com', 
		pass: 'Kavita@123.'
	} 
}); 
router.post("/register",(req,res)=>{
    var username = req.body.name;
    var email = req.body.email;
    var password = req.body.pass1;
    
    if(!email || !username || !password ){
        return res.status(422).json({error:"Please fill each Field"})
    }
    
    console.log(username,email,password);
    User.findOne({email:email})
    .then((SavedUser)=>{
        if(SavedUser){
            return res.status(422).json({error:"Email Already Exist"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                name:username,
                email:email,
                password:hashedpassword
    
            })
            user.save().then(user=>{
                


                res.json({message:"User Registered Successfully"})
            })
            .catch(err=>{
                console.log(err);
            })

        })
       
    })
    .catch(err=>{
        console.log(err);
    })
    
})

router.post("/login",(req,res)=>{

    var email = req.body.email;
    var password = req.body.passwd;
    if(!email || !password){
        return res.status(422).json({error:"Please fill each Field"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"You have given Wrong Email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
                const token = jwt.sign({_id:savedUser._id},JWT_KEYS)
                res.json(token)
                //return res.json({message:"You Have Successfully Logged in "})
            }
            else{
                return res.status(422).json({error: "Invalid Password"});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
   
})
router.get("/contactus",(req,res)=>{
    res.sendFile('contact.html');
 })


 router.post("/submitmessage",function(req,res){
     var fname = req.body.firstname;
     var lname = req.body.lastname;
     var email = req.body.email;
     var mobile = req.body.mobile;
     var message = req.body.message;
     const person = new Person({
        fname,
        lname,
        email,
        phone:mobile,
        message

    }).save();
    //person.save();

     console.log(fname,lname,email,mobile,message);
     res.send("Message is sent")
 })


 //router.post("/login",(req,res)=>{
   
   //var email =  req.body.email
   //var pass= req.body.passwd;
   //console.log(email);
   //console.log(pass);

   
 //})

 router.post('/reset',(req,res)=>{

    var otp= Math.floor(100000+Math.random() * 900000)
    var email= req.body.email;
    User.findOne({email:email}).then(user=>{
        if(!user){
            return res.status(422).json({error:"Email address is not valid"});
        }
        user.ResetToken=otp
        user.ExpireToken = Date.now() + 3600000
        user.save().then((result=>{

     //sending email
     
    
     let mailDetails = { 
        from: 'your-email-address', 
        to:email, 
        subject: 'Password Reset', 
        html: `
        <p>Your Otp for password Reset  ${otp} </p>
       `
    }; 
    mailTransporter.sendMail(mailDetails, function(err, data) { 
        if(err) { 
            console.log('Error Occurs'); 
        } else { 
           res.render("enterotp",{otp:otp,email:email})
        } 
    }); 
       

        }))
    })
})

router.post('/changepassword',(req,res)=>{

  var email = req.body.email;
  res.render('changepass',{email:email})
  
  })
router.post('/confirm',(req,res)=>{
    var password = req.body.password
    var email = req.body.email

    User.findOne({email:email}).then(newuser=>{
        if(!newuser){
          return res.status(422).json({error:"Something Went Wrong"})
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            newuser.password = hashedpassword
            newuser.ResetToken = undefined
            newuser.ExpireToken = undefined
            newuser.save().then((savedUser)=>{
                res.json({message:"Your Password Has been Updated Successfully "})
  
            })
  
        })
    }).catch(err=>{
        console.log(err);
    })
  
      res.redirect('/login')
    })
  
router.post('/subscribe',(req,res)=>{
 var email= req.body.email;

 let mailDetails = { 
    from: 'your-email-address', 
    to:email, 
    subject: 'Welcome to Eduvita', 
    html: `
    <p>Welcome to Eduvita You are now subscriber of our mail system </p>
   `
}; 
mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
       res.render("login");
    } 
}); 

})


module.exports = router;

//http://localhost/mypage16866bc0895e5e500ca9a067b28e8da5da2845870143d371b5fade8425936dc4