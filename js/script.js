/*Ventanas emergentes que te ayudan a interactuar.*/
function abrirModal(idModal) {
    document.getElementById(idModal).style.display = "flex";
    document.body.style.overflow = "hidden"; 
}

function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

/*ESCENARIO B (ALIMENTOS)*/
function calcularEscenarioB() {
    const producto = document.getElementById('b-producto').value.trim();
    const precioIni = parseFloat(document.getElementById('b-precio-ini').value);
    const precioAct = parseFloat(document.getElementById('b-precio-act').value);
    const cantidad = parseFloat(document.getElementById('b-cantidad').value);
    const semanas = parseInt(document.getElementById('b-semanas').value);

    // Validación 
    if (!producto || isNaN(precioIni) || isNaN(precioAct) || isNaN(cantidad) || isNaN(semanas)) {
        alert("Por favor, complete todos los campos con valores numéricos correctos.");
        return;
    }

    // Modelos Matemáticos
    const incrementoPrecio = precioAct - precioIni;
    const porcentajeAumento = (incrementoPrecio / precioIni) * 100;
    const cantidadTotalPeriodo = cantidad * semanas;
    
    const gastoAnterior = precioIni * cantidadTotalPeriodo;
    const gastoActual = precioAct * cantidadTotalPeriodo;
    const sobregastoAdicional = gastoActual - gastoAnterior;

    // Renderización e inyección en el DOM
    const contenedorResultados = document.getElementById('res-b');
    const cajaOutput = document.getElementById('output-b');

    cajaOutput.innerHTML = `
        <p style="margin-bottom:8px;"><strong>Producto:</strong> ${producto}</p>
        <p style="margin-bottom:8px;"><strong>Variación:</strong> +${incrementoPrecio.toFixed(2)} Bs (+${porcentajeAumento.toFixed(1)}%)</p>
        <p style="margin-bottom:8px;"><strong>Gasto Anterior total:</strong> ${gastoAnterior.toFixed(2)} Bs</p>
        <p style="margin-bottom:8px;"><strong>Gasto Actual total:</strong> ${gastoActual.toFixed(2)} Bs</p>
        <div class="badge-alert alert-red">
            Pérdida/Sobregasto: La familia gasta ${sobregastoAdicional.toFixed(2)} Bs adicionales.
        </div>
    `;

    contenedorResultados.classList.remove('hidden');
}

 // Escenario D
let listaProductosD = [];

/*Agrega un objeto producto a la lista tras validar los campos de entrada individuales*/
function agregarProductoListaD() {
    const nombreInput = document.getElementById('d-prod-nombre');
    const precioInput = document.getElementById('d-prod-precio');
    const cantidadInput = document.getElementById('d-prod-cantidad');

    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const cantidad = parseInt(cantidadInput.value);

    // Validación
    if (!nombre || isNaN(precio) || precio <= 0 || isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, introduzca un nombre de producto válido, precio y cantidad mayores a 0.");
        return;
    }

    listaProductosD.push({
        id: Date.now(), 
        nombre: nombre,
        precio: precio,
        cantidad: cantidad,
        subtotal: precio * cantidad
    });
    nombreInput.value = "";
    precioInput.value = "";
    cantidadInput.value = "";

    actualizarTablaHTMLD();
    recalcularTodoD();
}

/*Elimina un producto específico*/
function eliminarProductoListaD(idProducto) {
    listaProductosD = listaProductosD.filter(item => item.id !== idProducto);
    actualizarTablaHTMLD();
    recalcularTodoD();
}

/**tabla HTML interna*/
function actualizarTablaHTMLD() {
    const cuerpoTabla = document.getElementById('tabla-productos-d');
    cuerpoTabla.innerHTML = "";

    if (listaProductosD.length === 0) {
        cuerpoTabla.innerHTML = `<tr id="fila-vacia-d"><td colspan="5" style="text-align: center; color: #a3b899; font-style: italic;">No hay productos en la lista</td></tr>`;
        return;
    }

    listaProductosD.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.name || item.nombre}</td>
            <td>${item.precio.toFixed(2)} Bs</td>
            <td>${item.cantidad}</td>
            <td>${item.subtotal.toFixed(2)} Bs</td>
            <td><button class="btn-eliminar-item" onclick="eliminarProductoListaD(${item.id})">Quitar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

