import { ValidationPipeOptions } from '@nestjs/common'

export class AppConfig {
  validations!: ValidationPipeOptions

  jwt!: {
    token: string
    expired: string
  }

  server!: {
    port: number
  }

  throttle!: {
    ttl: number
    limit: number
  }
}
