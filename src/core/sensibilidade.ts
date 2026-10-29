import { FAIXA_SENSIBILIDADE } from './constantes';
import { ajustarEntradas, calcular } from './calcular';
import type { Entradas, ResultadoSensibilidade, Variacao } from './tipos';

/** Mantém a variação dentro da faixa permitida (protege contra valores fora do slider). */
function limitar(pct: number): number {
  if (!Number.isFinite(pct)) return 0;
  return Math.min(FAIXA_SENSIBILIDADE.max, Math.max(FAIXA_SENSIBILIDADE.min, pct));
}

/** Recalcula o resultado com a variação e compara com o cenário realista (base). */
export function analisarSensibilidade(entradas: Entradas, variacao: Variacao): ResultadoSensibilidade {
  const base = calcular(entradas);
  const ajustado = calcular(
    ajustarEntradas(entradas, limitar(variacao.receitaPct), limitar(variacao.custosPct)),
  );

  const paybackMeses =
    base.paybackMeses !== null && ajustado.paybackMeses !== null
      ? ajustado.paybackMeses - base.paybackMeses
      : null;

  return {
    base,
    ajustado,
    diferenca: {
      lucroMensal: ajustado.lucroMensal - base.lucroMensal,
      roiAnual: ajustado.roiAnual - base.roiAnual,
      paybackMeses,
    },
  };
}
