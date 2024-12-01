import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-autor-biografia-dialog',
  standalone: true,
  imports: [],
  template: `
    <h1 mat-dialog-title class="dialog-title">{{ data.nome }}</h1>
    <div mat-dialog-content class="dialog-content">
      <img [src]="data.imagem" alt="{{ data.nome }}" class="autor-imagem" />
      <p class="dialog-biografia-titulo"><strong>Biografia:</strong></p>
      <p class="dialog-biografia">{{ data.biografia }}</p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-raised-button color="primary" (click)="dialogRef.close()">Fechar</button>
    </div>
`,
  styles:  [
    `
    .dialog-title {
      font-size: 26px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 24px;
      color: #333;
      letter-spacing: 1px; /* Espaçamento entre letras */
      text-transform: capitalize; /* Primeira letra maiúscula */
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }

    .autor-imagem {
      width: 120px;
      height: 120px;
      border-radius: 50%; /* Tornar a imagem redonda */
      object-fit: cover; /* Ajustar a imagem para preencher o espaço */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Adicionar sombra */
      margin-bottom: 16px;
      border: 2px solid #00bcd4; /* Destaque com cor */
    }

    .dialog-biografia-titulo {
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      width: 100%;
      margin: 16px 0 8px;
      color: #444;
      border-bottom: 2px solid #00bcd4; /* Linha de separação */
      padding-bottom: 4px;
    }

    .dialog-biografia {
      font-size: 16px;
      line-height: 1.6;
      text-align: justify;
      color: #555;
      padding: 0 20px; /* Adicionar espaçamento lateral */
      margin-bottom: 16px;
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    button[mat-raised-button] {
      background-color: #00bcd4;
      color: white;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      border-radius: 20px;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-bottom: 20px;
    }

    button[mat-raised-button]:hover {
      background-color: #0097a7;
    }
    `,
  ],
})
export class AutorBiografiaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AutorBiografiaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nome: string; biografia: string, imagem: string }
  ) {}
}
