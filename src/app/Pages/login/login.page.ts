import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  errorMessage: string = ''; // <-- Propiedad para mensajes de error

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  login(form: NgForm) { // <-- Método que procesa el login
    const { username, password } = form.value;
    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
