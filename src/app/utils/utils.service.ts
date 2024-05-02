import { HttpException, Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';

import mailOptions from '@config/nodemailer';

@Injectable()
export class UtilsService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailOptions);
    this.setEmailTemplate();
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  setEmailTemplate() {
    const viewPath = path.resolve(
      __dirname,
      '..',
      '..',
      'config',
      'views',
      'emails',
    );
    const options = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'default',
        layoutsDir: path.resolve(viewPath, 'layouts'),
        partialsDir: path.resolve(viewPath, 'partials'),
      },
      viewPath,
      extName: '.hbs',
    };
    this.transporter.use('compile', hbs(options));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendEmail({ to, subject, template, context }) {
    try {
      const options = {
        from: process.env.SMTP_FROM as string,
        to,
        subject,
        template,
        context,
      };
      await this.transporter.sendMail(options);
    } catch (err) {
      console.log('Erro ao enviar email: ', err);

      throw new HttpException('Erro ao enviar email', err.status ?? 500);
    }
  }

  public async uploadFileOnS3(file: any, folder: string) {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_BUCKET_REGION,
      });

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${file.originalname}`,
        Body: file.buffer,
      };

      const data = await s3.upload(params).promise();

      return data.Location;
    } catch (err) {
      console.log('Erro ao fazer upload de arquivo: ', err);

      throw { type: 'internal_server_error', message: 'Internal server error' };
    }
  }

  public async deleteFileOnS3(fileUrl: string) {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_BUCKET_REGION,
      });

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileUrl.split('/').pop(),
      };

      await s3.deleteObject(params).promise();
    } catch (err) {
      console.log('Erro ao deletar arquivo: ', err);

      throw { type: 'internal_server_error', message: 'Internal server error' };
    }
  }
}
