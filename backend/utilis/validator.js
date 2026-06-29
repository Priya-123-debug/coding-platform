const validator = require("validator");

const validate = (data) => {
  const mandatoryfield = ["firstname", "emailid", "password"];
  const isallowed = mandatoryfield.every((k) => Object.keys(data).includes(k));
  if (!isallowed) throw new Error("some field is missing");
  if (!validator.isEmail(data.emailid)) throw new Error("invalid emailid");
  // if(!validator.isStrongPassword(data.password))
  // throw new Error("password is not strong");
};
module.exports = validate;
