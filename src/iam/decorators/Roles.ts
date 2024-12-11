import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/roles.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...role: Role[]) => {
  return SetMetadata(ROLES_KEY, role);
};
