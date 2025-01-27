import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { AdminSystemSideNavComponent } from '../../components/side-navbar/side-navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [AdminSystemSideNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {


}
