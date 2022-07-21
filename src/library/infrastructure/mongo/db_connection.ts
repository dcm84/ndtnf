import mongoose from "mongoose";

const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'root';
const NameDB = process.env.DB_NAME || 'library'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'

mongoose.connect(HostDb!, {
    user: UserDB,
    pass: PasswordDB,
    dbName: NameDB
});

mongoose.connection.on("open", () => {
  console.log("Установлено подключение к Mongo");
});