/* Realiza el procesamiento matemático*/
function recalcularTodoD() {
    const presupuestoInput = document.getElementById('d-presupuesto').value;
    const presupuesto = parseFloat(presupuestoInput);
    const cajaOutput = document.getElementById('output-d');
    if (isNaN(presupuesto) || presupuesto < 0) {
        cajaOutput.innerHTML = `<p style="color:#ff7675;">* Por favor, digite un presupuesto familiar válido en la casilla superior.</p>`;
        return;
    }

    // 1. Cálculo del Total de la Compra sumando los subtotales de la lista
    let totalCompra = 0;
    listaProductosD.forEach(item => {
        totalCompra += item.subtotal;
    });

    // 2. Cálculo algebraico del Saldo Restante y Monto que falta
    let saldoRestante = 0;
    let montoFaltante = 0;
    let mensajeFinanzas = "";
    let claseAlerta = "alert-green";

    if (presupuesto >= totalCompra) {
        saldoRestante = presupuesto - totalCompra;
        montoFaltante = 0;
        mensajeFinanzas = `Finanzas Estables. Cubre la lista perfectamente y conserva un saldo a favor de ${saldoRestante.toFixed(2)} Bs.`;
    } else {
        saldoRestante = 0;
        montoFaltante = totalCompra - presupuesto;
        claseAlerta = "alert-red";
        mensajeFinanzas = `¡Alerta de déficit! Su presupuesto no alcanza. Requiere un monto faltante de ${montoFaltante.toFixed(2)} Bs para pagar la compra.`;
    }

    // 3. Organiza tus gastos según el porcentaje de tu sueldo que usas en cada cosa.
    let clasificacionGasto = "Bajo";
    if (totalCompra > presupuesto) {
        clasificacionGasto = "Crítico (Excede el presupuesto)";
    } else if (totalCompra >= presupuesto * 0.8) {
        clasificacionGasto = "Alto (Cerca del límite)";
    } else if (totalCompra >= presupuesto * 0.4) {
        clasificacionGasto = "Medio";
    }

    // Poner la información de forma clara en el lado derecho de la página.
    cajaOutput.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.95rem;">
            <p><strong>Total de la Compra:</strong> <span style="color:#ffffff;">${totalCompra.toFixed(2)} Bs</span></p>
            <p><strong>Saldo Restante:</strong> <span style="color:#55efc4;">${saldoRestante.toFixed(2)} Bs</span></p>
            <p><strong>Monto Faltante:</strong> <span style="color:#ff7675;">${montoFaltante.toFixed(2)} Bs</span></p>
            <p><strong>Clasificación del Gasto:</strong> <span style="color:#f1c40f; font-weight:bold;">${clasificacionGasto}</span></p>
        </div>
        <div class="badge-alert ${claseAlerta}" style="margin-top:15px;">
            ${mensajeFinanzas}
        </div>
    `;
}

// Lista en memoria para los productos básicos del Escenario F
let productosCanastaF = [];

/*Añade un producto con precio anterior y actual a la lista*/
function agregarProductoF() {
    const nombreInput = document.getElementById('f-prod-nombre');
    const precioAntInput = document.getElementById('f-prod-precio-ant');
    const precioActInput = document.getElementById('f-prod-precio-act');

    const nombre = nombreInput.value.trim();
    const precioAnt = parseFloat(precioAntInput.value);
    const precioAct = parseFloat(precioActInput.value);

    if (!nombre || isNaN(precioAnt) || precioAnt <= 0 || isNaN(precioAct) || precioAct <= 0) {
        alert("Por favor, introduzca un nombre de producto, precio anterior y actual válidos.");
        return;
    }

    const incremento = precioAct - precioAnt;

    // Guardar en el array
    productosCanastaF.push({
        id: Date.now(),
        nombre: nombre,
        precioAnterior: precioAnt,
        precioActual: precioAct,
        subida: incremento
    });

    // Limpiar los campos de la tabla
    nombreInput.value = "";
    precioAntInput.value = "";
    precioActInput.value = "";

    actualizarTablaHTMLF();
    recalcularTodoF();
}

/**
 * Quita un producto del la lista
 */
function eliminarProductoF(idProducto) {
    productosCanastaF = productosCanastaF.filter(item => item.id !== idProducto);
    actualizarTablaHTMLF();
    recalcularTodoF();
}
/**
 * Renderiza los productos básicos en la tabla HTML
 */
function actualizarTablaHTMLF() {
    const cuerpoTabla = document.getElementById('tabla-productos-f');
    cuerpoTabla.innerHTML = "";

    if (productosCanastaF.length === 0) {
        cuerpoTabla.innerHTML = `<tr id="fila-vacia-f"><td colspan="5" style="text-align: center; color: #a3b899; font-style: italic;">No hay variaciones de productos añadidas</td></tr>`;
        return;
    }

    productosCanastaF.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.precioAnterior.toFixed(2)} Bs</td>
            <td>${item.precioActual.toFixed(2)} Bs</td>
            <td style="color: ${item.subida > 0 ? '#ff7675' : '#55efc4'};">
                ${item.subida > 0 ? '+' : ''}${item.subida.toFixed(2)} Bs
            </td>
            <td><button class="btn-eliminar-item" onclick="eliminarProductoF(${item.id})">Quitar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

/* Realiza todos los cálculos matemáticos avanzados de pérdida de poder de compra */
function recalcularTodoF() {
    const ingreso = parseFloat(document.getElementById('f-ingreso').value);
    const gastoAnterior = parseFloat(document.getElementById('f-gasto-anterior').value);
    const cajaOutput = document.getElementById('output-f');

    if (isNaN(ingreso) || ingreso <= 0 || isNaN(gastoAnterior) || gastoAnterior < 0) {
        cajaOutput.innerHTML = `<p style="color:#a3b899;">Registre los ingresos y gastos mensuales fijos en la casilla superior para calcular.</p>`;
        return;
    }

    // 1. Calcular el aumento de gasto acumulado por la subida de los productos básicos
    let totalSubidaProductos = 0;
    productosCanastaF.forEach(item => {
        if (item.subida > 0) {
            totalSubidaProductos += item.subforce || item.subida; 
        }
    });
    // 2. Gasto Mensual Actual
    const gastoMensualActual = gastoAnterior + totalSubidaProductos;
    // 3. Saldo Antes y Saldo Después (Capacidad de ahorro restante)
    const saldoAntes = ingreso - gastoAnterior;
    const saldoDespues = ingreso - gastoMensualActual;
    // 4. Calcular el Porcentaje de Pérdida del Poder Adquisitivo
    let perdidaPoderAdquisitivo = 0;
    if (gastoAnterior > 0) {
        perdidaPoderAdquisitivo = (totalSubidaProductos / ingreso) * 100;
    }

    // 5. Nivel de Afectación Familiar 
    let nivelAfectacion = "Bajo / Estable";
    let claseAlerta = "alert-green";

    if (saldoDespues < 0) {
        nivelAfectacion = "Crítico (Déficit y Endeudamiento)";
        claseAlerta = "alert-red";
    } else if (perdidaPoderAdquisitivo >= 15 || saldoDespues <= ingreso * 0.1) {
        nivelAfectacion = "Alto (Capacidad de ahorro severamente reducida)";
        claseAlerta = "alert-red";
    } else if (perdidaPoderAdquisitivo > 5) {
        nivelAfectacion = "Medio (Ajustes de presupuesto requeridos)";
        claseAlerta = "alert-green"; // Alerta moderada
    }

    // Inyectar resultados estructurados en el panel derecho del DOM
    cajaOutput.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; line-height: 1.4;">
            <p><strong>Aumento del Gasto:</strong> <span style="color:#ff7675;">+${totalSubidaProductos.toFixed(2)} Bs</span></p>
            <p><strong>Gasto Mensual Actualizado:</strong> <span style="color:#ffffff;">${gastoMensualActual.toFixed(2)} Bs</span></p>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 4px 0;">
            <p><strong>Saldo Antes (Ahorro previo):</strong> <span style="color:#55efc4;">${saldoAntes.toFixed(2)} Bs</span></p>
            <p><strong>Saldo Después (Ahorro actual):</strong> <span style="color: ${saldoDespues >= 0 ? '#55efc4' : '#ff7675'};">${saldoDespues.toFixed(2)} Bs</span></p>
            <p><strong>Pérdida del Poder Adquisitivo:</strong> <span style="color:#f1c40f; font-weight:bold;">${perdidaPoderAdquisitivo.toFixed(2)}%</span></p>
            <p><strong>Nivel de Afectación Familiar:</strong> <span style="color:#ffffff; font-weight:bold; text-decoration: underline;">${nivelAfectacion}</span></p>
        </div>
        <div class="badge-alert ${claseAlerta}" style="margin-top:12px; font-size: 0.85rem;">
            ${saldoDespues >= 0 ? 'El hogar logra cubrir los nuevos costos pero sacrifica reservas económicas.' : '¡Presupuesto superado! Los incrementos en la canasta básica dejan a la familia en saldo negativo.'}
        </div>
    `;
}

/*Resetea y borra  */
function limpiarSimuladorF() {
    productosCanastaF = [];
    document.getElementById('f-ingreso').value = "";
    document.getElementById('f-gasto-anterior').value = "";
    document.getElementById('f-prod-nombre').value = "";
    document.getElementById('f-prod-precio-ant').value = "";
    document.getElementById('f-prod-precio-act').value = "";
    
    actualizarTablaHTMLF();
    
    const cajaOutput = document.getElementById('output-f');
    cajaOutput.innerHTML = `
        <p style="color: #a3b899;">Registre los ingresos, gastos y la variación de precios para procesar el impacto financiero familiar.</p>
    `;
}