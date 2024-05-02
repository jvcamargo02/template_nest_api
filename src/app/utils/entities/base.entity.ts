import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'Identificador do registro',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'Data de criação do registro',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'Data de atualização do registro',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'Data de exclusão do registro',
  })
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
