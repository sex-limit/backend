import { createClassValidator } from '@/utils/create'
import { NotFoundException } from '@nestjs/common'
import {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { PrismaService } from 'nestjs-prisma'

export class IsPlanExistImpl implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, args: ValidationArguments) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: value,
      },
    })

    if (!plan) {
      throw new NotFoundException('计划不存在')
    }

    return !!plan
  }
}

export const IsPlanExist = createClassValidator(IsPlanExistImpl)
