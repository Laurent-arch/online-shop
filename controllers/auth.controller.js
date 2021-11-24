const User = require("../models/user.model");

const authUtil = require("../utils/authentication");
const validation = require("../utils/validation");
const sessionFlash = require("../utils/session-flash");

const getSignup = (req, res) => {
  let sessionData = sessionFlash.getSessionsData(req);

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

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password must be at least 6 character slong, postal code must be 5 characters long.",
        ...enteredData,
      },
      function () {
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
    const existsAlready = await user.existAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredData,
        },
        function () {
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
}

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getSessionsData(req);

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
    sessionFlash.flashDataToSession(
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
    sessionFlash.flashDataToSession(
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
