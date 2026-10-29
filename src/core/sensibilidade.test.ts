import { describe, expect, it } from 'vitest';
import { calcular } from './calcular';
import { analisarSensibilidade } from './sensibilidade';

const entradas = { investimento: 50000, receita: 12000, custos: 7000 };

describe('analisarSensibilidade', () => {
  it('variação 0% devolve o resultado base e diferença zero', () => {
    const r = analisarSensibilidade(entradas, { receitaPct: 0, custosPct: 0 });
    expect(r.ajustado).toEqual(calcular(entradas));
    expect(r.ajustado).toEqual(r.base);
    expect(r.diferenca).toEqual({ lucroMensal: 0, roiAnual: 0, paybackMeses: 0 });
  });

  it('receita +10% aumenta o lucro em 10% da receita', () => {
    const r = analisarSensibilidade(entradas, { receitaPct: 10, custosPct: 0 });
    expect(r.diferenca.lucroMensal).toBeCloseTo(1200);
    expect(r.diferenca.paybackMeses).toBeLessThan(0);
  });

  it('diferença de payback é null quando o ajuste leva a prejuízo', () => {
    const r = analisarSensibilidade(entradas, { receitaPct: -50, custosPct: 0 });
    expect(r.ajustado.paybackMeses).toBeNull();
    expect(r.diferenca.paybackMeses).toBeNull();
  });

  it('limita variações fora da faixa de -50% a +50%', () => {
    const fora = analisarSensibilidade(entradas, { receitaPct: 999, custosPct: 0 });
    const limite = analisarSensibilidade(entradas, { receitaPct: 50, custosPct: 0 });
    expect(fora.ajustado).toEqual(limite.ajustado);
  });
});
