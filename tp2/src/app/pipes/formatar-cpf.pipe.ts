import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCpf',
  standalone: true
})
export class FormatarCpfPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) {
      return '';
    }

    const cpf = value.toString().padStart(11, '0'); // Garante que o CPF tenha 11 dígitos
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      return value.toString(); // Retorna como está se não for um CPF válido
    }

    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
  }

}
