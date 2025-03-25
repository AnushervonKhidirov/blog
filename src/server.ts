import express from 'express';
import cors from 'cors';

import { UserRouter } from './user/user.router';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', UserRouter);

app.listen(4000);
