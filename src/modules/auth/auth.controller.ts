import { Controller, Inject, Post, UseGuards, Body } from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'
import { Public } from '@/common/decorator/public.decorator'
import { LocalAuthGuard } from './guards/lcoal-auth.guard'
import { LoginDto } from './dto/auth.dto'
import { RealIP } from 'nestjs-real-ip'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('认证')
@Public()
@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Post('/login')
  @ApiOperation({
    summary: '用户登录',
    description: '使用 Apple ID 登录系统',
  })
  login(@Body() dto: LoginDto, @RealIP() ip: string) {
    return this.authService.login(dto, ip)
  }
}
