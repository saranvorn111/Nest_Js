import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
// import { HttpExceptionFilter } from './auth/exception-filter/http-exception.filter';
import { ValidationPipe } from './validation/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/extities/post.entity';
import { UserEntity } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //make config module globally available
      // validationSchema: Joi.object({
      //   APP_NAME: Joi.string().default('MyApp'),

      // }),
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Saran@1111',
      database: 'posts',
      entities: [PostEntity, UserEntity],
      synchronize: true,
    }),
    CatsModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
