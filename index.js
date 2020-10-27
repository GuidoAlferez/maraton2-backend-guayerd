/* Backend E-commerce
  Nota del cliente: 
  "Necesito un servicio RESTFul que me permita registrar un listado de productos comprados, precio, identificador de cliente y metodo de pago"

  Modelo de datos : 
    {
        "id": string,
        "clientId": string,
        "products": Array[], (Se guarda el identificador de producto, string)
        "amount": number,
        "paymentMethod": "Credit Card" | "Cash" | "Bitcoin"
    }
    
    Ejemplo:
    {
        "id": "adkjfh",
        "clientId": "1000",
        "products": ["100","300","400","500","600","700","800"],
        "amount": 10000,
        "paymentMethod": "Credit Card"
    }
*//*
MARATON BACKEND

1) Completar el servicio API REST, está incompleto.
2) Crear pruebas utilizando POSTMAN para todas las rutas (GET/POST/PUT/DELETE).
3) Validar en la carga/modificación (POST/PUT) que recibimos todos los datos necesarios. Sino, informar error de request.
4) Agregar al modelo de datos el atributo: createdAt (Date). Se debe cargar la fecha actual.  
5) BONUS: Crear un front-end simple que permita hacer una carga de datos desde un formulario. Respetando el modelo de datos.
6)  Elegí algún ejercicio de la maratón, e intenta encontrar una nueva forma de resolución, que sea distinta a la primera. 
7) Si fueses mentor/a, y tuvieses que pensar un ejercicio para la maratón, ¿Cuál sería? Te proponemos inventar un ejercicio nuevo que implique poner en práctica los conocimientos vistos hasta acá sobre Backend. 
Para finalizar:
A cada estudiante le tocará corregir el código de algún compañero/a. Tendrán que darle una devolución por escrito, marcando los aciertos y desaciertos, y las cosas que se pueden mejorar. Tengan en cuenta, a la hora de escribir, que el mensaje sea lo más organizado posible, para que el texto tenga claridad a la hora de leerse. Además, entendiendo que tendrán que juzgar el trabajo de un compañero/a, trabajen desde la empatía, para lograr una evaluación constructiva.*/

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const uniqid = require("uniqid");

const app = express();
const PORT = 3022;

//////////////////// Aplico Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

///////////////////// Init Array de Compras. (Simulo una Base de datos)
const compras = [
  {
    "id": 1,
    "clientId":"2000",
    "products": ["100","300","400","500","600","700","800"],
    "amount": 10000,
    "paymentMethod":"Credit Card",
  },
  {
    "id": 2,
    "clientId":"3000",
    "products": ["10","30","40","50","60","70","80"],
    "amount": 20000,
    "paymentMethod":"Paypal",
  }
];

// Defino Rutas, me baso en el modelo REST // -------------------------------------------------------------------------->

app.get('/',function(req,res){
  res.status(200).send({"message":"Bienvenidos a la compra"});
})

// --------------------------------------------------------------------------------------------------------------------->

app.get("/compras", function (req, res) {
  res.status(200).send({"compras": compras });
});

// --------------------------------------------------------------------------------------------------------------------->

app.get("/compras/:id", function (req, res) 
{
  const id = req.params.id;
  let compraEncontrado = undefined;
  compras.forEach(function(compra)
  {
    if(compra.id == id)
    {
        compraEncontrado = compra;
        return res.status(200).json(
            {
                compra:compraEncontrado
            })
    }
  });
  res.status(404).send({"menssage":"Compra Not Found - 404"});
})

// --------------------------------------------------------------------------------------------------------------------->

app.post("/compras/", function (req, res) 
{
  if(!req.body || !req.body.clientId || !req.body.products || !req.body.amount || !req.body.paymentMethod)
  {
    res.status(400).send({"mensaje":"No se puede incorporar la compra."});
  }
  else if (req.body.id) {
    res.status(400).send({ "mensaje": "compra no creada, no se pude crea compra con id" })
  }
  else
  {
    const newCompra = 
    {
      "id":uniqid(),
      "clientId":req.body.clienteId,
      "products":req.body.products,
      "amount":req.body.amount,
      "paymentMethod": req.body.paymentMethod
    }
    compras.push(newCompra)
    res.status(201).send({"compras":newCompra})  
  }  
});

// --------------------------------------------------------------------------------------------------------------------->

app.put("/compras/:id", function (req, res) {
  let compraPut;
  if(!req.body || !req.body.clientId || !req.body.products || !req.body.amount || !req.body.paymentMethod){
    res.status(400).send({"mensaje":"No se puede modificar la compra."});
  }
  else
  {
    const compraId = req.params.id;
    compras.forEach(function (compra) {
      if (compraId == compra.id) {
        compra.clientId = req.body.clientId;
        compra.products = req.body.products;
        compra.amount = req.body.amount;
        compra.paymentMethod = req.body.paymentMethod;
        compraPut=compra;
      }
    })
    if (compraPut) {
      res.status(201).send({"compraModificada": compraPut})
    }
    else {
      res.status(404).send({"mensaje": "Compra no encontrada"})
    }
  }
})
// --------------------------------------------------------------------------------------------------------------------->

app.delete("/compras/:id", function (req, res) 
{
  const ID = req.params.id;
  let index = null;
  compras.forEach(function(compra,i)
  {
      if(compra.id == ID)
      {
          index = i;
      }
  });
  if(index !== null){
      compras.splice(index,1);
      res.status(200).send({"menssage":"Compra was deleted"})
  }
  else{
      res.status(404).send({"message":"Compra was not founded"})
  }
});

// --------------------------------------------------------------------------------------------------------------------->

/* function getNextID()
{
  return  (compra.reduce((a, b) => { return a.id > b.id? a: b })).id + 1;
} */

// Ahora que tengo todo definido y creado, levanto el servicio escuchando peticiones en el puerto
app.listen(PORT, function () {
  console.log(`Maraton Guayerd running on PORT: ${PORT}\n\n`);
});