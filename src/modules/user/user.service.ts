import { IUser } from '@/app'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ProfileDto } from './dtos/profile.dto'
import { PrismaService } from 'nestjs-prisma'
import { createResponse } from '@/utils/create'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(user: IUser) {
    console.log(user)
    const userProfile = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        desc: true,
        createdAt: true,
        ipAddress: true,
      },
    })

    if (!userProfile) {
      throw new NotFoundException('用户不存在')
    }

    return createResponse('获取成功', userProfile)
  }

  async otherProfile(query: ProfileDto, user: IUser) {
    const otherUser = await this.prisma.user.findUnique({
      where: {
        id: query.id,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        desc: true,
        createdAt: true,
        ipAddress: true,
      },
    })

    return createResponse('获取成功', {
      ...otherUser,
      isOwner: otherUser!.id === user.id,
    })
  }
}
