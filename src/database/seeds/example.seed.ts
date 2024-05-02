/* eslint-disable @typescript-eslint/no-unused-vars */
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class HealthSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository('Text');

    if ((await repository.find())?.length > 0) return;

    await repository.save([
      {
        name: 'João Bicudo',
        url: 'https://www.google.com',
        text: 'Texto em markdown',
        number: 1,
        date: '2021-01-01',
      },
    ]);

    console.log('Texts seeded');
  }
}
