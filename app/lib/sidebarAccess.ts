import { hasPermission, hasRole } from "./permission";

export function canAccessMenu(user: any, item: any) {
  if (item.permissions) {
    return item.permissions.some((p: string) =>
      hasPermission(user, p)
    );
  }

  if (item.roles) {
    return item.roles.some((r: string) =>
      hasRole(user, r)
    );
  }

  return true; 
}
