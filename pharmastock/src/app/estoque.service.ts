import { Injectable } from '@angular/core';

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  dosagem: string;
  fabricante: string;
  fornecedor: string;
  codigoRastreio: string;
  localArmazenamento: string;
  informacoesRegulatorias: string;
  requerRetencaoReceita: boolean;
  preco: number;
  estoqueMinimo: number;
  criadoEm: string;
}

export interface Lote {
  id: string;
  produtoId: string;
  numero: string;
  dataFabricacao: string;
  validade: string;
  codigoRastreio: string;
  quantidade: number;
  criadoEm: string;
}

export interface ReceitaControlada {
  numeroNotificacao: string;
  crmMedico: string;
  nomePaciente: string;
  nomeComprador: string;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  produtoNome: string;
  loteId: string;
  loteNumero: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  dataHora: string;
  responsavel: string;
  notaFiscal?: string;
  receita?: ReceitaControlada;
}

export interface NovoProduto {
  nome: string;
  categoria: string;
  dosagem: string;
  fabricante: string;
  fornecedor: string;
  lote: string;
  dataFabricacao: string;
  validade: string;
  codigoRastreio: string;
  localArmazenamento: string;
  informacoesRegulatorias: string;
  requerRetencaoReceita: boolean;
  preco: number;
  quantidadeInicial: number;
  estoqueMinimo: number;
}

export interface NovoLote {
  numero: string;
  dataFabricacao: string;
  validade: string;
  codigoRastreio: string;
}

