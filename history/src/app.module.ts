import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { getEnv, isLocal } from './shared/env';
import { MakerTransactionModule } from './maker-transaction/maker-transaction.module';
import * as dotenv from 'dotenv'
import * as path from 'path'

isLocal() && dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const DBConfig:any = {
  type: 'mysql',
  host: getEnv('DB_HOST'),
  port: getEnv('DB_PORT'),
  username: getEnv('DB_USER'),
  password: getEnv('DB_PASS'),
  database: getEnv('DB_NAME'),
  entities: [
    './**/**.entity{.ts,.js}',
  ],
  // synchronize: isLocal()
}
@Module({
  imports: [
    TypeOrmModule.forRoot(DBConfig),
    TransactionModule,
    MakerTransactionModule
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
