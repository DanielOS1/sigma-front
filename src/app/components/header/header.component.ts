import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  
  logout(): void {
    this.authService.logout();
    this.toastr.success('Sesión cerrada con éxito', 'Éxito');
    this.router.navigate(['/auth']);
  }

}
