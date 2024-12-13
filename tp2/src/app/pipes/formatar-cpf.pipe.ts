import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCpf',
  standalone: true
})
export class FormatarCpfPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');

    // Formata o CPF no formato xxx.xxx.xxx-xx
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }

    return value;
  }
}