const STORAGE_KEYS = {
  produtos: 'pharmastock_produtos_v1',
  lotes: 'pharmastock_lotes_v1',
  movimentacoes: 'pharmastock_movimentacoes_v1',
};

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private _produtos: Produto[] = this.ler<Produto[]>(STORAGE_KEYS.produtos, []);
  private _lotes: Lote[] = this.ler<Lote[]>(STORAGE_KEYS.lotes, []);
  private _movimentacoes: Movimentacao[] = this.ler<Movimentacao[]>(STORAGE_KEYS.movimentacoes, []);

  get produtos(): Produto[] { return [...this._produtos]; }
  get lotes(): Lote[] { return [...this._lotes]; }
  get movimentacoes(): Movimentacao[] {
    return [...this._movimentacoes].sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  }

  getLotesDoProduto(produtoId: string): Lote[] {
    return this._lotes.filter((lote) => lote.produtoId === produtoId);
  }

  getProduto(produtoId: string): Produto | undefined {
    return this._produtos.find((produto) => produto.id === produtoId);
  }

  getQuantidadeProduto(produtoId: string): number {
    return this._lotes.filter((lote) => lote.produtoId === produtoId)
      .reduce((total, lote) => total + lote.quantidade, 0);
  }

  getStatusValidade(validade: string): 'Vencido' | 'Próximo do vencimento' | 'Válido' {
    const hoje = this.dataHoje();
    if (validade < hoje) return 'Vencido';
    const [ano, mes, dia] = validade.split('-').map(Number);
    const dataValidade = new Date(ano, mes - 1, dia);
    const dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);
    const dias = Math.ceil((dataValidade.getTime() - dataHoje.getTime()) / 86400000);
    return dias <= 30 ? 'Próximo do vencimento' : 'Válido';
  }

  registarProduto(dados: NovoProduto): Produto {
    this.validarObrigatorios([
      ['Nome', dados.nome], ['Categoria', dados.categoria], ['Dosagem', dados.dosagem],
      ['Fabricante', dados.fabricante], ['Fornecedor', dados.fornecedor], ['Lote', dados.lote],
      ['Data de fabrico', dados.dataFabricacao], ['Validade', dados.validade],
      ['Código de rastreio', dados.codigoRastreio], ['Local de armazenamento', dados.localArmazenamento],
      ['Informações regulatórias', dados.informacoesRegulatorias],
    ]);
    if (dados.validade <= this.dataHoje()) throw new Error('A validade deve ser posterior à data de hoje.');
    if (dados.dataFabricacao > this.dataHoje()) throw new Error('A data de fabrico não pode estar no futuro.');
    if (dados.validade <= dados.dataFabricacao) throw new Error('A validade deve ser posterior à data de fabrico.');
    if (this._produtos.some((p) => p.nome.trim().toLocaleLowerCase() === dados.nome.trim().toLocaleLowerCase()
      && this.getLotesDoProduto(p.id).some((l) => l.numero.trim().toLocaleLowerCase() === dados.lote.trim().toLocaleLowerCase()))) {
      throw new Error('Este medicamento já está registado com este número de lote.');
    }
    if (this._lotes.some((l) => l.codigoRastreio.trim().toLocaleLowerCase() === dados.codigoRastreio.trim().toLocaleLowerCase())) {
      throw new Error('O código de rastreio já está associado a outro lote.');
    }
    if (!Number.isFinite(dados.preco) || dados.preco < 0) throw new Error('Informe um preço válido.');
    if (!Number.isInteger(dados.quantidadeInicial) || dados.quantidadeInicial < 0) throw new Error('A quantidade inicial deve ser zero ou superior.');
    if (!Number.isInteger(dados.estoqueMinimo) || dados.estoqueMinimo < 0) throw new Error('O stock mínimo deve ser zero ou superior.');

    const produto: Produto = {
      id: this.id(), nome: dados.nome.trim(), categoria: dados.categoria, dosagem: dados.dosagem.trim(),
      fabricante: dados.fabricante.trim(), fornecedor: dados.fornecedor.trim(), codigoRastreio: dados.codigoRastreio.trim(),
      localArmazenamento: dados.localArmazenamento.trim(), informacoesRegulatorias: dados.informacoesRegulatorias.trim(),
      requerRetencaoReceita: dados.requerRetencaoReceita, preco: Number(dados.preco),
      estoqueMinimo: Number(dados.estoqueMinimo), criadoEm: new Date().toISOString(),
    };
    const lote: Lote = {
      id: this.id(), produtoId: produto.id, numero: dados.lote.trim(), dataFabricacao: dados.dataFabricacao,
      validade: dados.validade, codigoRastreio: dados.codigoRastreio.trim(), quantidade: Number(dados.quantidadeInicial),
      criadoEm: new Date().toISOString(),
    };
    this._produtos.push(produto);
    this._lotes.push(lote);
    this.guardar();
    return produto;
  }

  registarMovimentacao(args: {
    produtoId: string; tipo: 'entrada' | 'saida'; quantidade: number; responsavel: string;
    loteId?: string; novoLote?: NovoLote; notaFiscal?: string; receita?: ReceitaControlada;
  }): Movimentacao {
    if (!Number.isInteger(args.quantidade) || args.quantidade <= 0) throw new Error('A quantidade deve ser um número inteiro maior que zero.');
    const produto = this.getProduto(args.produtoId);
    if (!produto) throw new Error('Selecione um medicamento registado.');
    if (args.tipo === 'entrada' && args.notaFiscal?.trim() && this._movimentacoes.some((m) => m.tipo === 'entrada' && m.notaFiscal?.trim().toLocaleLowerCase() === args.notaFiscal?.trim().toLocaleLowerCase())) {
      throw new Error('Esta nota fiscal já foi utilizada numa entrada de stock.');
    }

    let lote = args.loteId ? this._lotes.find((l) => l.id === args.loteId && l.produtoId === produto.id) : undefined;
    if (args.tipo === 'entrada' && args.novoLote) {
      const n = args.novoLote;
      this.validarObrigatorios([['Lote', n.numero], ['Data de fabrico', n.dataFabricacao], ['Validade', n.validade], ['Código de rastreio', n.codigoRastreio]]);
      if (n.validade <= this.dataHoje()) throw new Error('Não é possível registar um lote cuja validade já terminou ou termina hoje.');
      if (n.dataFabricacao > this.dataHoje() || n.validade <= n.dataFabricacao) throw new Error('Verifique as datas de fabrico e validade do novo lote.');
      if (this._lotes.some((l) => l.codigoRastreio.toLocaleLowerCase() === n.codigoRastreio.trim().toLocaleLowerCase())) {
        throw new Error('O código de rastreio já está associado a outro lote.');
      }
      if (this._lotes.some((l) => l.produtoId === produto.id && l.numero.toLocaleLowerCase() === n.numero.trim().toLocaleLowerCase())) {
        throw new Error('Este número de lote já existe para o medicamento selecionado.');
      }
      lote = { id: this.id(), produtoId: produto.id, numero: n.numero.trim(), dataFabricacao: n.dataFabricacao,
        validade: n.validade, codigoRastreio: n.codigoRastreio.trim(), quantidade: 0, criadoEm: new Date().toISOString() };
      this._lotes.push(lote);
    }
    if (!lote) throw new Error('Selecione um lote válido para a movimentação.');

    if (args.tipo === 'saida') {
      // Hard block: não existe opção de administrador para contornar esta validação.
      if (lote.validade < this.dataHoje()) throw new Error(`SAÍDA BLOQUEADA: o lote ${lote.numero} está vencido. O stock não foi alterado.`);
      if (produto.requerRetencaoReceita) {
        const r = args.receita;
        if (!r || !r.numeroNotificacao.trim() || !r.crmMedico.trim() || !r.nomePaciente.trim() || !r.nomeComprador.trim()) {
          throw new Error('Medicamento sujeito a retenção de receita: preencha o número da notificação, CRM, paciente e comprador.');
        }
      }
      if (args.quantidade > lote.quantidade) throw new Error(`Stock insuficiente no lote ${lote.numero}. Disponível: ${lote.quantidade} unidade(s).`);
      lote.quantidade -= args.quantidade;
    } else {
      lote.quantidade += args.quantidade;
    }

    const movimento: Movimentacao = {
      id: this.id(), produtoId: produto.id, produtoNome: produto.nome, loteId: lote.id, loteNumero: lote.numero,
      tipo: args.tipo, quantidade: args.quantidade, dataHora: new Date().toISOString(), responsavel: args.responsavel.trim() || 'Operador',
      ...(args.notaFiscal?.trim() ? { notaFiscal: args.notaFiscal.trim() } : {}),
      ...(args.tipo === 'saida' && produto.requerRetencaoReceita && args.receita ? { receita: { ...args.receita } } : {}),
    };
    this._movimentacoes.push(movimento);
    this.guardar();
    return movimento;
  }

  getReceitasControladas(): Movimentacao[] {
    return this.movimentacoes.filter((m) => !!m.receita);
  }

  getTotalUnidades(): number {
    return this._lotes.reduce((total, lote) => total + lote.quantidade, 0);
  }

  getResumo(): { produtos: number; unidades: number; stockCritico: number; proximosVencimento: number; vencidos: number } {
    const stockCritico = this._produtos.filter((p) => this.getQuantidadeProduto(p.id) <= p.estoqueMinimo).length;
    const vencidos = this._lotes.filter((l) => l.quantidade > 0 && this.getStatusValidade(l.validade) === 'Vencido').length;
    const proximosVencimento = this._lotes.filter((l) => l.quantidade > 0 && this.getStatusValidade(l.validade) === 'Próximo do vencimento').length;
    return { produtos: this._produtos.length, unidades: this.getTotalUnidades(), stockCritico, proximosVencimento, vencidos };
  }

  dataHoje(): string {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  dataMinimaValidade(): string {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const ano = amanha.getFullYear();
    const mes = String(amanha.getMonth() + 1).padStart(2, '0');
    const dia = String(amanha.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private validarObrigatorios(campos: Array<[string, string]>): void {
    const emFalta = campos.filter(([, valor]) => !valor?.trim()).map(([nome]) => nome);
    if (emFalta.length) throw new Error(`Preencha os campos obrigatórios: ${emFalta.join(', ')}.`);
  }

  private id(): string { return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`; }

  private ler<T>(chave: string, padrao: T): T {
    try {
      if (typeof localStorage === 'undefined') return padrao;
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) as T : padrao;
    } catch { return padrao; }
  }

  private guardar(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.produtos, JSON.stringify(this._produtos));
    localStorage.setItem(STORAGE_KEYS.lotes, JSON.stringify(this._lotes));
    localStorage.setItem(STORAGE_KEYS.movimentacoes, JSON.stringify(this._movimentacoes));
  }
}
