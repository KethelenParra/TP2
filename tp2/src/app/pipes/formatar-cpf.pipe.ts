import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCpf',
  standalone: true
})
export class FormatarCpfPipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) return '';
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

}
