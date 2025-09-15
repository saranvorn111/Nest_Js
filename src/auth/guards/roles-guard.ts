import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  //The Reflector -> utility that will help to access metadata
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method level metadata
        context.getClass(), //class level metadata
      ],
    );
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    console.log('User Role:', user.role);

    const hasRequiredRole = requiredRole.some((role) => user.role === role);
    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }

    console.log('Access granted with role:', user.role);
    return true;
  }
}
