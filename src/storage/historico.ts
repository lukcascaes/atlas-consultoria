import { MAX_HISTORICO } from '../core/constantes';
import type { Entradas, Resultado } from '../core/tipos';

const CHAVE = 'atlas:historico:v1';

export interface RegistroHistorico {
  id: string;
  /** Data em ISO 8601, para ordenar e formatar depois. */
  data: string;
  entradas: Entradas;
  resultado: Pick<Resultado, 'lucroMensal' | 'paybackMeses' | 'roiAnual'>;
}

function ehNumero(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * Type guard: o localStorage pode ter sido editado à mão ou vir de uma versão antiga,
 * então conferimos o formato antes de confiar no dado.
 */
function ehRegistro(v: unknown): v is RegistroHistorico {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;
  const e = r.entradas as Record<string, unknown> | undefined;
  const res = r.resultado as Record<string, unknown> | undefined;
  return (
    typeof r.id === 'string' &&
    typeof r.data === 'string' &&
    !!e && ehNumero(e.investimento) && ehNumero(e.receita) && ehNumero(e.custos) &&
    !!res && ehNumero(res.lucroMensal) && ehNumero(res.roiAnual) &&
    (res.paybackMeses === null || ehNumero(res.paybackMeses))
  );
}

export function lerHistorico(): RegistroHistorico[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? dados.filter(ehRegistro).slice(0, MAX_HISTORICO) : [];
  } catch {
    // JSON corrompido ou localStorage indisponível (modo privado, bloqueio do navegador).
    return [];
  }
}

/** Salva no topo da lista e mantém só os últimos registros. Devolve false se não conseguir salvar. */
export function salvarNoHistorico(entradas: Entradas, resultado: Resultado): boolean {
  const registro: RegistroHistorico = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    data: new Date().toISOString(),
    entradas,
    resultado: {
      lucroMensal: resultado.lucroMensal,
      paybackMeses: resultado.paybackMeses,
      roiAnual: resultado.roiAnual,
    },
  };
  try {
    const lista = [registro, ...lerHistorico()].slice(0, MAX_HISTORICO);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch {
    // Cota excedida ou armazenamento bloqueado.
    return false;
  }
}

export function limparHistorico(): boolean {
  try {
    localStorage.removeItem(CHAVE);
    return true;
  } catch {
    return false;
  }
}
