import { Anuncio } from "../js/anuncio.js";

class Auto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, puertas, kms, potencia) {
        super(id, titulo, transaccion, descripcion, precio);
        this.kms = kms;
        this.puertas = puertas;
        this.potencia = potencia;
    }


    verify() {
        return this.checkTitulo();
    }

    checkTitulo() {
        return titulo != null && titulo != "";
    }


}

export { Auto };