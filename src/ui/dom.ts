/** Busca um elemento obrigatório e falha cedo, com mensagem clara, se o HTML mudar. */
export function pegar<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado no HTML.`);
  return el as T;
}

/** Escapa texto antes de montar HTML, para nada digitado virar código. */
export function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
