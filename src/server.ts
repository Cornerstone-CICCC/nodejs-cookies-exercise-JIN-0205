import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

interface User {
  username: string;
  password: string;
}

const users: User[] = [{ username: "admin", password: "admin12345" }];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies in auth check:", req.cookies);
  if (req.cookies && req.cookies.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.post("/login", (req: Request, res: Response) => {
  console.log("Received data:", req.body);
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.headers["content-type"]);
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.cookie("username", user.username, { maxAge: 24 * 60 * 60 * 1000 });
    console.log("Cookie set:", req.cookies);
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

app.get("/profile", checkAuth, (req: Request, res: Response) => {
  res.render("profile");
});

app.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
