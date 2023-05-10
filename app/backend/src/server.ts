import { App } from './app';

const PORT = process.env.APP_PORT || 3002;

new App().start(PORT);
