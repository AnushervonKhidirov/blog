import express from 'express';
import cors from 'cors';

import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthRouter } from './auth/auth.router';
import { UserRouter } from './user/user.router';
import { PostRouter } from './post/post.router';

const app = express();

app.use(express.json());
app.use(cors());
app.use(AuthMiddleware());

app.use('/auth', AuthRouter);
app.use('/users', UserRouter);
app.use('/posts', PostRouter);

app.listen(4000);
