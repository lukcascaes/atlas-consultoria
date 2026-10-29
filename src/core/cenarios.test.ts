import { describe, expect, it } from 'vitest';
import { gerarCenarios } from './cenarios';

describe('gerarCenarios', () => {
  const cenarios = gerarCenarios({ investimento: 50000, receita: 12000, custos: 7000 });
  const porNome = Object.fromEntries(cenarios.map((c) => [c.nome, c]));

  it('gera os três cenários na ordem realista, otimista, pessimista', () => {
    expect(cenarios.map((c) => c.nome)).toEqual(['realista', 'otimista', 'pessimista']);
  });

  it('lucro: otimista > realista > pessimista', () => {
    const { otimista, realista, pessimista } = porNome;
    expect(otimista.resultado.lucroMensal).toBeGreaterThan(realista.resultado.lucroMensal);
    expect(realista.resultado.lucroMensal).toBeGreaterThan(pessimista.resultado.lucroMensal);
  });

  it('aplica +20%/-10% no otimista e -20%/+10% no pessimista', () => {
    expect(porNome.otimista.entradas.receita).toBeCloseTo(14400);
    expect(porNome.otimista.entradas.custos).toBeCloseTo(6300);
    expect(porNome.pessimista.entradas.receita).toBeCloseTo(9600);
    expect(porNome.pessimista.entradas.custos).toBeCloseTo(7700);
  });

  it('realista usa exatamente os valores digitados', () => {
    expect(porNome.realista.entradas).toEqual({ investimento: 50000, receita: 12000, custos: 7000 });
    expect(porNome.realista.resultado.lucroMensal).toBe(5000);
  });
});
