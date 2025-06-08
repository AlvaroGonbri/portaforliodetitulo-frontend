import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Producto, Categoria, TipoProducto } from 'src/app/models/user.interface';

@Component({
  selector: 'app-crear-producto-modal',
  templateUrl: './crear-producto-modal.component.html',
  styleUrls: ['./crear-producto-modal.component.scss'],
  standalone: false
})
export class CrearProductoModalComponent implements OnInit {
  
  @Input() categorias!: Categoria[];
  @Input() tipos!: TipoProducto[];
  @Input() producto?: Producto; // <-- Ahora también acepta producto a editar (opcional)

  formSubmitted = false;

  // Producto local para el formulario
  productoForm: Producto = {
    id: 0,
    cod_material: 0,
    nom_producto: '',
    cant_existencia: 0,
    descripcion: '',
    stock_minimo: 0,
    stock_maximo: 0,
    categoria: { id_categoria: 0, nom_categoria: '' },
    tipo: { id: 0, nombre: '' },
    tipo_nombre: ''
  };

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.producto) {
      // Si es edición, clona el producto recibido
      this.productoForm = {
        ...this.producto,
        categoria: { ...this.producto.categoria },
        tipo: { ...this.producto.tipo }
      };
    } else {
      // Si es creación, selecciona la primera categoría y tipo si existen
      if (this.categorias && this.categorias.length > 0) {
        this.productoForm.categoria = { ...this.categorias[0] };
      }
      if (this.tipos && this.tipos.length > 0) {
        this.productoForm.tipo = { ...this.tipos[0] };
      }
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async guardarProducto() {
    this.formSubmitted = true;
    // Validación básica
    if (
      !this.productoForm.nom_producto ||
      !this.productoForm.cod_material ||
      !this.productoForm.cant_existencia ||
      !this.productoForm.stock_minimo ||
      !this.productoForm.stock_maximo ||
      !this.productoForm.categoria?.id_categoria ||
      !this.productoForm.tipo?.id
    ) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos obligatorios',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Prepara el objeto para el backend (solo IDs, no objetos anidados)
    const productoParaEnviar: any = {
      cod_material: this.productoForm.cod_material,
      nom_producto: this.productoForm.nom_producto,
      cant_existencia: this.productoForm.cant_existencia,
      descripcion: this.productoForm.descripcion,
      stock_minimo: this.productoForm.stock_minimo,
      stock_maximo: this.productoForm.stock_maximo,
      categoria_id: this.productoForm.categoria.id_categoria,
      tipo_id: this.productoForm.tipo.id
    };

    // Si es edición, incluye el ID
    if (this.productoForm.id) {
      productoParaEnviar.id = this.productoForm.id;
    }

    this.modalController.dismiss(productoParaEnviar);
  }


}
