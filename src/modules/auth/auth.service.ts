import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { AppConfig } from '@/app.config'
import { PrismaService } from 'nestjs-prisma'
import { AppleLoginDto, LoginDto } from './dto/auth.dto'
import { AuthType } from '@/common/enums/Auth.enum'
import { AppleIdTokenType, verifyIdToken } from 'apple-signin-auth'
import { getIpAddress } from '@/common/utils/ip'
import { createResponse } from '@/utils/create'
import { AppleUser, User } from '@prisma/client'
import { Nullable } from '@/common/types/utils'

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
    private readonly prisma: PrismaService,
  ) { }

  async login(dto: LoginDto, ip: string) {
    const { type, apple } = dto

    let user: Nullable<User> = null

    if (type === AuthType.Apple) {
      user = (await this.appleLogin(apple!, ip)) as User
    }

    if (!user) {
      throw new BadRequestException('登录失败')
    }

    return createResponse('登录成功', {
      token: this.signToken({
        type,
        user,
      }),
    })
  }

  async appleLogin(dto: AppleLoginDto, ip: string) {
    const { identityToken, realUserStatus } = dto ?? {}

    if (realUserStatus !== 1 || !identityToken) {
      throw new BadRequestException('苹果账号异常')
    }

    const appleVerify = await verifyIdToken(identityToken, {
      audience: this.appConfig.app.clientId,
    })

    const appleUser = await this.prisma.appleUser.findFirst({
      where: {
        id: appleVerify.sub,
      },
      include: {
        user: true,
      },
    })

    if (!appleUser) {
      return this.appleRegister(appleVerify, ip)
    }

    return appleUser.user
  }

  async appleRegister(params: AppleIdTokenType, ip: string) {
    const ipAddress = await getIpAddress(ip)

    const user = await this.prisma.user.create({
      data: {
        username: 'Apple',
        avatar: `https://api.dicebear.com/9.x/dylan/svg?seed=${Math.random()}`,
        apple: {
          create: {
            id: params.sub,
          },
        },
        ipAddress: ipAddress.ip_location,
        plan: {
          create: {
            bestDays: 0,
            startTime: new Date(),
          }
        }
      },
    })

    return user
  }

  signToken(options: { type: AuthType; user: User }) {
    return this.jwtService.sign({ type: options.type, id: options.user.id })
  }
}
