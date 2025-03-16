import { Injectable } from '@nestjs/common';
import { IUser } from '@/app';
import { PrismaService } from 'nestjs-prisma';
import { createResponse } from '@/utils/create';


@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) { }

  async getUserOwnPlan(user: IUser) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        quickNotes: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return createResponse('获取成功', plan);
  }

  async pleged(user: IUser) {
    const plan = await this.prisma.plan.update({
      where: {
        userId: user.id,
      },
      data: {
        lastPlegedTime: new Date(),
      },
    });

    return createResponse('发誓成功', plan);
  }

  async createQuickNote(user: IUser, body: { content: string }) {
    const quickNote = await this.prisma.quickNote.create({
      data: {
        content: body.content,
        plan: {
          connect: {
            userId: user.id,
          },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    return createResponse('创建成功', quickNote);
  }
}
