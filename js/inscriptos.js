"use strict";

document.querySelector("#btn-varios").addEventListener("click", agregarVarios);
document.querySelector("#btn-modificar").addEventListener("click", modificarElemento);
document.querySelector("#btn-canc").addEventListener("click", cancelar);
document.querySelector("#btn-atras").addEventListener("click", PaginarAnterior);
document.querySelector("#btn-adelante").addEventListener("click", PaginarSiguiente);
document.querySelector("#btn-ver").addEventListener("click", (e)=>{
    e.preventDefault();
    page=1;
    mostrarTabla();});
const url = "https://62b12016e460b79df05210f1.mockapi.io/clientes";
const tbody = document.querySelector("#tablaInscriptos");
let cliente = {};
var page = 1;
mostrarTabla();

async function agregarVarios(e) {
    e.preventDefault();
    if (verificarDatosIngresados()) {
        let cantidad = Number(document.querySelector("#cantidad").value);
        let nombre = document.querySelector("#nom");
        let mail = document.querySelector("#mail");
        let edad = document.querySelector("#edad");
        let categoria = document.querySelector("#categoria").value;
        cliente = {
            "name": nombre.value,
            "age": edad.value,
            "email": mail.value,
            "categoria": categoria
        }
        nombre.value = "";
        edad.value = "";
        mail.value = "";
        for (let i = 0; i < cantidad; i++) {
            try {
                let res = await fetch(url, {
                    "method": "POST",
                    "headers": { "Content-type": "application/json" },
                    "body": JSON.stringify(cliente)
                });
            } catch (error) {
                console.log(error);
            }
        }
        mostrarTabla();
    }
}

async function borrarElemento(id) {
    try {
        let res = await fetch(`${url}/${id}`, {
            "method": "DELETE"
        });
        if (res.status === 200) {
            mostrarTabla();
        }
    } catch (error) {
        console.log(error);
    }

}

function editarElemento(cliente) {
    document.querySelector("#nom").value = cliente.name;
    document.querySelector("#edad").value = cliente.age;
    document.querySelector("#mail").value = cliente.email;
    document.querySelector("#categoria").value = cliente.categoria;

    document.querySelector("#id").value = cliente.id; //esta oculto
    document.querySelector("#btn-modificar").classList.remove("oculto");
    document.querySelector("#btn-canc").classList.remove("oculto");
    document.querySelector("#botones").classList.add("oculto");
}

function cancelar(e) {
    e.preventDefault();
    document.querySelector("#btn-modificar").classList.add("oculto");
    document.querySelector("#btn-canc").classList.add("oculto");
    document.querySelector("#botones").classList.remove("oculto");
    document.querySelector("#nom").value = "";
    document.querySelector("#edad").value = "";
    document.querySelector("#mail").value = "";


}

async function modificarElemento(e) {
    e.preventDefault();
    document.querySelector("#btn-modificar").classList.add("oculto");
    document.querySelector("#btn-canc").classList.add("oculto");
    document.querySelector("#botones").classList.remove("oculto");
    let nombre = document.querySelector("#nom");
    let edad = document.querySelector("#edad");
    let mail = document.querySelector("#mail");
    let id = document.querySelector("#id").value;
    let categoria = document.querySelector("#categoria");
    let cli = {
        "name": nombre.value,
        "age": edad.value,
        "email": mail.value,
        "categoria": categoria.value
    }
    try {
        let res = await fetch(`${url}/${id}`, {
            "method": "PUT",
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(cli)
        });
        if (res.status === 200) {
            nombre.value = "";
            edad.value = "";
            mail.value = "";
            mostrarTabla();
        }
    } catch (error) {
        console.log(error);
    }

}

function verificarDatosIngresados() {
    let nombre = document.querySelector("#nom");
    let edad = document.querySelector("#edad");
    let formOk = true;
    if (nombre.value === "") {
        document.querySelector("#errorNombre").innerHTML = "* este campo no puede estar vacío";
        formOk = false;
    } else {
        document.querySelector("#errorNombre").innerHTML = "";
    }
    if (edad.value === "") {
        document.querySelector("#errorEdad").innerHTML = "* este campo no puede estar vacío";
        formOk = false;
    } else {
        document.querySelector("#errorEdad").innerHTML = "";
    }
    if (mail.value === "") {
        document.querySelector("#errorEmail").innerHTML = "* este campo no puede estar vacío";
        formOk = false;
    } else {
        document.querySelector("#errorEmail").innerHTML = "";
    }
    if (formOk) {
        return true;
    } else {
        return false;
    }
}

function PaginarSiguiente(e) {
    e.preventDefault();
    page++;
    mostrarTabla();
}

function PaginarAnterior(e) {
    e.preventDefault();
    page--;
    mostrarTabla();
}

