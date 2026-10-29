import { MESES_FLUXO } from './constantes';
import type { Entradas, Resultado } from './tipos';

/** Cálculo base: lucro, payback, ROI anual e fluxo de caixa acumulado. */
export function calcular(entradas: Entradas, meses: number = MESES_FLUXO): Resultado {
  const { investimento, receita, custos } = entradas;
  const lucroMensal = receita - custos;

  // Sem lucro não há como recuperar o investimento: null em vez de Infinity.
  const paybackMeses = lucroMensal > 0 ? investimento / lucroMensal : null;

  // Proteção extra: a validação já impede investimento <= 0, mas a função não pode gerar NaN/Infinity.
  const roiAnual = investimento > 0 ? ((lucroMensal * 12) / investimento) * 100 : 0;

  const fluxoAcumulado: number[] = [-investimento];
  for (let mes = 1; mes <= meses; mes++) {
    fluxoAcumulado.push(-investimento + lucroMensal * mes);
  }

  return { lucroMensal, paybackMeses, roiAnual, fluxoAcumulado };
}

/** Aplica variações percentuais à receita e aos custos (o investimento não muda). */
export function ajustarEntradas(entradas: Entradas, receitaPct: number, custosPct: number): Entradas {
  return {
    investimento: entradas.investimento,
    receita: entradas.receita * (1 + receitaPct / 100),
    custos: entradas.custos * (1 + custosPct / 100),
  };
}
