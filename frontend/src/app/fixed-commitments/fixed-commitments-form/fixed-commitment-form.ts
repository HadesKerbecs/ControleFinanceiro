import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { CategoriesService } from '../../categories/categories.service';

@Component({
    standalone: true,
    selector: 'app-fixed-commitment-form',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './fixed-commitment-form.html',
    styleUrls: ['./fixed-commitment-form.scss']
})
export class FixedCommitmentForm implements OnInit {

    categories: any[] = [];
    private api = 'http://127.0.0.1:8000/api/fixed-commitments/';

    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        value: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        category: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        due_day: new FormControl<number | null>(null, {
            validators: [Validators.required, Validators.min(1), Validators.max(31)]
        }),
    });

    constructor(
        private http: HttpClient,
        private router: Router,
        private categoriesService: CategoriesService
    ) { }

    ngOnInit(): void {
        this.categoriesService.getCategories().subscribe(data => {
            this.categories = data;
            this.form.controls.category.setValue(null);
        });
    }

    formatValue() {
        const ctrl = this.form.controls.value;
        const v = ctrl.value;

        if (!v) return;

        const digits = v.replace(/\D/g, '');

        if (!digits) {
            ctrl.setValue('', { emitEvent: false });
            return;
        }

        const number = Number(digits) / 100;

        const formatted = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);

        ctrl.setValue(formatted, { emitEvent: false });
    }

    save() {
        if (this.form.invalid) return;

        const payload = {
            name: this.form.value.name,
            value: Number(
                this.form.value.value!.replace(/\./g, '').replace(',', '.')
            ),
            category: Number(this.form.value.category),
            due_day: Number(this.form.value.due_day),
        };

        this.http.post(this.api, payload).subscribe(() => {
            this.router.navigate(['/fixed-commitments']);
        });
    }

    cancel() {
        this.router.navigate(['/fixed-commitments']);
    }
}
