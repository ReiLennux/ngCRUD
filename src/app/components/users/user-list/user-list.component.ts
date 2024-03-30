import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  estadoFiltrado: string = '';
  tipoFiltrado: string = '';
  filtroNombre: string = '';
  usuariosPorPagina: number = 5; // Número de usuarios por página
  paginaActual: number = 1; // Página actual, empieza en 1

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.obtenerDatosUsuario().subscribe(
      (data: User[]) => {
        this.users = data;
        this.filterUsers(); // Llamamos a la función para filtrar los usuarios al cargar la lista
      },
      err => console.error(err)
    );
  }

  filterByEstado(estado: string) {
    this.estadoFiltrado = estado;
    this.filterUsers();
  }

  filterByTipo(tipo: string) {
    this.tipoFiltrado = tipo;
    this.filterUsers();
  }

  filterByName(nombre: string) {
    this.filtroNombre = nombre;
    this.filterUsers();
  }

  clearFilters() {
    this.estadoFiltrado = '';
    this.tipoFiltrado = '';
    this.filtroNombre = '';
    this.filterUsers();
  }

  filterUsers() {
    // Aplicamos los filtros sobre todos los usuarios
    let filteredUsers = this.users.filter(user =>
      (this.estadoFiltrado === '' || user.estado === this.estadoFiltrado) &&
      (this.tipoFiltrado === '' || user.tipo === this.tipoFiltrado) &&
      (this.filtroNombre === '' || user.usuarioNombre.toLowerCase().includes(this.filtroNombre.toLowerCase()))
    );

    // Calculamos los índices de inicio y fin para la paginación
    const indiceInicial = (this.paginaActual - 1) * this.usuariosPorPagina;
    const indiceFinal = indiceInicial + this.usuariosPorPagina;

    // Filtramos los usuarios según la paginación
    this.filteredUsers = filteredUsers.slice(indiceInicial, indiceFinal);
  }

  deleteButton(id: Number) {
    this.userService.eliminarUsuario(id).subscribe(
      res => console.log(res),
      err => console.error(err)
    );
    this.ngOnInit()
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.filterUsers();
  }

  get paginasTotales(): number[] {
    return Array(Math.ceil(this.filteredUsers.length / this.usuariosPorPagina)).fill(0).map((x, i) => i + 1);
  }
}
