import type { Feedback } from '../core/tipos';
import { escapar } from './dom';

export function desenharFeedback(alvo: HTMLElement, feedback: Feedback): void {
  alvo.innerHTML = `
    <div class="selo selo--${feedback.nivel}" role="status">
      <strong>${escapar(feedback.titulo)}</strong>
      <p>${escapar(feedback.mensagem)}</p>
    </div>`;
}
