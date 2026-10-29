import { describe, expect, it } from 'vitest';
import { converterNumero, validarCampo, validarEntradas } from './validacao';

describe('validarCampo', () => {
  it('vazio', () => {
    expect(validarCampo('receita', '')).toMatch(/preencha/);
    expect(validarCampo('receita', '   ')).toMatch(/preencha/);
  });

  it('letras', () => {
    expect(validarCampo('receita', 'abc')).toMatch(/sem letras/);
    expect(validarCampo('custos', '12a')).toMatch(/sem letras/);
    expect(validarCampo('custos', '1e5')).toMatch(/sem letras/);
  });

  it('negativo', () => {
    expect(validarCampo('investimento', '-100')).toMatch(/negativo/);
    expect(validarCampo('custos', '-1')).toMatch(/negativo/);
  });

  it('investimento zero é bloqueado; receita e custos zero são aceitos', () => {
    expect(validarCampo('investimento', '0')).toMatch(/maior que zero/);
    expect(validarCampo('investimento', '0,00')).toMatch(/maior que zero/);
    expect(validarCampo('receita', '0')).toBeNull();
    expect(validarCampo('custos', '0')).toBeNull();
  });

  it('formato inválido', () => {
    expect(validarCampo('receita', '1,2,3')).toMatch(/inválido/);
    expect(validarCampo('receita', '1.2.3')).toMatch(/inválido/);
  });

  it('valores válidos', () => {
    expect(validarCampo('investimento', '50000')).toBeNull();
    expect(validarCampo('investimento', 'R$ 50.000,00')).toBeNull();
  });
});

describe('converterNumero', () => {
  it('aceita formatos brasileiros e simples', () => {
    expect(converterNumero('50000')).toBe(50000);
    expect(converterNumero('50.000')).toBe(50000);
    expect(converterNumero('50.000,50')).toBe(50000.5);
    expect(converterNumero('50000,50')).toBe(50000.5);
    expect(converterNumero('50000.50')).toBe(50000.5);
    expect(converterNumero('1.234.567')).toBe(1234567);
  });
});

describe('validarEntradas', () => {
  it('devolve todos os erros de uma vez', () => {
    const r = validarEntradas({ investimento: '0', receita: '', custos: 'xyz' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erros).sort()).toEqual(['custos', 'investimento', 'receita']);
  });

  it('devolve os números quando tudo é válido', () => {
    const r = validarEntradas({ investimento: '50.000', receita: '12000', custos: '7000,50' });
    expect(r).toEqual({ ok: true, entradas: { investimento: 50000, receita: 12000, custos: 7000.5 } });
  });
});
