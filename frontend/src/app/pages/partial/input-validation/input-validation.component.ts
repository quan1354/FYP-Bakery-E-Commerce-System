import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

const VALIDATORS_MESSAGES:any = {
  required:'Please Enter this field',
  email:'Please Enter Correct email format',
}

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss']
})

export class InputValidationComponent implements OnInit, OnChanges{
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true
  errorMessages:string [] = []
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(()=>{
      this.checkValidation();
    })
    this.control.valueChanges.subscribe(()=>{
      this.checkValidation();
    })
  }

  checkValidation(){
    const errors = this.control.errors;
    if(!errors){
      this.errorMessages = []
      return
    }
    const errKeys = Object.keys(errors);
    this.errorMessages = errKeys.map(key => VALIDATORS_MESSAGES[key])
  }
}
