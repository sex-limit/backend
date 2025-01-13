import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      usernameField: 'uid',
      passwordField: 'password',
    })
  }
  
  // 验证是否是第一次登录
  async validate(uid: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: uid },
    })
  
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
  
    return true
  }
}
