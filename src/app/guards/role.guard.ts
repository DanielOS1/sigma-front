import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/users/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();

    // Validar si existe un token válido
    if (!token) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const decodedToken = this.authService.getDecodedToken(); // Decodificar el token
    const userRole = decodedToken?.role;

    // Obtener los roles permitidos desde los datos de la ruta
    const requiredRoles = route.data['roles'] as UserRole[];

    // Validar si el usuario tiene un rol permitido
    if (requiredRoles && requiredRoles.includes(userRole)) {
      return true; // Acceso permitido
    }

    // Redirigir a una página de acceso denegado o dashboard por defecto
    this.router.navigate(['/auth']);
    return false;
  }
}
