"use strict";

captcha();
document.querySelector("#refresh").addEventListener("click",captcha);
document.querySelector("#sendButton").addEventListener("click",ValidForm);

function captcha() {
    let c1 = createCaptcha();
    document.querySelector("#captchaPlace").innerHTML=c1;
}

function createCaptcha() {
    let alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
    let a = alpha[Math.floor(Math.random() * alpha.length)];
    let b = alpha[Math.floor(Math.random() * alpha.length)];
    let c = alpha[Math.floor(Math.random() * alpha.length)];
    let d = alpha[Math.floor(Math.random() * alpha.length)];
    let code = a + b + c + d;
    return code;
}

function isValidCaptcha() {
    document.querySelector("#formResult").innerHTML= "";  
    let txtInput = document.querySelector("#txtInput").value;
    let captchaPlace = document.querySelector("#captchaPlace").innerHTML;
    if (txtInput === captchaPlace) {
        return true;
    } 
    else {
        return false;
    }
 }

function ValidForm() {
    let formOk = true;
    let captchaOk = false;
    let resultadoCaptcha = document.querySelector("#captchaResult");
    let resultadoForm = document.querySelector("#formResult");  

    resultadoCaptcha.innerHTML= "";  
    if (!isValidCaptcha()) {
        resultadoCaptcha.innerHTML= "el captcha es incorrecto, intentá nuevamente";  
        captcha();
        captchaOk = false;
    } 
    else {
        captchaOk = true;
    }
    let nombre = document.querySelector("#nombre").value;
    if (nombre === "") {
        document.querySelector("#errorName").innerHTML= "* este campo no puede estar vacío";
        resultadoForm.innerHTML= "hay errores en el formulario";  
        formOk = false;
    } 
    else {
        document.querySelector("#errorName").innerHTML= "";  
    }
    let apellido = document.querySelector("#apellido").value;
    if (apellido === "") {
        document.querySelector("#errorApellido").innerHTML= "* este campo no puede estar vacío";
        resultadoForm.innerHTML= "hay errores en el formulario";  
        formOk = false;
    } 
    else {
        document.querySelector("#errorApellido").innerHTML= "";  
    }
    let email = document.querySelector("#email").value;
    if (email === "") {
        document.querySelector("#errorMail").innerHTML= "* este campo no puede estar vacío";
        resultadoForm.innerHTML= "hay errores en el formulario";  
        formOk = false;
    } 
    else {
        document.querySelector("#errorMail").innerHTML= "";  
    }
    if (formOk && captchaOk) {
        resultadoForm.innerHTML= "Hemos recibido tus datos, te contactaremos a la brevedad";  
    } 
    else {
        captcha();
    }
}