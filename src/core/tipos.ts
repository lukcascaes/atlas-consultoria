// Tipos compartilhados entre o core e a interface.

/** Valores digitados pelo usuário, já convertidos para número. */
export interface Entradas {
  investimento: number;
  receita: number;
  custos: number;
}

/** Nome de cada campo do formulário (útil para mapear erros). */
export type CampoEntrada = keyof Entradas;

/** Resultado do cálculo base de uma simulação. */
export interface Resultado {
  lucroMensal: number;
  /** null = não há payback (lucro <= 0). Evita Infinity por construção. */
  paybackMeses: number | null;
  roiAnual: number;
  /** Posição 0 = mês 0 (-investimento); posições 1..N = fim de cada mês. */
  fluxoAcumulado: number[];
}

export type NomeCenario = 'realista' | 'otimista' | 'pessimista';

export interface Cenario {
  nome: NomeCenario;
  rotulo: string;
  entradas: Entradas;
  resultado: Resultado;
}

/** Variação percentual aplicada à receita e aos custos (ex.: 20 = +20%). */
export interface Variacao {
  receitaPct: number;
  custosPct: number;
}

export interface ResultadoSensibilidade {
  base: Resultado;
  ajustado: Resultado;
  diferenca: {
    lucroMensal: number;
    roiAnual: number;
    /** null quando um dos dois lados não tem payback. */
    paybackMeses: number | null;
  };
}

export type NivelFeedback = 'prejuizo' | 'alta' | 'moderada' | 'baixa';

export interface Feedback {
  nivel: NivelFeedback;
  titulo: string;
  mensagem: string;
}

/** Union discriminada: o TypeScript obriga a checar `ok` antes de usar os dados. */
export type ResultadoValidacao =
  | { ok: true; entradas: Entradas }
  | { ok: false; erros: Partial<Record<CampoEntrada, string>> };
