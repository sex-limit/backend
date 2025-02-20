import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { AppConfig } from '@/app.config'
import { PrismaService } from 'nestjs-prisma'
import { AppleLoginDto, LoginDto } from './dto/auth.dto'
import { AuthType } from '@/common/enums/Auth.enum'
import { AppleIdTokenType, verifyIdToken } from 'apple-signin-auth'
import { getIpAddress } from '@/common/utils/ip'
import { createResponse } from '@/utils/create'
import { PlanColor, PlanOfficalType, User } from '@prisma/client'
import { Nullable } from '@/common/types/utils'
import { PlanService } from '@/modules/plan/plan.service'

@Injectable()
export class AuthService {
  @Inject()
  private readonly planService: PlanService

  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto, ip: string) {
    const { type, apple } = dto

    let user: Nullable<User> = null

    if (type === AuthType.Apple) {
      user = (await this.appleLogin(apple!, ip)) as unknown as User
    }

    if (!user) {
      throw new BadRequestException('登录失败')
    }

    return createResponse('登录成功', {
      token: this.signToken(user as User),
    })
  }

  async appleLogin(dto: AppleLoginDto, ip: string) {
    const { identityToken, realUserStatus } = dto ?? {}

    if (realUserStatus !== 1 || !identityToken) {
      throw new BadRequestException('苹果账号异常')
    }

    const appleUser = await verifyIdToken(identityToken, {
      audience: this.appConfig.app.clientId,
    })

    const user = await this.prisma.appleUser.findFirst({
      where: {
        id: appleUser.sub,
      },
    })

    if (!user) {
      return this.appleRegister(appleUser, ip)
    }

    return user
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
        plans: {
          create: {
            officalPlanType: PlanOfficalType.SexLimit,
            color: PlanColor.Green,
            title: '戒🦌',
            desc: '计划还没有介绍哦',
          },
        },
      },
    })

    return user
  }

  signToken(user: User) {
    return this.jwtService.sign({ id: user.id })
  }
}
