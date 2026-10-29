import { AJUSTES_CENARIOS } from './constantes';
import { ajustarEntradas, calcular } from './calcular';
import type { Cenario, Entradas } from './tipos';

/** Gera os três cenários na ordem de exibição: realista, otimista e pessimista. */
export function gerarCenarios(entradas: Entradas): Cenario[] {
  const { otimista, pessimista } = AJUSTES_CENARIOS;
  const entradasOtimista = ajustarEntradas(entradas, otimista.receitaPct, otimista.custosPct);
  const entradasPessimista = ajustarEntradas(entradas, pessimista.receitaPct, pessimista.custosPct);

  return [
    { nome: 'realista', rotulo: 'Realista', entradas, resultado: calcular(entradas) },
    { nome: 'otimista', rotulo: 'Otimista', entradas: entradasOtimista, resultado: calcular(entradasOtimista) },
    { nome: 'pessimista', rotulo: 'Pessimista', entradas: entradasPessimista, resultado: calcular(entradasPessimista) },
  ];
}
