export interface groups {
  id: number;
  name: string;
}

export interface userProfile {
  cargo?: string;
}

export interface users {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  groups: { id: number; name: string }[];
  profile: userProfile | null;
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
}
