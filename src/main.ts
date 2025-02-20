import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppConfig } from '@/app.config'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config: AppConfig = app.get<AppConfig>(AppConfig)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(new ValidationPipe(config.validations))

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sex Limit API')
    .setDescription('Sex Limit Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/swagger.json',
  })

  await app.listen(config.server.port)
}

bootstrap()
