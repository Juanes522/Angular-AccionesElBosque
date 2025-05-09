import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthServiceService
  ){}

  onLogout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
