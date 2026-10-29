import type { Cenario } from '../core/tipos';
import { formatarMoeda, formatarPayback, formatarPercentual } from './formatadores';

/** Linhas da tabela já formatadas; reaproveitadas no PDF para tela e PDF mostrarem o mesmo. */
export function linhasDaTabela(cenarios: Cenario[]): string[][] {
  return cenarios.map((c) => [
    c.rotulo,
    formatarMoeda(c.entradas.receita),
    formatarMoeda(c.entradas.custos),
    formatarMoeda(c.resultado.lucroMensal),
    formatarPayback(c.resultado.paybackMeses),
    formatarPercentual(c.resultado.roiAnual),
  ]);
}

export const CABECALHO_TABELA = ['Cenário', 'Receita', 'Custos', 'Lucro mensal', 'Payback', 'ROI anual'];

export function desenharTabela(tabela: HTMLTableElement, cenarios: Cenario[]): void {
  tabela.replaceChildren();

  const thead = tabela.createTHead().insertRow();
  for (const titulo of CABECALHO_TABELA) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = titulo;
    thead.appendChild(th);
  }

  const tbody = tabela.createTBody();
  linhasDaTabela(cenarios).forEach((linha, i) => {
    const tr = tbody.insertRow();
    tr.className = `linha--${cenarios[i].nome}`;
    linha.forEach((valor, coluna) => {
      const cel = coluna === 0 ? document.createElement('th') : document.createElement('td');
      if (coluna === 0) (cel as HTMLTableCellElement).scope = 'row';
      cel.textContent = valor;
      // Lucro negativo em destaque
      if (coluna === 3 && cenarios[i].resultado.lucroMensal <= 0) cel.classList.add('negativo');
      tr.appendChild(cel);
    });
  });
}
