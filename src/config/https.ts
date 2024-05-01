import * as fs from 'fs';
import { config as dotenv } from 'dotenv';

dotenv();

let options = {};
if (process.env.ENVIRONMENT === 'prod') {
  options = {
    key: fs.readFileSync(`${process.env.SSL_BASE_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_BASE_PATH}/cert.pem`),
    ca: fs.readFileSync(`${process.env.SSL_BASE_PATH}/chain.pem`),
  };
}

export default options;
