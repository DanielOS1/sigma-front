// services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../interfaces/entities/user.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly roleRouteMap: Record<UserRole | 'DEFAULT', string> = {
    [UserRole.SYSTEM_ADMIN]: '/system-admin',
    [UserRole.AQUACULTURE_ADMIN]: '/center-admin',
    [UserRole.SCIENTIST]: '/my-devices',
    [UserRole.OWNER]: '/owner-dashboard',
    [UserRole.SUPER_ADMIN]: '/super-admin',
    'DEFAULT': '/dashboard'
  };

  constructor(private router: Router) {}

  navigateByRole(role: UserRole): Promise<boolean> {
    const route = this.roleRouteMap[role] || this.roleRouteMap['DEFAULT'];
    return this.router.navigate([route]);
  }

  getDefaultRouteForRole(role: UserRole): string {
    return this.roleRouteMap[role] || this.roleRouteMap['DEFAULT'];
  }
}