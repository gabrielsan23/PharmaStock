import { Component } from '@angular/core';
import { EstoqueService, Lote } from '../estoque.service';

@Component({ imports: [], selector: 'app-alertas', styleUrl: './alertas.css', templateUrl: './alertas.html' })
export class Alertas {
  constructor(public readonly estoque: EstoqueService) {}
  get lotesVencidos(): Lote[] { return this.estoque.lotes.filter((l) => l.quantidade > 0 && this.estoque.getStatusValidade(l.validade) === 'Vencido'); }
  get lotesProximos(): Lote[] { return this.estoque.lotes.filter((l) => l.quantidade > 0 && this.estoque.getStatusValidade(l.validade) === 'Próximo do vencimento'); }
  get stockCritico() { return this.estoque.produtos.filter((p) => this.estoque.getQuantidadeProduto(p.id) <= p.estoqueMinimo); }
  produto(id: string): string { return this.estoque.getProduto(id)?.nome ?? 'Produto removido'; }
}
