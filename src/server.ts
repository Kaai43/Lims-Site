import { buildApp } from './app.js';
import { carregarConfig } from './config.js';

async function iniciar(): Promise<void> {
  const config = carregarConfig();
  const app = await buildApp({ config });
  try {
    await app.listen({ host: config.HOST, port: config.PORT });
  } catch (erro) {
    app.log.fatal(erro, 'Falha ao iniciar o servidor');
    process.exit(1);
  }
}

iniciar();
