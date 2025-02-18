import serverless from 'serverless-http';
import app from '../src/main';

export default serverless(app);