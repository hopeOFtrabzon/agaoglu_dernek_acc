import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfitsModule } from './profits/profits.module';
import { SummaryModule } from './summary/summary.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../backend/.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ExpensesModule,
    ProfitsModule,
    SummaryModule,
    ReportsModule,
  ],
})
export class AppModule {}
