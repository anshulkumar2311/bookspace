//jshint esversion:6
require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
// const encryt = require("mongoose-encryption")
// const md5 = require("md5")
// const bcrypt = require("bcrypt")
// const saltRound = 10
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const findOrCreate = require("mongoose-findorcreate")
const app = express()

app.use(express.static("public"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(session({
    secret: "Our Little Secrets.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// mongoose.connect("mongodb://localhost:27017/user2DB",{useNewUrlParser:true})
// mongoose.connect("mongodb+srv://anshulkumar2311:anshul2311@cluster0.2srpn.mongodb.net",{useNewUrlParser:true});

// mongoose.connect("mongodb+srv://anshul2311:anshul2311@cluster0.zcnu6.mongodb.net", {useNewUrlParser:true})
mongoose.connect("mongodb+srv://anshul1423:anshul1423@cluster0.93ztx.mongodb.net",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
     email: String,
     password: String,
     googleId: String,
     secret:String,
     name:String
})

const userSchema2 = new mongoose.Schema({
      username: String,
      Bname: String,
      Bedition: String,
      Bauthor: String,
      Subject: String,
           Review: String,
           mail:String,
           phno: Number,
           address:String,
           pincode: Number,
           Tdate: String
})

const feedback = new mongoose.Schema({
     fname: String,
     feedback: String,
     fdate: String
})

const contact = new mongoose.Schema({
     cname: String,
     BSid: Number,
})


userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
// console.log(process.env.API);
// const secret = "ThisisOurKey"
// userSchema.plugin(encryt,{secret: process.env.SECRET, encryptedFields: ["password"]})


const User = new mongoose.model("User", userSchema)
const User2 = new mongoose.model("User2",userSchema2)
const feed = new mongoose.model("feed", feedback)
const con = new mongoose.model("con", contact)


app.get("/BS_Buybook", function(req,res){
     User2.find({}, function(err, foundUsers2){
         res.render("BS_Buybook", { newItems: foundUsers2})
     })
})

passport.use(User.createStrategy())

// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

passport.serializeUser(function(user,done){
    done(null,user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id,function(err,user){
        done(err,user)
    })
})

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function(accessToken, refreshToken, profile, cb){
        console.log(profile)
        User.findOrCreate({ googleId: profile.id}, function(err,user){
            return cb(err, user)
        })
    }
))

app.get("/",function(req,res){
     res.render("home")
})

app.get("/auth/google", 
    passport.authenticate("google",{scope: ["profile"]} )
)

app.get("/auth/google/secrets", 
    passport.authenticate("google", {failureRedirect: "/login"}),
    function(req,res){
        res.redirect("/BS_homepage")
    }    
)

app.get("/BS_Bookdonate", function(req,res){
     res.render("BS_Bookdonate")
})

app.get("/BS_Buybook", function(req,res){
     res.render("BS_Buybook")
})

app.get("/BS_BookdonateSucc", function(req,res){
     res.render("BS_BookdonateSucc")
})

app.get("/BS_feedback", function(req,res){
     res.render("BS_feedback")
})

app.get("/BS_homepage", function(req,res){
     res.render("BS_homepage")
})

app.get("/submit", function(req,res){
    if(req.isAuthenticated()){
        res.render("submit")
    }
    else{
        res.render("/login")
    }
})



app.post("/submit", function(req,res){
    const submittedSecret = req.body.secret

    console.log(req.user.id)

    User.findById(req.user.id, function(err, foundUser){
         if(err){
             res.render("register")
             console.log(err)
         }
         else{
             if(foundUser){
                 foundUser.secret = submittedSecret
                 foundUser.save()
                 res.redirect("/secrets")
             }
         }
    })
})

app.post("/BS_Bookdonate" , function(req,res){
      const newUser2 = new User2({
        username : req.body.name0,
        Bname: req.body.name1,
        Bedition: req.body.name2,
        Bauthor: req.body.name3,
        Subject: req.body.name4,
        Review: req.body.textarea,
        mail:req.body.name5,
        phno: req.body.name6,
        address: req.body.textarea2,
        pincode: req.body.name7,
        Tdate: req.body.name8
      })

      newUser2.save(function(err){
          if(err){
              console.log(err)
          }
          else{
              res.render("BS_BookdonateSucc")
          }
      })
})

app.post("/BS_feedback", function(req,res){
     const ffeed = new feed({
         fname: req.body.fname01,
         feedback: req.body.ftextarea01,
         fdate: req.body.fname08
     })

     ffeed.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("thank2")
        }
    })
})

app.post("/BS_contact", function(req,res){
      const ccon = new con({
        cname: req.body.cname01,
        BSid: req.body.eid,
      })

      ccon.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            // alert("We will contact you soon ...");
            // console.log("We will contact you soon ...")
            res.render("thank")
        }
    })
})

app.get("/thank2",function(req,res){
    res.render("thank2")
})



app.get("/login",function(req,res){
     res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/success",function(req,res){
    res.render("success")
})

app.get("/BS_about", function(req,res){
    res.render("BS_about")
})

app.get("/thank", function(req,res){
    res.render("thank")
})
app.get("/secrets", function(req,res){
     User.find({"secret": {$ne: null}}, function(err, foundUsers){
         if(err){
             console.log(err)
         }
         else{
             if(foundUsers){
                 res.render("secrets", {usersWithSecrets: foundUsers})
             }
         }
     })
})

app.get("/logout", function(req,res){
     req.logout();
     res.redirect("/")
})

app.post("/signup", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
             console.log(err);
             res.redirect("/register")
        }
        else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/success")
            })
        }
    })
})

app.post("/register", function(req,res){

    // bcrypt.hash(req.body.password,saltRound,function(err,hash){
    //     const newUser = new User({
    //         email: req.body.username,
    //         password:hash
    //     })
    
    //     newUser.save(function(err){
    //         if(err){
    //             console.log(err)
    //         }
    //         else{
    //             res.render("secrets")
    //         }
    //     })
    // })
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
             console.log(err);
             res.redirect("/register")
        }
        else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/success")
            })
        }
    })
    
})

// app.post("/login", function(req,res){
//      const userName = req.body.username
//      const password = req.body.password

//      User.findOne({email: userName}, function(err, foundUser){
//          if(err){
//              console.log(err)
//          }
//          else{
//              if(foundUser){
//                  if(foundUser.password === password){
//                      res.render("secrets")
//                  }
//              }
//          }
//      })
// })

app.post("/login", function(req,res){
//     const userName = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: userName}, function(err, foundUser){
//         if(err){
//             console.log(err)
//         }
//         else{
//             if(foundUser){
//                 bcrypt.compare(password,foundUser.password,function(err,result){
// if(result==true){
//     res.render("secrets")
// }
//                 })
//             }
//         }
//     })
       
        const user = new User({
           username: req.body.username,
           password: req.body.password,
           
         })
         req.login(user, function(err){
              if(err){
                  console.log(err);
                  alert("Wrong Password Try Again !!")
              }
              else{
                  passport.authenticate("local")(req,res, function(){
                      res.redirect("/BS_homepage")
                  })
              }
         })



})

app.get("/BS_contact", function(req, res){
    res.render("BS_contact");
})

let port = process.env.PORT;
if(port==null || port==""){
    port=3000
}
app.listen(port ,function(){
     console.log("Server Stared on port 5000")
})
