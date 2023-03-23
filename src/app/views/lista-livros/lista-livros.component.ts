import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnDestroy {

  listaLivros: [];
  campoBusca: string = '';
  subscrition: Subscription;

  constructor(
    private service: LivroService
  ) { }

  buscarLivros() {
    this.subscrition = this.service.buscar(this.campoBusca).subscribe({
      next: retorno => console.log(retorno),
      error: erro => console.error(erro),
      complete: () => console.log('Observable completado')      
    });
  }

  ngOnDestroy() {
    this.subscrition.unsubscribe();
  }
}



