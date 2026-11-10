import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueService, Lote } from '../estoque.service';

@Component({ imports: [FormsModule], selector: 'app-lotes', styleUrl: './lotes.css', templateUrl: './lotes.html' })
export class Lotes {
  pesquisa = '';
  filtro = 'Todos';
  lotes: Lote[] = [];
  constructor(public readonly estoque: EstoqueService) { this.lotes = estoque.lotes; }
  get lotesFiltrados(): Lote[] {
    const termo = this.pesquisa.trim().toLocaleLowerCase();
    return this.lotes.filter((l) => {
      const nome = this.estoque.getProduto(l.produtoId)?.nome ?? '';
      const corresponde = !termo || l.numero.toLocaleLowerCase().includes(termo) || l.codigoRastreio.toLocaleLowerCase().includes(termo) || nome.toLocaleLowerCase().includes(termo);
      const status = this.estoque.getStatusValidade(l.validade);
      return corresponde && (this.filtro === 'Todos' || status === this.filtro);
    });
  }
  produto(id: string): string { return this.estoque.getProduto(id)?.nome ?? 'Produto removido'; }
  status(lote: Lote): string { return this.estoque.getStatusValidade(lote.validade); }
}
