import { createClassValidator } from '@/utils/create'
import { NotFoundException } from '@nestjs/common'
import { ValidatorConstraintInterface } from 'class-validator'
import { ValidationArguments } from 'class-validator'
import { PrismaService } from 'nestjs-prisma'

export class IsUserExistImpl implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: number, args: ValidationArguments) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: value,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return !!user
  }
}

export const IsUserExist = createClassValidator(IsUserExistImpl)
