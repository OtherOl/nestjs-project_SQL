import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSettings(app);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // app.enableCors();
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     stopAtFirstError: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       const customErrors: any = [];
  //
  //       errors.forEach((e) => {
  //         const constraintsKeys = Object.keys(e.constraints!);
  //         constraintsKeys.forEach((key) => {
  //           customErrors.push({
  //             message: e.constraints![key],
  //             field: e.property,
  //           });
  //         });
  //       });
  //
  //       throw new BadRequestException(customErrors);
  //     },
  //   }),
  // );
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
