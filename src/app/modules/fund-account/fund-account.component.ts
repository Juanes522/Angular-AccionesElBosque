import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AchService } from 'src/app/services/ach.service';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-fund-account',
  templateUrl: './fund-account.component.html',
  styleUrls: ['./fund-account.component.css']
})
export class FundAccountComponent implements OnInit {
  accountId: string = '';

  step: number = 1; // 1: Crear relación, 2: Hacer transferencia
  relationshipId: string | null = null;

  relationshipForm: FormGroup = this.fb.group({
    account_owner_name: ['', [Validators.required, Validators.maxLength(100)]],
    bank_account_type: ['CHECKING', [Validators.required]],
    bank_account_number: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]+$/)]],
    bank_routing_number: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    nickname: ['', [Validators.required, Validators.maxLength(50)]]
  });

  transferForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0.01), Validators.max(100000)]],
    direction: ['INCOMING', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private achService: AchService,
    private messageService: MessageService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(){
    this.accountId = this.authService.getCurrentAlpacaUserId() || '';
    if (!this.accountId) {
      console.warn('No se encontró accountId (alpacaUserId) en el AuthService');
    }
  }

  // Crear relación ACH
  createRelationship() {
    if (this.relationshipForm.valid) {

      this.achService.createAchRelationship(this.accountId, this.relationshipForm.value).subscribe({
        next: (response: any) => {
          this.relationshipId = response.id;
          this.step = 2;
          this.showSuccess('Éxito', 'Relación bancaria creada correctamente');
          console.log('Id de relación: ', this.relationshipId);
        },
        error: (err) => {
          this.showError('Error', err.error?.message || 'Error al crear la relación bancaria, algun valor incorrecto');
        }
      });
    } else {
      this.showError('Formulario inválido', 'Por favor complete todos los campos requeridos');
    }
  }

  // Crear transferencia ACH
  createTransfer() {
    if (this.transferForm.valid && this.relationshipId) {

      const transferData = {
        transfer_type: 'ach',
        relationship_id: this.relationshipId,
        amount: this.transferForm.value.amount.toString(),
        direction: this.transferForm.value.direction
      };

      this.achService.createAchTransfer(this.accountId, transferData).subscribe({
        next: (response) => {
          this.showSuccess('Éxito', 'Transferencia realizada correctamente');
          this.resetForms();
        },
        error: (err) => {
          this.showError('Error', err.error?.message || 'Error al realizar la transferencia');
        }
      });
    } else {
      this.showError('Error', 'Complete todos los campos requeridos');
    }
  }

  resetForms() {
    this.step = 1;
    this.relationshipForm.reset({
      bank_account_type: 'CHECKING'
    });
    this.transferForm.reset({
      direction: 'INCOMING'
    });
    this.relationshipId = null;
  }

  private showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }

  private showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }
}
