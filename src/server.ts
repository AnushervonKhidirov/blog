import express from 'express';
import cors from 'cors';

import { AuthMiddleware } from './middleware/auth.middleware';
import { UserRouter } from './user/user.router';
import { AuthRouter } from './auth/auth.router';

const app = express();

app.use(express.json());
app.use(cors());
app.use(AuthMiddleware());

app.use('/users', UserRouter);
app.use('/auth', AuthRouter);

app.listen(4000);
