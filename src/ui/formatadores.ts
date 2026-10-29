// Toda formatação passa por aqui; valores não finitos viram "—" e nunca aparecem como NaN/Infinity.

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const decimal1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatarMoeda(valor: number): string {
  return Number.isFinite(valor) ? moeda.format(valor) : '—';
}

export function formatarPercentual(valor: number): string {
  return Number.isFinite(valor) ? `${decimal1.format(valor)}%` : '—';
}

export function formatarPayback(meses: number | null): string {
  if (meses === null || !Number.isFinite(meses)) return 'Sem payback';
  return `${decimal1.format(meses)} meses`;
}

export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '—';
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** Diferença com sinal explícito (+/−), usada na análise de sensibilidade. */
export function formatarDiferenca(valor: number, formatar: (v: number) => string): string {
  if (!Number.isFinite(valor)) return '—';
  if (Math.abs(valor) < 1e-9) return formatar(0);
  return `${valor > 0 ? '+' : '−'}${formatar(Math.abs(valor))}`;
}
