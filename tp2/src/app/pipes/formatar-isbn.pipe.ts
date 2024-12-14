import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarIsbn',
  standalone: true
})
export class FormatarIsbnPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) return '';

    const isbn = value.toString().replace(/[^0-9Xx]/g, ''); // Remove caracteres não numéricos

    if (isbn.length !== 10 && isbn.length !== 13) {
      return value.toString(); // Retorna original se não tiver tamanho válido
    }

    if (isbn.length === 13) {
      // Formato ISBN-13: XXX-X-XX-XXXXX-X
      return `${isbn.substring(0, 3)}-${isbn.charAt(3)}-${isbn.substring(4, 6)}-${isbn.substring(6, 11)}-${isbn.charAt(12)}`;
    }

    // Formato ISBN-10: X-XX-XXXXX-X
    return `${isbn.charAt(0)}-${isbn.substring(1, 3)}-${isbn.substring(3, 8)}-${isbn.charAt(9)}`;
  }

}
