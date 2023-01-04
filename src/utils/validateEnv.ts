import { cleanEnv, port, str } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    PORT: port({ default: 5000 }),
    JWT_SECRET: str(),
  });
}

export default validateEnv;
