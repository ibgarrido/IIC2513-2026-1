console.log("hola");

// Const: Constantes, let: Variables que van a cambiar. Ambas funcionan para strings y números.

let num = 1;
const palabra = "hola mundo";

console.log(num);
console.log(palabra)


// palabra = "hola"; error
num = "holamundo";
console.log(num);
console.log(palabra);


// "EDD"


// object and list


const almacen = {harina: 1, agua: 2, levadura: 3};

console.log("de harina tenemos "+ almacen.harina+"kg");

const lista = ['js', 'py', 'css']

console.log(lista[0]);

// functions

function sumar(a,b){
    return a+b;
}

console.log(sumar(2,3));



// arrow functions

const multiplicar = (a,b) => {
    return a*b;
};


console.log(multiplicar(2,5));



