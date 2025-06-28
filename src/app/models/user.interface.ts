export interface groups {
  id: number;
  name: string;
}

export interface userProfile {
  cargo?: string;
}

export interface users {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  groups: { id: number; name: string }[]; // ✅ Añade 'groups'
  nombre_completo?: string; // ✅ Hazla opcional
}

export interface Categoria {
  id_categoria: number;
  nom_categoria: string;
}

export interface TipoProducto {
  id: number;
  nombre: string;
}

export interface Producto {
  tipo: { id: number; nombre: string; };
  id: number;
  categoria: Categoria;
  cod_material: number;
  nom_producto: string;
  cant_existencia: number;
  descripcion: string;
  stock_minimo: number;
  stock_maximo: number;
  tipo_nombre: string;
  alerta?: string;
}



export interface AuditoriaItem {
  id: number;
  producto_id: number;
  codigo_material: string;
  nombre_producto: string;
  accion: string;
  descripcion: string;
  cantidad_anterior: number | null;
  cantidad_nueva: number | null;
  datos_anteriores: any;
  datos_nuevos: any;
  usuario: {
    id: number;
    username: string;
    email: string;
  };
  ip_address: string;
  fecha_accion: string;
  categoria: string;
  tipo_producto: string;
  observaciones: string;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
}

export interface Tecnico {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  groups: { id: number; name: string }[];
  profile?: {
    cargo?: string;
  };
}







export interface AuditoriaProducto {
  id: number;
  producto_id: number;
  codigo_material: string;
  nombre_producto: string;
  accion: string;
  accion_display: string;
  descripcion: string;
  cantidad_anterior?: number;
  cantidad_nueva?: number;
  diferencia_stock?: number;
  usuario: users;
  usuario_nombre: string;
  fecha_accion: string;
  tiempo_transcurrido: string;
  observaciones?: string;
  categoria?: string;
  tipo_producto?: string;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
  data?: T;
}



// Filtros para auditoría
export interface FiltrosAuditoria {
  accion?: string;
  producto_id?: number;
  usuario?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  categoria?: string;
  tipo_producto?: string;
  search?: string;
}

export interface FormularioAsignacion {
  ProductoID: number;
  TecnicoID: number;
  TipoMaterial: 'insumo' | 'herramienta';
  CantidadAsignada: number;
  FechaDevolucionEsperada?: string;
  MotivoAsignacion: string;
  ProyectoTrabajo: string;
  UbicacionTrabajo?: string;
  Observaciones?: string;
}

export interface ProductoAsignacion {
  id: number;
  cod_material: number;
  nom_producto: string;
  cant_existencia: number;  // Tu campo de stock
  descripcion: string;
  categoria: Categoria;
  tipo: TipoProducto;
  stock_minimo: number;
  stock_maximo: number;
  tipo_nombre: string;
}

export interface TecnicoAsignacion {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  nombre_completo: string;
}

export interface RespuestaAsignacion {
  AsignacionID: number;
  mensaje?: string;
  success: boolean;
}

export interface FiltrosAsignacion {
  estado?: string;
  tipo_material?: string;
  tecnico?: number;
  vencidas?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
}

export interface Devolucion {
  cantidad_devuelta: number;
  motivo_devolucion?: string;
  condicion_devolucion?: string;
}

export interface Asignacion {
  // Campos requeridos para crear una asignación
  ProductoID: number;
  TecnicoID: number;
  TipoMaterial: string;
  CantidadAsignada: number;
  MotivoAsignacion: string;
  ProyectoTrabajo: string;
  
  // Campos opcionales
  FechaDevolucionEsperada?: string;
  UbicacionTrabajo?: string;
  Observaciones?: string;
  
  // Campos generados por el backend (no necesarios al crear)
  AsignacionID?: number;
  producto_data?: any;
  tecnico_data?: any;
  Estado?: string;
}

export interface CrearAsignacion {
  ProductoID: number;
  TecnicoID: number;
  TipoMaterial: 'insumo' | 'herramienta';
  CantidadAsignada: number;
  FechaDevolucionEsperada?: string;
  MotivoAsignacion: string;
  ProyectoTrabajo?: string;
  UbicacionTrabajo?: string;
  Observaciones?: string;
}

// En tu archivo user.interface.ts
export interface Multa {
  MultaID: number;
  AsignacionID: {
    AsignacionID: number;
    TecnicoID: number;          // ID del técnico (número)
    tecnico_data: {             // Objeto con datos del técnico
      nombre_completo: string;
      // ... otros campos
    };
    ProductoID: number;         // ID del producto (número)
    producto_data: {            // Objeto con datos del producto
      nombre: string;
      // ... otros campos
    };
    // ... otros campos de AsignacionID
  };
  DiasRetraso: number;
  MontoPorDia: string;
  MontoTotal: string;
  FechaGeneracion: string;
  EstadoPago: string;
  FechaPago: string;
}

