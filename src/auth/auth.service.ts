import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // constructor(
  //   private usersService: UsersService,
  //   private jwtService: JwtService,
  // ) {}

  // async signIn(username: string, pass: string) {
  //   const user = await this.usersService.findOne(username);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user.userId, username: user.username };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
    bcrypt.hash('admin1111', 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        console.log('Hashed password:', hash);
      }
    });
  }

  //user
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists. Please register with a different email.',
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreateUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    console.log('User registered:', newlyCreateUser);
    const saveUser = await this.userRepository.save(newlyCreateUser);
    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Registration successful! Please login to continue.',
    };
  }

  //admin
  async createAdmin(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists. Please register with a different email.',
      );
    }

    const hashedPassword = await this.hashPassword(registerDto.password);

    const newlyCreateUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const saveUser = await this.userRepository.save(newlyCreateUser);
    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Admin registration successful! Please login to continue.',
    };
  }

  //login
  //login
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    //generate token
    const tokens = await this.generateTokens(user);
    const { password, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }

  //refresh token
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'refresh_token_secret',
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const access_token = this.generateAccessTokens(user);
      return { access_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //find current user by Id

  async validateUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async generateTokens(user: UserEntity) {
    const accessToken = this.generateAccessTokens(user);
    const refreshToken = this.generateRefreshToken(user);
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessTokens(user: UserEntity): string {
    //->email, sub (id), role -> vvvI -> RBAC -> user ? admin?
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: 'access_token_secret',
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: UserEntity): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: 'refresh_token_secret',
      expiresIn: '7d',
    });
  }
}
