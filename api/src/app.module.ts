import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule, GatewayModule],
  providers: [AuthModule],
})
export class AppModule {}
