const express = require("express");
const app = express();
const cors = require("cors");

const http = require('http');
const socketIo = require('socket.io');
const setupSockets = require('./sockets/socket');

require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 9000;
const session = require("express-session");
const passport = require("passport");
const prisma = require('./config/prismaClient')

const authRoutes = require("./routes/auth/auth.routes");
const adminCourseRoutes = require("./routes/admin/adminRoutes");
const userRoutes = require("./routes/user/userRoutes"); 
const catalogRoutes = require("./routes/catalog/catalogRoutes");
const fileUpload = require("express-fileupload");
const chatbotRoutes = require("./routes/chatbot/chatbotRoutes");
const adminAssignmentRoutes = require('./routes/Assignment/adminAssignmentRoutes');
const userAssignmentRoutes = require('./routes/Assignment/userAssignmentRoutes');
const adminEssayRoutes = require('./routes/essay/adminEssayRoutes');
const userEssayRoutes = require('./routes/essay/userEssayRoutes');
const debateRoutes = require("./routes/debate/debateRoutes");

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:8080",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
})

app.use(express.json());


app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
setupSockets(io);

require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("Hello There!!!");
});

app.use("/api/auth", authRoutes);
app.use("/api/course", adminCourseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/debate",debateRoutes);

//assignment routes
app.use('/api/course/:courseid/modules/:moduleid/assessment/assignment' , adminAssignmentRoutes);
app.use('/api/user/course/:courseid/modules/:moduleid/assessment/assignment', userAssignmentRoutes);

//essay routes
app.use('/api/course/:courseid/modules/:moduleid/assessment/essay', adminEssayRoutes );
app.use('/api/user/course/:courseid/modules/:moduleid/assessment/essay', userEssayRoutes);

app.use("/api/chatbot",  chatbotRoutes);

// app.use("/api/private-messaging" , socketRouter); //all the Private messages routes are in the socketRouter file 


(async function initialize() {
  try {
    await prisma.$connect();
    console.log(`Database connected!!`);

    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });

server.listen(PORT, () => {
  console.log('server running at http://localhost:9000');
});

  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
})();
