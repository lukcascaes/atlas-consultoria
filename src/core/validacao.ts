import { VALOR_MAXIMO } from './constantes';
import type { CampoEntrada, Entradas, ResultadoValidacao } from './tipos';

const NOMES_CAMPOS: Record<CampoEntrada, string> = {
  investimento: 'Investimento inicial',
  receita: 'Receita mensal',
  custos: 'Custos mensais',
};

/**
 * Converte texto no formato brasileiro ou simples para número.
 * Aceita "50000", "50.000", "50000,50", "50.000,50" e "50000.50".
 * Devolve null se o texto não for um número válido.
 */
export function converterNumero(texto: string): number | null {
  const limpo = texto.trim().replace(/\s/g, '').replace(/^R\$/i, '');
  if (!/^\d[\d.,]*$/.test(limpo)) return null;

  let normalizado: string;
  if (limpo.includes(',')) {
    // Vírgula é o separador decimal; pontos são de milhar.
    normalizado = limpo.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    // "50.000" ou "1.234.567": pontos de milhar.
    normalizado = limpo.replace(/\./g, '');
  } else {
    normalizado = limpo;
  }

  // Number("1.2.3") e Number("1,2,3") viram NaN; Number.isFinite barra isso.
  const valor = Number(normalizado);
  return Number.isFinite(valor) ? valor : null;
}

/** Valida um campo e devolve a mensagem de erro, ou null se estiver ok. */
export function validarCampo(campo: CampoEntrada, texto: string): string | null {
  const nome = NOMES_CAMPOS[campo];
  const limpo = texto.trim();

  if (limpo === '') return `${nome}: preencha este campo.`;
  if (limpo.startsWith('-')) return `${nome}: o valor não pode ser negativo.`;
  if (/[a-zA-ZÀ-ÿ]/.test(limpo.replace(/^R\$/i, ''))) return `${nome}: use apenas números, sem letras.`;

  const valor = converterNumero(limpo);
  if (valor === null) return `${nome}: número inválido. Use, por exemplo, 50000 ou 50.000,00.`;
  if (valor > VALOR_MAXIMO) return `${nome}: valor muito alto.`;
  if (campo === 'investimento' && valor === 0) return `${nome}: deve ser maior que zero.`;

  return null;
}

/** Valida os três campos de uma vez e, se tudo estiver certo, devolve os números. */
export function validarEntradas(textos: Record<CampoEntrada, string>): ResultadoValidacao {
  const erros: Partial<Record<CampoEntrada, string>> = {};
  const campos: CampoEntrada[] = ['investimento', 'receita', 'custos'];

  for (const campo of campos) {
    const erro = validarCampo(campo, textos[campo]);
    if (erro) erros[campo] = erro;
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  // Aqui todos os campos já passaram por converterNumero sem erro.
  const entradas: Entradas = {
    investimento: converterNumero(textos.investimento) ?? 0,
    receita: converterNumero(textos.receita) ?? 0,
    custos: converterNumero(textos.custos) ?? 0,
  };
  return { ok: true, entradas };
}
