const valid = ({
  firstname,
  lastname,
  username_email_or_mobile_register,
  new_password,
}) => {
  const err = {};

  if (!firstname) {
    err.firstname = 'Incluya su nombre';
  } else if (firstname.length > 30) {
    err.firstname = 'Su nombre no debe ser mayor a 30 carácteres';
  }

  if (!lastname) {
    err.lastname = 'Incluya su apellido';
  } else if (lastname.length > 30) {
    err.lastname = 'Su apellido no debe ser mayor a 30 carácteres';
  }

  // if (!username) {
  //   err.username = 'Please add your user name.';
  // } else if (username.replace(/ /g, '').length > 25) {
  //   err.username = 'User name is up to 25 characters long.';
  // }

  // if (!email) {
  //   err.email = 'Please add your email.';
  // } else if (!validateEmail(email)) {
  //   err.email = 'Email format is incorrect.';
  // }

  if (!new_password) {
    err.new_password = 'Please add your password.';
  } else if (new_password.length < 6) {
    err.new_password = 'Password must be at least 6 characters.';
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

function validateEmail(email) {
  // eslint-disable-next-line
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default valid;
