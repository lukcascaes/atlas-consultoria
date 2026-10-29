// Todos os parâmetros ajustáveis do simulador ficam aqui.

/** Horizonte do fluxo de caixa acumulado, em meses. */
export const MESES_FLUXO = 24;

/** Ajustes percentuais de cada cenário em relação ao realista. */
export const AJUSTES_CENARIOS = {
  otimista: { receitaPct: 20, custosPct: -10 },
  pessimista: { receitaPct: -20, custosPct: 10 },
} as const;

/** Limites do motor de regras do feedback consultivo. */
export const LIMITES_FEEDBACK = {
  /** Payback máximo (meses) para "Alta Viabilidade". */
  paybackAlta: 12,
  /** ROI anual mínimo (%) para "Alta Viabilidade". */
  roiAlta: 100,
  /** Payback máximo (meses) para "Viabilidade Moderada"; acima disso é "Baixa". */
  paybackModerada: 36,
} as const;

/** Faixa dos controles deslizantes da análise de sensibilidade (%). */
export const FAIXA_SENSIBILIDADE = { min: -50, max: 50 } as const;

/** Maior valor aceito em um campo, para evitar números absurdos na tela. */
export const VALOR_MAXIMO = 1_000_000_000_000;

/** Quantidade de simulações mantidas no histórico local. */
export const MAX_HISTORICO = 10;
