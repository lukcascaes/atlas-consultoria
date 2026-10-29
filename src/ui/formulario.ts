import { validarEntradas } from '../core/validacao';
import type { CampoEntrada, Entradas } from '../core/tipos';
import { pegar } from './dom';

const CAMPOS: CampoEntrada[] = ['investimento', 'receita', 'custos'];

function input(campo: CampoEntrada): HTMLInputElement {
  return pegar<HTMLInputElement>(campo);
}

function mostrarErro(campo: CampoEntrada, mensagem: string | undefined): void {
  const alvo = document.querySelector<HTMLElement>(`[data-erro-para="${campo}"]`);
  if (alvo) alvo.textContent = mensagem ?? '';
  input(campo).setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

/** Lê e valida o formulário. Mostra os erros na tela e devolve null se algo estiver errado. */
export function lerFormulario(): Entradas | null {
  const textos = {
    investimento: input('investimento').value,
    receita: input('receita').value,
    custos: input('custos').value,
  };
  const resultado = validarEntradas(textos);

  for (const campo of CAMPOS) {
    mostrarErro(campo, resultado.ok ? undefined : resultado.erros[campo]);
  }
  if (!resultado.ok) {
    const primeiroComErro = CAMPOS.find((c) => resultado.erros[c]);
    if (primeiroComErro) input(primeiroComErro).focus();
    return null;
  }
  return resultado.entradas;
}

/** Preenche o formulário (usado ao recarregar uma simulação do histórico). */
export function preencherFormulario(entradas: Entradas): void {
  for (const campo of CAMPOS) {
    input(campo).value = String(entradas[campo]).replace('.', ',');
    mostrarErro(campo, undefined);
  }
}

/** Limpa o erro de um campo assim que o usuário volta a digitar. */
export function ligarLimpezaDeErros(): void {
  for (const campo of CAMPOS) {
    input(campo).addEventListener('input', () => mostrarErro(campo, undefined));
  }
}
