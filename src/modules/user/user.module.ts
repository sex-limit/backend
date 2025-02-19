import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PrismaModule } from 'nestjs-prisma'
import { IsUserExistImpl } from './dtos/utils'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, IsUserExistImpl],
})
export class UserModule {}
