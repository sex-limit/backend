import { Controller, Get, Inject, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'
import { ProfileDto } from './dtos/profile.dto'

@Controller('user')
export class UserController {
  @Inject()
  private readonly service: UserService

  @Get('/profile')
  profile(@User() user: IUser) {
    return this.service.profile(user)
  }

  @Get('/other/profile')
  otherProfile(@Query() query: ProfileDto, @User() user: IUser) {
    return this.service.otherProfile(query, user)
  }
}
