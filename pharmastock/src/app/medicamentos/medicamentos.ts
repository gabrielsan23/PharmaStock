import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueService, NovoProduto, Produto } from '../estoque.service';

@Component({
  imports: [FormsModule],
  selector: 'app-medicamentos',
  styleUrl: './medicamentos.css',
  templateUrl: './medicamentos.html',
})
export class Medicamentos {
  produtos: Produto[] = [];
  mensagem = '';
  erro = '';
  dados: NovoProduto = this.formularioVazio();

  constructor(public readonly estoque: EstoqueService) { this.atualizar(); }

  guardar(): void {
    this.mensagem = ''; this.erro = '';
    try {
      this.estoque.registarProduto(this.dados);
      this.mensagem = 'Medicamento registado com sucesso e guardado neste navegador.';
      this.dados = this.formularioVazio();
      this.atualizar();
    } catch (e) { this.erro = e instanceof Error ? e.message : 'Não foi possível guardar o medicamento.'; }
  }

  atualizar(): void { this.produtos = this.estoque.produtos; }
  quantidade(id: string): number { return this.estoque.getQuantidadeProduto(id); }
  limpar(): void { this.dados = this.formularioVazio(); this.mensagem = ''; this.erro = ''; }

  private formularioVazio(): NovoProduto {
    return { nome: '', categoria: '', dosagem: '', fabricante: '', fornecedor: '', lote: '', dataFabricacao: '', validade: '',
      codigoRastreio: '', localArmazenamento: '', informacoesRegulatorias: '', requerRetencaoReceita: false,
      preco: 0, quantidadeInicial: 0, estoqueMinimo: 0 };
  }
}
