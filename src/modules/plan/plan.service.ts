import { Injectable } from '@nestjs/common'
import { CheckInDto } from './dto/check-in.dto'
import { PrismaService } from 'nestjs-prisma'
import { createResponse } from '@/utils/create'
import { IUser } from '@/app'
import { GetPlanDto } from './dto/plan.dto'
import { BadRequestException, ConflictException } from '@nestjs/common'

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(dto: CheckInDto, reqUser: IUser) {
    const { planId, status, quickPost, checkTimes = 0 } = dto

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // 检查今天是否已经打卡
    const existingCheck = await this.prisma.planDayChecked.findFirst({
      where: {
        planId,
        year,
        month,
        day,
      },
      include: {
        plan: {
          select: {
            everdayShouldCheckTimes: true,
          },
        },
      },
    })

    if (existingCheck) {
      const isOverCheckedTimes =
        checkTimes > existingCheck.plan.everdayShouldCheckTimes

      if (isOverCheckedTimes) {
        throw new ConflictException('今日已达到打卡上限')
      }

      await this.prisma.planDayChecked.update({
        where: {
          id: existingCheck.id,
        },
        data: {
          status,
          checkedTimes: checkTimes,
        },
      })
    } else {
      // 如果打卡不存在，创建新的打卡记录
      await this.prisma.planDayChecked.create({
        data: {
          year,
          month,
          day,
          status,
          date,
          checkedTimes: checkTimes,
          ...(quickPost
            ? {
                post: {
                  create: {
                    user: {
                      connect: {
                        id: reqUser.id,
                      },
                    },
                    content: quickPost.content,
                    imgs: quickPost.img ? [quickPost.img] : [],
                  },
                },
              }
            : {}),
          plan: {
            connect: {
              id: planId,
            },
          },
        },
      })
    }

    return createResponse('打卡成功')
  }

  async getPlan(dto: GetPlanDto, user: IUser) {
    const plans = await this.prisma.plan.findFirst()

    return createResponse('获取成功', plans)
  }
}
