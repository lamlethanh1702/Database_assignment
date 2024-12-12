import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import mainRoute from "./server/routes/main.js";

const app = express();
const port = 4000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// function checkPassword(req, res, next) {
//     password = req.body["password"];
//     if (password == correctPassword) {
//         userIsAuthorised = true;
//     }
//     next();
// }

// app.use(checkPassword)

// app.get('/', (req, res) => {
//     res.render('login.ejs');
// })

// app.post('/check', (req, res) => {
//     if (userIsAuthorised) {
//         res.render('index.ejs');
//     }
//     else {
//         res.redirect('/');
//     }
// })

app.use("/", mainRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});