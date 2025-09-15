import {
  ConsoleLogger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
// Removed invalid fetch block using undefined 'token' and 'url'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access_token_secret',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      console.log('JWT payload:', payload.role);
      return {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
