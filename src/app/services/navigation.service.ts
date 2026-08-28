// services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../interfaces/entities/user.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // OWNER y SUPER_ADMIN todavía no tienen un dashboard dedicado; usan el genérico.
  private readonly roleRouteMap: Record<UserRole | 'DEFAULT', string> = {
    [UserRole.SYSTEM_ADMIN]: '/system-admin',
    [UserRole.AQUACULTURE_ADMIN]: '/center-admin',
    [UserRole.SCIENTIST]: '/my-devices',
    [UserRole.OWNER]: '/dashboard',
    [UserRole.SUPER_ADMIN]: '/dashboard',
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