function manejarBotonesPaginar(limiteUser) {
    let btnAdelente = document.querySelector("#btn-adelante");
    let btnAtras = document.querySelector("#btn-atras");
    let paginaActual = document.querySelector("#page");
    let limit = Number(document.querySelector("#limitePaginacion").value);
    paginaActual.innerHTML = page;
    if (page > 1) {
        btnAtras.disabled = false;
    } else {
        btnAtras.disabled = true;
    }
    if (limiteUser < limit) {
        btnAdelente.disabled = true;
    } else {
        btnAdelente.disabled = false;
    }

}

async function mostrarTabla() {
    let limit = Number(document.querySelector("#limitePaginacion").value);
    let isChecked = document.querySelector("#filtrosOn").checked;
    let filtroEdad = document.querySelector("#filtroEdad").value;
    let parametroCategoria = document.querySelector("#filtroCategoria").value;
    let clientes = {};

    tbody.innerHTML = "";
    try {
        if (isChecked) {
            if (filtroEdad == "") {
                let res = await fetch(`${url}?categoria=${parametroCategoria}&page=${page}&limit=${limit}`);
                if (res.status === 200) {
                    clientes = await res.json();
                } else {
                    console.log("error transformando en Json la respuesta de la API")
                }
                escribirTabla(clientes);
                manejarBotonesPaginar(clientes.length);
            } else {
              //  AgregarFiltroEdad();
                page=1;
                let filtrados = [];
                let cli = {};
                let res = await fetch(`${url}?categoria=${parametroCategoria}`);
                if (res.status === 200) {
                    clientes = await res.json();
                } else {
                    console.log("error transformando en Json la respuesta de la API")
                }
                clientes.forEach(cliente => {
                    if (Number(cliente.age) < filtroEdad && cliente.age != "") {
                        cli = {
                            "name": cliente.name,
                            "age": cliente.age,
                            "email": cliente.email,
                            "categoria": cliente.categoria,
                            "id": cliente.id
                        }
                        filtrados.push(cli);
                    }
                });
                document.querySelector("#limitePaginacion").value = 101;
                escribirTabla(filtrados);
                manejarBotonesPaginar(filtrados.length);
            }

        } else {
            let res = await fetch(`${url}?page=${page}&limit=${limit}`);
            if (res.status === 200) {
                let clientes = await res.json();
                escribirTabla(clientes);
                manejarBotonesPaginar(clientes.length);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// async function AgregarFiltroEdad() {
//     let filtrados = [];
//     let cli = {};
//     let clientes = [];
//     let parametroCategoria = document.querySelector("#filtroCategoria").value;

//     try {
//         let res = await fetch(`${url}?categoria=${parametroCategoria}`);
//         if (res.status === 200) {
//             clientes = await res.json();
//         } else {
//             console.log("error transformando en Json la respuesta de la API")
//         }
//         clientes.forEach(cliente => {
//             if (Number(cliente.age) < filtroEdad && cliente.age != "") {
//                 cli = {
//                     "name": cliente.name,
//                     "age": cliente.age,
//                     "email": cliente.email,
//                     "categoria": cliente.categoria,
//                     "id": cliente.id
//                 }
//                 filtrados.push(cli);
//             }
//         });
//         escribirTabla(filtrados);
//         manejarBotonesPaginar(filtrados.length);
//     } catch (error) {
//         console.log(error);
//     }
// }


function escribirTabla(clientes) {
    for (const cliente of clientes) {
        let fila = document.createElement("tr");

        let celdaNombre = document.createElement("td");
        let textoNombre = document.createTextNode(cliente.name);
        celdaNombre.appendChild(textoNombre);
        fila.appendChild(celdaNombre);

        let celdaEdad = document.createElement("td");
        let textoEdad = document.createTextNode(cliente.age);
        celdaEdad.appendChild(textoEdad);
        fila.appendChild(celdaEdad);

        let celdaMail = document.createElement("td");
        let textoMail = document.createTextNode(cliente.email);
        celdaMail.appendChild(textoMail);
        fila.appendChild(celdaMail);

        let celdaCategoria = document.createElement("td");
        let textoCategoria = document.createTextNode(cliente.categoria);
        celdaCategoria.appendChild(textoCategoria);
        fila.appendChild(celdaCategoria);


        let celdaBorrar = document.createElement("td");
        let trash = document.createElement("img");
        trash.src = "images/delete.png";
        trash.classList.add("iconInTable");
        trash.addEventListener("click", () => { borrarElemento(cliente.id) });
        celdaBorrar.appendChild(trash);
        fila.appendChild(celdaBorrar);

        let celdaModificar = document.createElement("td");
        let modif = document.createElement("img");
        modif.src = "images/modif.png";
        modif.classList.add("iconInTable");
        modif.addEventListener("click", () => { editarElemento(cliente) });
        celdaModificar.appendChild(modif);
        fila.appendChild(celdaModificar);

        tbody.appendChild(fila);
    }
}
