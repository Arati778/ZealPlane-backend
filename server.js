const express = require("express");
const dotenv = require("dotenv").config();
const contactsRoutes = require("./contactsRoutes");
const userRoutes = require("./userRoutes");
const errorHandler = require("./midleware/errorhandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const projectRoutes = require('./routes/projectRoutes');
const commentRouter = require('./routes/commentRoutes');
const likeRouter = require('./routes/likeRoutes');
const forumPost = require('./routes/postRoutes');
const notification = require('./routes/notificationRoutes');
const communities = require('./routes/communityRoutes');
const refreshToken = require("./routes/refreshTokenRoutes");
const validatePermission = require("./routes/validatePermissionRoutes");


// google-oauth import


// const session = require("express-session");
// const passport = require("passport");
// const OAuth2Strategy = require("passport-google-oauth2").Strategy;




// Connect to the database
connectDb();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


// setup session gooogle-oauth

// app.use(session({
//   secret:"1257169875hakgdhfjkdsd",
//   resave:false,
//   saveUninitialized:true
// }))

// setup passport google-passport

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new OAuth2Strategy({
//     clientID:clientid,
//     clientSecret:clientsecret,
//     callbackURL: "http://localhost:5000/api/users/google-login", // Your backend callback URL
//     scope:["profile","email"]
//    },
//    async(accessToken,refreshToken,profile,done)=>{
//     console.log("profile",profile)
//     try{
//         let user=await User.findOne({googleId:profile.id});

//         if(!user){
//           user = new User({
//             googleId:profile.id,
//             fullName:profile.fullName,
//             email:profile.emais[0].value,
//             profilePic:profile.photos[0].value,
//           });
//           await user.save();
//         }

//         return done(null,user)

//     }catch(error){
//         return done(error,null)
//     }
//    }
//   )
// )

// passport.serializeUser((user,done)=>{
//   done(null,user);
// });
// passport.deserializeUser((user,done)=>{
//   done(null,user);
// });

// initial google ouath login
// app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

// app.get("/api/users/google-login",passport.authenticate("google",{
//   successRedirect:"http://localhost:5173/home",
//   failureRedirect:"http://localhost:5173"
// }))



// Enable CORS for all routes
app.use(cors());

const port = process.env.PORT || 5000;

// Route middlewares
app.use("/api/contacts", contactsRoutes);
app.use("/api/users", userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRouter);
app.use('/api/like', likeRouter);
app.use('/api/posts', forumPost);
app.use('/api/notification', notification);
app.use('/api/communities', communities);
app.use('/api/refresh-token', refreshToken);
app.use('/api/resource', validatePermission); 
app.use(errorHandler);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
