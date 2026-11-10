import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstoqueService } from '../estoque.service';

@Component({ imports: [RouterLink, FormsModule], selector: 'app-dashboard', styleUrl: './dashboard.css', templateUrl: './dashboard.html' })
export class Dashboard {
  pesquisa = '';
  constructor(public readonly estoque: EstoqueService) {}
  get resumo() { return this.estoque.getResumo(); }
  get produtosFiltrados() {
    const termo = this.pesquisa.trim().toLocaleLowerCase();
    return this.estoque.produtos.filter((p) => !termo || p.nome.toLocaleLowerCase().includes(termo) || p.codigoRastreio.toLocaleLowerCase().includes(termo));
  }
  get ultimasMovimentacoes() { return this.estoque.movimentacoes.slice(0, 5); }
  validadeProduto(id: string): string {
    const lotes = this.estoque.getLotesDoProduto(id).sort((a, b) => a.validade.localeCompare(b.validade));
    return lotes.length ? this.estoque.formatarData(lotes[0].validade) : '—';
  }
  statusProduto(id: string): string {
    const produto = this.estoque.getProduto(id);
    if (!produto) return '—';
    if (this.estoque.getQuantidadeProduto(id) <= produto.estoqueMinimo) return 'Stock crítico';
    const lotes = this.estoque.getLotesDoProduto(id);
    if (lotes.some((l) => l.quantidade > 0 && this.estoque.getStatusValidade(l.validade) === 'Vencido')) return 'Vencido/bloqueado';
    if (lotes.some((l) => l.quantidade > 0 && this.estoque.getStatusValidade(l.validade) === 'Próximo do vencimento')) return 'Próximo do vencimento';
    return 'Normal';
  }
  dataHora(data: string): string { return new Date(data).toLocaleString('pt-PT'); }
  quantidade(id: string): number { return this.estoque.getQuantidadeProduto(id); }
}
