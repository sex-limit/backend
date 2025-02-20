import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AppConfig } from '@/app.config'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: AppConfig,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.token,
    })
  }

  async validate(payload: { id: number }) {
    const { id } = payload

    const user = await this.prisma.user.findFirst({
      where: { id },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return payload
  }
}
