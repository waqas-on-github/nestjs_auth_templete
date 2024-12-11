import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/roles.enums';
import { ROLES_KEY } from '../decorators/Roles';
import { IS_PUBLIC_KEY } from '../decorators/isPublic';
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly defaultRole: Role = Role.User;
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    // Check if the request is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //if route us public then return true
    if (isPublic) {
      return true;
    }
    // Get the user roles from the context
    const userRolesOnContext = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    ) || [this.defaultRole]; //eg ['user','admin'] --> if no roles provided then return default role
    //get request from context
    const request = context.switchToHttp().getRequest();
    //get user from request
    const user = request.user;
    //check if user has any of roles provided in roles decorator
    return userRolesOnContext.some((role) => user.roles?.includes(role));
  }
}
