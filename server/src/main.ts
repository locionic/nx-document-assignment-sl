// import express from 'express';
// import cors from 'cors';
// import { createServer } from 'http';
// import routes from './app/routes';

// const app = express();
// const httpServer = createServer(app);

// app.use(cors());
// app.use(express.json());
// app.use('/api', routes);

// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () =>
//   console.log(`🚀 Server running at http://localhost:${PORT}`)
// );


import express, { Application } from 'express';
import cors from 'cors';
import routes from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

export default app;