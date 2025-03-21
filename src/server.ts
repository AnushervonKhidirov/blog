import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { AuthRouter } from './auth/auth.router.js';
import { UserRouter } from './user/user.router.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', new AuthRouter().router);
app.use('/users', new UserRouter().router);

app.listen(4000);
