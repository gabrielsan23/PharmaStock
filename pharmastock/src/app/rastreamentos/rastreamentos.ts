import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueService, Lote } from '../estoque.service';

@Component({ imports: [FormsModule], selector: 'app-rastreamentos', styleUrl: './rastreamentos.css', templateUrl: './rastreamentos.html' })
export class Rastreamentos {
  pesquisa = '';
  loteSelecionado?: Lote;
  constructor(public readonly estoque: EstoqueService) {}
  pesquisar(): void {
    const termo = this.pesquisa.trim().toLocaleLowerCase();
    this.loteSelecionado = this.estoque.lotes.find((l) => l.numero.toLocaleLowerCase() === termo || l.codigoRastreio.toLocaleLowerCase() === termo)
      ?? this.estoque.lotes.find((l) => (this.estoque.getProduto(l.produtoId)?.nome ?? '').toLocaleLowerCase().includes(termo));
  }
  produto(id: string): string { return this.estoque.getProduto(id)?.nome ?? 'Produto removido'; }
  dataHora(data: string): string { return new Date(data).toLocaleString('pt-PT'); }
  historico(loteId: string) { return this.estoque.movimentacoes.filter((m) => m.loteId === loteId); }
}
