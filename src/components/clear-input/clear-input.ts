import { Component , Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'clear-input',
  templateUrl: 'clear-input.html'
})
export class ClearInputComponent {
  @Input() type:string;
  @Input() placeholder:string;
  _value: string;
  @Output() valueChange = new EventEmitter();
  @Input()
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.valueChange.emit(this._value);
  }



  constructor() {

  }


  clearInput(event){
    this.value="";
    event.target.parentNode.style.display="none";
    event.target.parentNode.previousElementSibling.focus();
  }
  keyUp(event){
    if(this.value.length!==0 ){
      event.target.nextElementSibling.style.display="block";
    }
    else{
      event.target.nextElementSibling.style.display="none";
    }
  }

  blur(event){
    setTimeout(function(){
          event.target.nextElementSibling.style.display="none";
        }
    ,2)

  }



}

