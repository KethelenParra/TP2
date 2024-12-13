import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarTelefone',
  standalone: true
})
export class FormatarTelefonePipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) return '';
    const telefone = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (telefone.length <= 10) {
      // Formato para telefones fixos (10 dígitos)
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      // Formato para celulares (11 dígitos)
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

}
