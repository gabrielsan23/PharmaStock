import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueService, Lote, Movimentacao, NovoLote, Produto, ReceitaControlada } from '../estoque.service';

@Component({
  imports: [FormsModule],
  selector: 'app-movimentacoes',
  styleUrl: './movimentacoes.css',
  templateUrl: './movimentacoes.html',
})
export class Movimentacoes {
  produtos: Produto[] = [];
  lotes: Lote[] = [];
  historico: Movimentacao[] = [];
  produtoId = '';
  loteId = '';
  tipo: 'entrada' | 'saida' = 'entrada';
  quantidade = 1;
  responsavel = 'Dr. Roberto Silva';
  notaFiscal = '';
  criarNovoLote = false;
  novoLote: NovoLote = { numero: '', dataFabricacao: '', validade: '', codigoRastreio: '' };
  receita: ReceitaControlada = { numeroNotificacao: '', crmMedico: '', nomePaciente: '', nomeComprador: '' };
  mensagem = '';
  erro = '';

  constructor(public readonly estoque: EstoqueService) { this.atualizar(); }

  atualizar(): void {
    this.produtos = this.estoque.produtos;
    this.historico = this.estoque.movimentacoes;
    this.atualizarLotes();
  }

  produtoAlterado(): void { this.loteId = ''; this.atualizarLotes(); }
  atualizarLotes(): void { this.lotes = this.produtoId ? this.estoque.getLotesDoProduto(this.produtoId) : []; }
  escolherTipo(tipo: 'entrada' | 'saida'): void { this.tipo = tipo; this.mensagem = ''; this.erro = ''; this.criarNovoLote = false; }
  get produtoSelecionado(): Produto | undefined { return this.estoque.getProduto(this.produtoId); }
  get loteSelecionado(): Lote | undefined { return this.lotes.find((l) => l.id === this.loteId); }

  registar(): void {
    this.mensagem = ''; this.erro = '';
    try {
      if (this.tipo === 'entrada' && this.notaFiscal.trim() && !this.criarNovoLote && !this.loteId) {
        throw new Error('Selecione um lote para registar a entrada.');
      }
      this.estoque.registarMovimentacao({
        produtoId: this.produtoId, tipo: this.tipo, quantidade: Number(this.quantidade), responsavel: this.responsavel,
        ...(this.criarNovoLote && this.tipo === 'entrada' ? { novoLote: this.novoLote } : { loteId: this.loteId }),
        ...(this.notaFiscal.trim() ? { notaFiscal: this.notaFiscal } : {}),
        ...(this.tipo === 'saida' && this.produtoSelecionado?.requerRetencaoReceita ? { receita: this.receita } : {}),
      });
      this.mensagem = `${this.tipo === 'entrada' ? 'Entrada' : 'Saída'} registada com sucesso.`;
      this.quantidade = 1; this.notaFiscal = ''; this.loteId = ''; this.criarNovoLote = false;
      this.novoLote = { numero: '', dataFabricacao: '', validade: '', codigoRastreio: '' };
      this.receita = { numeroNotificacao: '', crmMedico: '', nomePaciente: '', nomeComprador: '' };
      this.atualizar();
    } catch (e) { this.erro = e instanceof Error ? e.message : 'Não foi possível registar a movimentação.'; }
  }

  quantidadeLote(lote: Lote): number { return lote.quantidade; }
  dataHora(data: string): string { return new Date(data).toLocaleString('pt-PT'); }
  nomeDoProduto(id: string): string { return this.estoque.getProduto(id)?.nome ?? 'Produto removido'; }
}
