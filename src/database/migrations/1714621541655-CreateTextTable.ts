import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTextTable1714621541655 implements MigrationInterface {
  name = 'CreateTextTable1714621541655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`texts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`url\` text NULL, \`text\` text NOT NULL, \`number\` varchar(20) NULL, \`date\` date NULL, \`value\` decimal(10,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`texts\``);
  }
}
