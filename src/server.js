import './env';
import app from './app';

app.listen(process.env.APP_PORT || 3003, () => {
  console.log(`Listening on port: ${process.env.APP_PORT}`);
  console.log(`HTTP File Server- Base URL: ${process.env.APP_URL}`);
});
