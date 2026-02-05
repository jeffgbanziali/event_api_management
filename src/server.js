const app = require('./app');
const env = require('./config/env');
const { connectToDatabase } = require('./config/db');

// Connexion à la base puis démarrage du serveur HTTP
async function bootstrap() {
  await connectToDatabase();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`My Social Networks API listening on port ${env.port}`);
  });
}

bootstrap();

