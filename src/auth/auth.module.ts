import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // UsersModule,
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '60s' },
    // }),

    TypeOrmModule.forFeature([UserEntity]),
    //passport Module
    PassportModule,

    //configer jwt
    JwtModule.register({}),
  ],

  controllers: [AuthController],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
