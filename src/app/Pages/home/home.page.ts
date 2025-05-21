import { Component, OnInit } from '@angular/core';
import { APIService, users } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  items:any = [];


  constructor(private servicioAPI: APIService) {}

  ngOnInit(){
    const usuarios = localStorage.getItem('usuarios')
    if(usuarios){
      this.items = JSON.parse(usuarios)
      console.log('LocalStorage')


    }else{
      this.servicioAPI.getusers().subscribe((usuarios) => {
        this.items = usuarios;
        localStorage.setItem('usuarios', JSON.stringify(this.items));
        console.log('API')  
      });
    }
  }

  trackById(index: number, item: users): number {
    return item.id;
  }

}
