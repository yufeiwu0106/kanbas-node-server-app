import express from 'express';
import Lab5 from "./Lab5/index.js";
import Hello from './Hello.js';
const app = express()

Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
