// Server configurations
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import Socket from "socket.io";

// Webpack assets configurations/Middleware
import webpack from "webpack";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "../webpack.config";

// Routes
import auth from "./routes/User/auth";
import users from "./routes/User/users";


// Module import
import privateKeys from "../config/private_keys";
import { onConnect } from "./utils/socket";

config.plugins.push(new webpack.HotModuleReplacementPlugin());

// Connect to database
mongoose.connect(privateKeys.MONGO_URI);

// Certificate options
const certOptions = {
  pfx: fs.readFileSync(path.resolve("config/localhost.pfx")),
  passphrase: "#03167@TuK2019",
};


// Init express module
const app = express();

// Serve static files
app.use(express.static(path.resolve(__dirname, "public")));

// Config port
const port = privateKeys.PORT;

// Wrap webpack configurations to webpack
const compiler = webpack(config);

// Webpack hot reloading Middleware
app.use(webpackHotMiddleware(compiler));

// Webpack bundler Middleware
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  hot: true,
  compress: true,
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  host: "localhost",
}));

// Parse application-json data
app.use(bodyParser.json());

// Route mounting
app.use("/api/auth", users);
app.use("/api/auth/users", auth);

// Any route handler Middleware
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// Init server
const server = https.createServer(certOptions, app);

// IO Init
const io = Socket(server);

// Listen for socket connetion
io.on("connection", onConnect);

// Start server on defined port
server.listen(port);
