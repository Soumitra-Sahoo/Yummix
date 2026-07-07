import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import readline from "readline";
import userModel from "../models/userModel.js";

const prompt = (question, hidden = false) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (!hidden) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }
    const stdin = process.openStdin();
    process.stdin.on("data", () => {});
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
    rl._writeToOutput = () => {};
  });
};

const run = async () => {
  const args = process.argv.slice(2);
  const nameArgIdx = args.indexOf("--name");
  const emailArgIdx = args.indexOf("--email");
  const passwordArgIdx = args.indexOf("--password");

  const name = nameArgIdx !== -1 ? args[nameArgIdx + 1] : await prompt("Name: ");
  const email = emailArgIdx !== -1 ? args[emailArgIdx + 1] : await prompt("Email: ");
  const password = passwordArgIdx !== -1 ? args[passwordArgIdx + 1] : await prompt("Password: ");

  if (!name || !email || !password) {
    console.error("Name, email and password are all required.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await userModel.findOne({ email });
  if (existing) {
    if (existing.isAdmin) {
      console.log(`"${email}" is already an admin. No changes made.`);
    } else {
      existing.isAdmin = true;
      await existing.save();
      console.log(`Existing user "${email}" has been promoted to admin.`);
    }
    await mongoose.disconnect();
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await userModel.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });

  console.log(`Admin account created for "${email}".`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});