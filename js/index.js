import { Auto } from "../js/auto.js";
import { read, save, clear, jsonToObject, objectToJson } from "./local-storage-async.js";
import { showSpinner } from "./spinner.js";

const KEY_STORAGE = "autos";
const FAKE_DELAY = 2000;
let items = []; // array vacio
const form = document.getElementById("form-group"); // recupero el form declarado en el body
const table = document.getElementById("table-items");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const btnEliminar = document.getElementById("btnEliminar");

document.addEventListener("DOMContentLoaded", onInit); // importante no poner parentesis, es un callback

function onInit() {
  loadItems();

  //setTable();
  getForm();
  tableTDListener();
  // escuchandoFormulario();
  // escuchandoBtnDeleteAll();
  handleCancellation();
  handleDelete();
}


async function loadItems() {
  // mostrarSpinner();
  let str = await read(KEY_STORAGE);
  // ocultarSpinner();

  const objArray = jsonToObject(str) || [];

  objArray.forEach(obj => {
    const model = new Auto(
      obj.id,
      obj.titulo,
      obj.transaccion,
      obj.descripcion,
      obj.precio,
      obj.puertas,
      obj.kms,
      obj.potencia
    );

    items.push(model);
  });
  setTable();
}


/**
 * Quiero que obtenga el elemento del DOM table
 * luego quiero agregarle las filas que sean necesarias
 * se agregaran dependiendo de la cantidad de items que poseo
 */
function setTable() {

  let tbody = table.getElementsByTagName('tbody')[0];
  tbody.innerHTML = ''; // Me aseguro que esté vacio, hago referencia al agregar otro

  const rows = ["id", "titulo", "transaccion", "descripcion", "precio", "puertas", "kms", "potencia"];

  items.forEach((item) => {
    let newRow = document.createElement("tr");

    rows.forEach((row) => {
      let newElement = document.createElement("td");
      newElement.textContent = item[row];

      newRow.appendChild(newElement);
    });

    // Agregar la fila al tbody
    tbody.appendChild(newRow);
  });
}


function tableTDListener() {
  table.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (target.matches("td")) {
      // Lógica a implementar al hacer doble clic en una celda
      const row = target.parentNode;
      const cells = row.getElementsByTagName("td");
      setForm(cells);
      btnIsVisible(true);
    }
  });
}


function getForm() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const model = new Auto(
      Date.now(),
      form.titulo.value,
      form.transaccion.value,
      form.descripcion.value,
      form.precio.value,
      form.puertas.value,
      form.kms.value,
      form.potencia.value,
    );

    console.log(model);

    const response = model.verify();

    if (response) {
      items.push(model);
      const str = objectToJson(items);

      try {
        await save(KEY_STORAGE, str);
        
        showSpinner(FAKE_DELAY);
        setTimeout(()=>{
          resetForm(); 
          setTable();
        }, FAKE_DELAY); 
      }
      catch (error) {
        alert(error);
      }
    }
    else {
      alert(respuesta.rta);
    }
  });
}


function setForm(data) {
  form.id.value = data[0].innerText;
  form.titulo.value = data[1].innerText;
  form.transaccion.value = data[2].innerText;
  form.descripcion.value = data[3].innerText;
  form.precio.value = data[4].innerText;
  form.puertas.value = data[5].innerText;
  form.kms.value = data[6].innerText;
  form.potencia.value = data[7].innerText;
}


function escuchandoBtnDeleteAll() {
  const btn = document.getElementById("btn-delete-all");

  btn.addEventListener("click", async (e) => {

    const userAnswer = confirm('Desea eliminar todos los Items?');

    if (userAnswer) {
      items.splice(0, items.length);

      try {
        await clear(KEY_STORAGE);
        setTable();
      }
      catch (error) {
        alert(error);
      }
    }
  });
}


function btnIsVisible(isVisible) {
  if (isVisible) {
    btnGuardar.setAttribute("class", "oculto");
    btnEliminar.removeAttribute("class");
    btnCancelar.removeAttribute("class");
  } else if (!isVisible) {
    btnGuardar.removeAttribute("class");
    btnEliminar.setAttribute("class", "oculto");
    btnCancelar.setAttribute("class", "oculto");
  }
}

function resetForm() {
  form.reset();
  btnIsVisible(false);
}

function handleCancellation() {
  btnCancelar.addEventListener("click", () => {
    resetForm();
  });
}

function handleDelete() {
  btnEliminar.addEventListener("click", async (e) => {
    if(confirm('Desea eliminar todos los Items?')){
      let id = parseInt(form.id.value);
      let arrayFiltered = items.filter((p) => p.id != id);
      items = arrayFiltered;
      const str = objectToJson(items);
      try {
        await save(KEY_STORAGE, str);
        showSpinner(FAKE_DELAY); 
        setTimeout(()=>{
          resetForm();
          btnIsVisible(false);
          setTable();
        }, FAKE_DELAY);
      }
      catch (error) {
        alert(error);
      }
    }
  });
}

