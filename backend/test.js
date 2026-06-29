const bcrypt = require("bcrypt");

const hash = "$2b$10$OQOqEuo6HNYTn1utvVmP6uN3uZQ5R0sFM96zCjjy3nqcbUs61KaHq";

bcrypt
  .compare("admin123", hash)
  .then((result) => {
    // console.log("Password match?", result);
  })
  .catch((err) => console.error(err));

(async () => {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  // console.log("New hash:", hash);
})();
