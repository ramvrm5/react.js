import validator from 'validator';
import $ from 'jquery';


//SHOW VALIDATION ERROR:START
export function	showError(target){
  $("#error"+target).addClass("validationFail");
}
export function	showErrormsg(target){
  $("#error"+target).css("display","block");
}
//SHOW VALIDATION ERROR:END

//HIDE VALIDATION ERROR:START 
export function	hideError(target){
  $("#error"+target).removeClass("validationFail");
}
export function	hideErrormsg(target){
  $("#error"+target).css("display","none");
}
//HIDE VALIDATION ERROR:END

//EMAIL VALIDATOR FUNCTION: START
export function	isEmail(value){
  if (!validator.isEmail(value)) {
    return false;
  }
  return true;
}

//REQUIRED VALIDATOR FUNCTION: START
export function	isRequired(value){
  if (!value.toString().trim().length) {
    return false;
  }
  else{
    return true;
  }
}

//INTERGER VALIDATOR FUNCTION: START 
export function	isInt(value){
  if (!validator.isInt(value) || (value<0)) {
    return false;
  }
  return true;
}

//FLOAT VALIDATOR FUNCTION: START 
export function	isFloat(value){
  if (!validator.isFloat(value)) {
    return false;
  }
  return true;
}

//RANGES VALIDATOR FUNCTION: START 
export function isBetween(value,min,max){
  if((value<min) || (value>max))
  {
    return false;
  }
 return true;
}

//MAX VALUE VALIDATOR FUNCTION: START 
export function isMax(value,max){
  if(value>max)
  {
    return false;
  }
 return true;
}

//MIN VALUE VALIDATOR FUNCTION: START 
export function isMin(value,min){
  if(value<min)
  {
    return false;
  }
 return true;
}

//LENGHT  VALIDATOR FUNCTION: START 
export function isLength(value,min,max){
  if (!validator.isLength(value,min,max)) {
    return false;
  }
 return true;
}


//LENGHT  VALIDATOR FUNCTION: START 
export function isMatches(value,regex){
  if (!validator.matches(value,regex)) {
    return false;
  }
 return true;
}

//Equals  VALIDATOR FUNCTION: START 
export function isEquals(value,regex){
  if (!validator.equals(value,regex)) {
    return false;
  }
 return true;
}


export function isMobile(value){
  if (!validator.isInt(value) || (value<0) || !validator.isLength(value,10,15)) {
    return false;
  }
 return true;
  
}

