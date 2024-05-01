import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class S3FileUploadPipe implements PipeTransform {
  s3: S3;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async transform(file: any) {
    const params: PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: 'application/octet-stream',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();

      file.s3Url = s3Response.Location;

      return file;
    } catch (error) {
      throw new BadRequestException('Upload to S3 failed');
    }
  }
}
