// app.js - Line 1 par
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}   

const express=require("express");
const app=express();
const mongoose=require("mongoose"); 

const path=require("path");
const methodOverride=require("method-override");
const { request } = require("http");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session =require("express-session");
// Purani line:
// const MongoStore = require("connect-mongo");

// Nayi line:
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const User=require("./models/user.js");


// console.log(process.env);


async function main() {
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
     
});

store.on("error",()=>{
    console.log(err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

// app.get("/",(req,res)=>{
//     res.send("hi mai root huu");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"Gopal"
//     });
//     let newUser=await User.register(fakeUser,"1234567");
//     res.send(newUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new listing({
//         title:"MY new Villa",
//         decription:"By the bench",
//         price:1200,
//         location:"calangute , Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("sucessful");
// });


app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});



//middleware
app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});



app.listen(8080,()=>{
    console.log("server chal raha hai");
});

