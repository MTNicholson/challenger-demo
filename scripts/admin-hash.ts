import bcrypt from "bcryptjs";

const password = process.argv.slice(2).join(" ").trim();

if (!password) {
  console.error('Usage: npm run admin:hash -- "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log(hash);