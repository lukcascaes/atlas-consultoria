import { describe, expect, it } from 'vitest';
import { calcular } from './calcular';
import { gerarFeedback } from './feedback';
import type { Resultado } from './tipos';

describe('gerarFeedback', () => {
  it('Alerta de Prejuízo quando o lucro mensal é <= 0', () => {
    const f = gerarFeedback(calcular({ investimento: 10000, receita: 5000, custos: 5000 }));
    expect(f.nivel).toBe('prejuizo');
    expect(f.titulo).toBe('Alerta de Prejuízo');
  });

  it('Alta Viabilidade com payback <= 12 e ROI >= 100%', () => {
    // payback 12 meses, ROI 100%: exatamente no limite.
    const f = gerarFeedback(calcular({ investimento: 60000, receita: 15000, custos: 10000 }));
    expect(f.nivel).toBe('alta');
    expect(f.titulo).toBe('Alta Viabilidade');
  });

  it('Viabilidade Moderada com payback entre 13 e 36 meses', () => {
    // payback 24 meses
    const f = gerarFeedback(calcular({ investimento: 120000, receita: 15000, custos: 10000 }));
    expect(f.nivel).toBe('moderada');
    expect(f.titulo).toBe('Viabilidade Moderada');
  });

  it('Baixa Viabilidade com payback acima de 36 meses', () => {
    // payback 40 meses
    const f = gerarFeedback(calcular({ investimento: 200000, receita: 15000, custos: 10000 }));
    expect(f.nivel).toBe('baixa');
    expect(f.titulo).toBe('Baixa Viabilidade');
  });

  it('payback rápido mas ROI abaixo do mínimo não é Alta', () => {
    const r: Resultado = { lucroMensal: 1000, paybackMeses: 10, roiAnual: 80, fluxoAcumulado: [] };
    expect(gerarFeedback(r).nivel).toBe('moderada');
  });
});
