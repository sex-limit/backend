import {
  Injectable,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { AppConfig } from '@/app.config'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
    private readonly prisma: PrismaService,
  ) {}
}
