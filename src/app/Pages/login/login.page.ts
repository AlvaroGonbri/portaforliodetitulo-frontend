import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['error']) {
      this.errorMessage = params['error'];
      // Limpia el parámetro de la URL después de mostrarlo
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });
    }
  });
}

  async login(form: NgForm) {
    const { username, password } = form.value;

    // Mostrar spinner de carga
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

this.authService.login(username, password).subscribe({
      next: () => {
        this.authService.getUserProfile().subscribe({
          next: (user) => {
            // user.groups es un array de objetos: [{ id: 2, name: "Admin" }]
            const groupName = user.groups[0]?.name || ''; // Solo el primer grupo, por ejemplo
            // Si quieres todos los nombres:
            // const groupNames = user.groups.map(g => g.name);
            localStorage.setItem('roles', JSON.stringify(groupName)); // Guarda solo el nombre
            loading.dismiss();
            this.router.navigate(['/home']);
          },
          error: (err) => {
            loading.dismiss();
            this.showError('No se pudo obtener el perfil del usuario. Intenta nuevamente.');
          }
        });
      },
      error: (err) => {
        loading.dismiss();
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }

  // Mostrar alerta de error (opcional, pero recomendado)
  private async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
