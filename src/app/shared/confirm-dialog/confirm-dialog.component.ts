import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';  

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatDialogContent, MatDialogTitle],
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content>{{data.message}}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Confirmar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}
  ) {}
} 