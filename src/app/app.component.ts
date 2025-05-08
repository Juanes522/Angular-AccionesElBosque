import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verifica rutas protegidas al cambiar de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const protectedRoutes = ['/dashboard'];
        if (protectedRoutes.some(route => event.url.startsWith(route)) && 
            !this.authService.isAuthenticated()) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
