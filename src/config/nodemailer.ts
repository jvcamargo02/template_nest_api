import 'dotenv/config';

export default {
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports.
  auth: {
    user: process.env.SMTP_USERNAME as string,
    pass: process.env.SMTP_PASSWORD as string,
  },
  default: {
    from: `[name] <${process.env.SMTP_FROM as string}>`,
  },
};
