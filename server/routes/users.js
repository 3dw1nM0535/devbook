// User login route handler
import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { sendResetPasswordEmail } from "../mailer/authMailer";
import privateKeys from "../../config/private_keys";

const router = express.Router();


router.post("/", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then((user) => {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials" } });
    }
  });
});

// Forgot password route handler
router.post("/forgot-password", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({});
    } else {
      res.status(400).json({ errors: { global: "No user with such an Email" } });
    }
  });
});

// Validate token route handler
router.post("/validate-token", (req, res) => {
  jwt.verify(req.body.token, privateKeys.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

// Reset password route handler
router.post("/reset-password", (req, res) => {
  const { newPassword, token } = req.body.data;
  jwt.verify(token, privateKeys.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { global: "Invalid token" } });
    } else {
      User.findOne({ _id: decoded._id }).then((user) => {
        if (user) {
          user.setPassword(newPassword);
          user.save().then(() => res.json({}));
        } else {
          res.status(404).json({ errors: { global: "Invalid token" } });
        }
      });
    }
  });
});

export default router;
