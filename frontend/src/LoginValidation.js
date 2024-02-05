function Validation(values) {
  let error = {};
  const email_patter = /^\S+@\S+\.\S+$/;
  const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (values.email === "") {
    error.email = "name should not be empty";
  } else if (!email_patter.test(values.email)) {
    error.email = "email did not match";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password must be at least 8 characters and have both numbers and characters";
  } else {
    error.password = "";
  }

  return error;
}
export default Validation;
