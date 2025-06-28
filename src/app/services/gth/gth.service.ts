import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GTHService {

  constructor( private router: Router ) { }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
