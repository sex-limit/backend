import { Controller, Get, Inject, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'
import { ProfileDto } from './dtos/profile.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('用户')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  @Inject()
  private readonly service: UserService

  @Get('/profile')
  @ApiOperation({
    summary: '获取个人资料',
    description: '获取当前登录用户的个人资料',
  })
  profile(@User() user: IUser) {
    return this.service.profile(user)
  }

  @Get('/other/profile')
  @ApiOperation({
    summary: '获取其他用户资料',
    description: '根据用户ID获取其他用户的公开资料',
  })
  otherProfile(@Query() query: ProfileDto, @User() user: IUser) {
    return this.service.otherProfile(query, user)
  }
}
