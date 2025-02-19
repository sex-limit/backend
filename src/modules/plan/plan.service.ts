import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { CheckInDto } from './dto/check-in.dto'
import { PrismaService } from 'nestjs-prisma'
import { IUser } from '@/app'
import { createResponse } from '@/utils/create'

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(checkInDto: CheckInDto, reqUser: IUser) {
    const { planId, status } = checkInDto

    const plan = await this.prisma.plan.findUnique({
      where: {
        id: planId,
        userId: reqUser.id,
      },
    })

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // 检查今天是否已经打卡
    const existingCheck = await this.prisma.planDayChecked.findFirst({
      where: {
        planId: checkInDto.planId,
        year,
        month,
        day,
      },
    })

    // 如果打卡不存在，创建新的打卡记录
    if (!existingCheck) {
      await this.prisma.planDayChecked.create({
        data: {
          year,
          month,
          day,
          status,
          date,
          checkedTimes: 1,
          plan: {
            connect: {
              id: planId,
            },
          },
        },
      })
    } else {
      await this.prisma.planDayChecked.update({
        where: {
          id: existingCheck.id,
        },
        data: {
          status,
          checkedTimes: existingCheck.checkedTimes + 1,
        },
      })
    }

    return createResponse('打卡成功')
  }
}
