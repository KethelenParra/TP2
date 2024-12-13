import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarMoeda',
  standalone: true
})
export class FormatarMoedaPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }
    // Formata o valor como moeda em Real (R$)
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
