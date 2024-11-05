"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const users = [{ username: "admin", password: "admin12345" }];
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../src/views"));
const checkAuth = (req, res, next) => {
    console.log("Cookies in auth check:", req.cookies);
    if (req.cookies && req.cookies.username) {
        next();
    }
    else {
        res.redirect("/login");
    }
};
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", (req, res) => {
    console.log("Received data:", req.body);
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        res.cookie("username", user.username, { maxAge: 24 * 60 * 60 * 1000 });
        console.log("Cookie set:", req.cookies);
        res.redirect("/profile");
    }
    else {
        res.redirect("/login");
    }
});
app.get("/profile", checkAuth, (req, res) => {
    res.render("profile");
});
app.get("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/login");
});
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
