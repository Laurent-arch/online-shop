const User = require("../models/user.model");

const authUtil = require("../utils/authentication");
const validation = require("../utils/validation");
const flashedSession = require("../utils/session-flash");

const getSignup = (req, res) => {
  let sessionData = flashedSession.getSessionsData(req);

  if(!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      postal: '',
      city: ''
    }
  }

  res.render("customer/auth/signup", {inputData: sessionData});
};

const signup = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    flashedSession.flashDataSession(
      req,
      {
        errorMessage:
          "Please check your inputs. Password must be at least 6 characters long",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.existAlready();

    if (existAlready) {
      flashedSession.flashDataSession(
        req,
        { errorMessage: "User exists already, try logging instead" },
        ...enteredData,
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
};

const getLogin = (req, res) => {
  let sessionData = flashedSession.getSessionsData(req);

  if(!sessionData) {
    sessionData = {
      email: '',
      password: '',
    }
  }
  res.render("customer/auth/login", {inputData: sessionData});
};

const login = async (req, res, next) => {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials, please check again",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    flashedSession.flashDataSession(
      req,
      sessionErrorData,

      () => {
        res.redirect("/login");
      }
    );
    return;
  }

  const passwordIsCorrect = await user.comparePassword(existingUser.password);

  if (!passwordIsCorrect) {
    flashedSession.flashDataSession(
      req,
      sessionErrorData,

      () => {
        res.redirect("/login");
      }
    );
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
};

const logout = (req, res) => {
  authUtil.destroyUserSession(req);
  res.redirect("/login");
};

module.exports = {
  getSignup,
  getLogin,
  signup,
  login,
  logout,
};
