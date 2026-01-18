import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './front-navbar.html',
  styles: `
  .navbar{
    font-family: var(--font-montserrat);
  }
  `
})
export class FrontNavbar {
  authService = inject(AuthService);
 }
