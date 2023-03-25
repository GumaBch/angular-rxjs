import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(
    private service: LivroService
  ) { }

  totaoDeLivros$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter(valorDigitado => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro);
      return of();
    })
  );

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter(valorDigitado => valorDigitado.length >= 3),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap(retorno => console.log(retorno)),
      map(resultado => resultado.items ?? []),
      map(items => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        // this.mensagemErro = 'Ops, ocorreu um erro!';
        // return EMPTY;
        console.log(erro);
        return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro!'))

      })
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    })
  }
}