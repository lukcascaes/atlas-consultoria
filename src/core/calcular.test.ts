import { describe, expect, it } from 'vitest';
import { ajustarEntradas, calcular } from './calcular';
import { MESES_FLUXO } from './constantes';

describe('calcular', () => {
  it('lucro positivo: calcula lucro, payback, ROI e fluxo', () => {
    const r = calcular({ investimento: 60000, receita: 15000, custos: 10000 });
    expect(r.lucroMensal).toBe(5000);
    expect(r.paybackMeses).toBe(12);
    expect(r.roiAnual).toBe(100);
    expect(r.fluxoAcumulado).toHaveLength(MESES_FLUXO + 1);
    expect(r.fluxoAcumulado[0]).toBe(-60000);
    expect(r.fluxoAcumulado[12]).toBe(0);
    expect(r.fluxoAcumulado[24]).toBe(60000);
  });

  it('prejuízo: sem payback e ROI negativo', () => {
    const r = calcular({ investimento: 10000, receita: 3000, custos: 5000 });
    expect(r.lucroMensal).toBe(-2000);
    expect(r.paybackMeses).toBeNull();
    expect(r.roiAnual).toBe(-240);
    expect(r.fluxoAcumulado[24]).toBe(-10000 - 2000 * 24);
  });

  it('lucro zero: sem payback, ROI zero e fluxo parado', () => {
    const r = calcular({ investimento: 10000, receita: 5000, custos: 5000 });
    expect(r.lucroMensal).toBe(0);
    expect(r.paybackMeses).toBeNull();
    expect(r.roiAnual).toBe(0);
    expect(r.fluxoAcumulado.every((v) => v === -10000)).toBe(true);
  });

  it('valores no limite: lucro mínimo positivo e receita/custos zerados', () => {
    const minimo = calcular({ investimento: 1000, receita: 1000.01, custos: 1000 });
    expect(minimo.paybackMeses).not.toBeNull();
    expect(Number.isFinite(minimo.paybackMeses)).toBe(true);
    expect(minimo.paybackMeses).toBeCloseTo(100000, 0);

    const zerado = calcular({ investimento: 1000, receita: 0, custos: 0 });
    expect(zerado.paybackMeses).toBeNull();
    expect(zerado.roiAnual).toBe(0);
  });

  it('investimento muito pequeno: valores finitos, sem NaN nem Infinity', () => {
    const r = calcular({ investimento: 0.01, receita: 1000, custos: 500 });
    expect(r.paybackMeses).toBeCloseTo(0.00002, 8);
    expect(r.roiAnual).toBeCloseTo(60_000_000, 0);
    for (const valor of [r.lucroMensal, r.paybackMeses ?? 0, r.roiAnual, ...r.fluxoAcumulado]) {
      expect(Number.isFinite(valor)).toBe(true);
    }
  });

  it('investimento zero (proteção): ROI zero em vez de Infinity', () => {
    const r = calcular({ investimento: 0, receita: 1000, custos: 500 });
    expect(r.roiAnual).toBe(0);
    expect(Number.isFinite(r.paybackMeses)).toBe(true);
  });
});

describe('ajustarEntradas', () => {
  it('aplica os percentuais na receita e nos custos, sem mexer no investimento', () => {
    const e = ajustarEntradas({ investimento: 100, receita: 1000, custos: 500 }, 20, -10);
    expect(e.investimento).toBe(100);
    expect(e.receita).toBeCloseTo(1200);
    expect(e.custos).toBeCloseTo(450);
  });
});
