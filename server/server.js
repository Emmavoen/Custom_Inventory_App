const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route.js");
const adminRoute = require('./routes/admin.route.js');
const userRoute = require('./routes/user.route.js');
const { morganMiddleware } = require('./middlewares/morgan');
const { setupSwagger } = require("./config/swagger");
const { config } = require("./config");

const PORT = config.PORT;

const server = express();

//Add middlewares
setupSwagger(server);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
server.use(morganMiddleware);


server.use('/api/v1/auth', authRoute);
server.use('/api/v1/admin', adminRoute);
server.use('/api/v1/user', userRoute);


server.listen(PORT, async () => {
    console.log(`Server running on Port ${PORT}...`);
});
