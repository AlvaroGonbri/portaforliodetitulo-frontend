import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto, Categoria } from 'src/app/models/user.interface';


@Component({
  selector: 'app-editar-producto-modal',
  templateUrl: './editar-producto-modal.component.html',
  styleUrls: ['./editar-producto-modal.component.scss'],
  standalone: false
  
})
export class EditarProductoModalComponent  implements OnInit {
  @Input() producto!: Producto;
  @Input() categorias!: Categoria[]

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  guardarCambios() {
    // Aquí puedes validar los datos antes de cerrar el modal
    this.modalController.dismiss(this.producto);
  }

}
