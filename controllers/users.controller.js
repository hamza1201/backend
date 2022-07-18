const HttpError = require("../models/http-error");
const User = require("../models/user");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed,please try again later",
      500
    );
    return next(error);
  }
  res.json({ users });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser = await User.findOne({ email: email });
  if (existingUser) {
    const error = new HttpError(
      "User exists already , please login instead",
      422
    );
    return next(error);
  }
  let hashedPassword;
  hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = new User({
    email,
    password: hashedPassword,
  });

  let token = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    "supersecret_dont_share",
    {
      expiresIn: "1h",
    }
  );

  const userDoc = await createdUser.save();
  res.status(201).json({
    message: "user added successfuly",
    userId: userDoc.id,
    email: userDoc.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signin in failed , please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "invalid credentials,could not log you in ",
      401
    );
    console.log(error);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in , please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials , could not log you in.",
      500
    );
    return next(error);
  }

  let token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    "supersecret_dont_share",
    {
      expiresIn: "1h",
    }
  );
  res.json({
    message: "Logged in!",
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

module.exports = {
  getUsers,
  signup,
  login,
};
