import { Component } from '@angular/core';
import { EstoqueService, Movimentacao } from '../estoque.service';

@Component({ imports: [], selector: 'app-relatorios', styleUrl: './relatorios.css', templateUrl: './relatorios.html' })
export class Relatorios {
  constructor(public readonly estoque: EstoqueService) {}
  get registos(): Movimentacao[] { return this.estoque.getReceitasControladas(); }
  get totalMedicamentosControlados(): number { return this.estoque.produtos.filter((p) => p.requerRetencaoReceita).length; }
  get totalUnidadesRegistadas(): number { return this.registos.reduce((total, m) => total + m.quantidade, 0); }
  dataHora(data: string): string { return new Date(data).toLocaleString('pt-PT'); }
  exportar(): void {
    const cabecalho = ['Data/Hora', 'Medicamento', 'Lote', 'Quantidade', 'N.º Notificação', 'CRM', 'Paciente', 'Comprador'];
    const linhas = this.registos.map((m) => [new Date(m.dataHora).toLocaleString('pt-PT'), m.produtoNome, m.loteNumero,
      String(m.quantidade), m.receita?.numeroNotificacao ?? '', m.receita?.crmMedico ?? '', m.receita?.nomePaciente ?? '', m.receita?.nomeComprador ?? '']);
    const csv = [cabecalho, ...linhas].map((linha) => linha.map((v) => `"${v.replaceAll('"', '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'relatorio-medicamentos-controlados.csv'; link.click(); URL.revokeObjectURL(url);
  }
}
