const isEmpty = (value) => {
  return !value || value.trim() !== "";
};

const userCredentialsValid = (email, password) => {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
};

const userDetailsValid = (email, password, name, street, postal, city) => {
  return (
    userCredentialsValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
};

const emailIsConfirmed = (email, confirmedEmail) => {
  return email === confirmedEmail;
};

module.exports = {
  userDetailsValid,
  emailIsConfirmed,
};
