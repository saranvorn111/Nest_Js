import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

// -> unique identifier for stroing and retriving role requirments as metadata on route handler
export const ROLES_KEY = 'roles';

//-> custom decorator to set roles metadata on route handlers
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
