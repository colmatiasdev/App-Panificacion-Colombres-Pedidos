/**
 * Web App - ÚNICO origen de datos para la app (productos, clientes, pedidos, usuarios).
 * Desplegar como "Aplicación web": ejecutar como yo, quién tiene acceso: cualquiera.
 * La URL de despliegue debe estar en src/Config/config.js como APP_SCRIPT_URL.
 *
 * Tablas (hojas): CLIENTES, PRODUCTOS, ENERO..DICIEMBRE, USUARIOS.
 * Columnas según TABLAS más abajo (coincidir con src/Config/tables.js).
 */

/** ID del Google Sheet. DEBE coincidir con SPREADSHEET_ID en src/Config/config.js. */
var SPREADSHEET_ID = '1R5GWSiCHoZCRhvdQotph9b3_FEieIZ7cOjhK7Wwk8r8';

/** Definición de tablas (hoja, PK, columnas). Coincidir con src/Config/tables.js */
var TABLAS = {
  CLIENTES: {
    sheet: 'CLIENTES',
    pk: 'ID-CLIENTE',
    columns: ['ID-CLIENTE', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'WHATSAPP', 'OBSERVACION', 'HABILITADO']
  },
  PRODUCTOS: {
    sheet: 'PRODUCTOS',
    pk: 'ID-PRODUCTO',
    columns: ['ID-PRODUCTO', 'CATEGORIA', 'NOMBRE-PRODUCTO', 'PRECIO-MAYORISTA', 'PRECIO-DISTRIBUIDOR', 'HABILITADO']
  },
  ENERO: { sheet: 'ENERO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  FEBRERO: { sheet: 'FEBRERO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  MARZO: { sheet: 'MARZO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  ABRIL: { sheet: 'ABRIL', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  MAYO: { sheet: 'MAYO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  JUNIO: { sheet: 'JUNIO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  JULIO: { sheet: 'JULIO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  AGOSTO: { sheet: 'AGOSTO', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  SEPTIEMBRE: { sheet: 'SEPTIEMBRE', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  OCTUBRE: { sheet: 'OCTUBRE', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  NOVIEMBRE: { sheet: 'NOVIEMBRE', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  DICIEMBRE: { sheet: 'DICIEMBRE', pk: 'ID-PEDIDO', columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'] },
  USUARIOS: {
    sheet: 'USUARIOS',
    pk: 'ID-USUARIO',
    columns: ['ID-USUARIO', 'NOMBRE-USUARIO', 'PASSWORD', 'NOMBRE', 'APELLIDO', 'EMAIL', 'WHATSAPP', 'PERFIL', 'HABILITADO', 'FECHA-ALTA']
  }
};

function doGet(e) {
  return respuestaJson({ ok: true, mensaje: 'Usar POST con accion y parametros.' });
}

function doPost(e) {
  try {
    var params = parseBody(e);
    var accion = params.accion || '';

    switch (accion) {
      case 'clienteAlta':       return clienteAlta(params);
      case 'clienteBaja':       return clienteBaja(params);
      case 'clienteModificacion': return clienteModificacion(params);
      case 'clienteLeer':      return clienteLeer(params);
      case 'productoAlta':       return productoAlta(params);
      case 'productoBaja':       return productoBaja(params);
      case 'productoModificacion': return productoModificacion(params);
      case 'productoLeer':      return productoLeer(params);
      case 'ventaAlta':
      case 'guardarVenta':      return ventaAlta(params);
      case 'ventaBaja':         return ventaBaja(params);
      case 'ventaModificacion': return ventaModificacion(params);
      case 'ventaLeer':         return ventaLeer(params);
      case 'usuarioAlta':       return usuarioAlta(params);
      case 'usuarioBaja':       return usuarioBaja(params);
      case 'usuarioModificacion': return usuarioModificacion(params);
      case 'usuarioLeer':       return usuarioLeer(params);
      default:
        return respuestaJson({ ok: false, error: 'Acción no reconocida: ' + accion });
    }
  } catch (err) {
    return respuestaJson({ ok: false, error: err.toString() });
  }
}

function parseBody(e) {
  var params = {};
  if (e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    if (raw.indexOf('data=') !== -1) {
      params = JSON.parse(decodeURIComponent(raw.substring(raw.indexOf('data=') + 5).replace(/\+/g, ' ')));
    } else if (raw.trim().indexOf('{') === 0) {
      params = JSON.parse(raw);
    }
  }
  return params;
}

function getIdSpreadsheet() {
  var id = SPREADSHEET_ID || '';
  if (!id || id.indexOf('REEMPLAZAR') !== -1) {
    throw new Error('Configura SPREADSHEET_ID en Code.gs (solo el ID del documento).');
  }
  var match = id.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return id.trim();
}

function getSS() {
  var id = getIdSpreadsheet();
  if (id.length < 40) {
    throw new Error('SPREADSHEET_ID inválido. Usa solo el ID (ej: .../d/ESTE_ID/edit).');
  }
  return SpreadsheetApp.openById(id);
}

function getHoja(ss, nombreHoja, columnas) {
  var sheet = ss.getSheetByName(nombreHoja);
  if (!sheet) {
    sheet = ss.insertSheet(nombreHoja);
    if (columnas && columnas.length) {
      sheet.getRange(1, 1, 1, columnas.length).setValues([columnas]);
      sheet.getRange(1, 1, 1, columnas.length).setFontWeight('bold');
    }
  }
  return sheet;
}

function buscarFilaPorPK(sheet, def, pkValor) {
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return -1;
  var headers = datos[0];
  var colIdx = headers.indexOf(def.pk);
  if (colIdx === -1) return -1;
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][colIdx]) === String(pkValor)) return i + 1;
  }
  return -1;
}

function objetoAFila(def, obj) {
  var fila = [];
  for (var c = 0; c < def.columns.length; c++) {
    fila.push(obj[def.columns[c]] !== undefined ? obj[def.columns[c]] : '');
  }
  return fila;
}

// --- CLIENTES ---

function clienteAlta(params) {
  var def = TABLAS.CLIENTES;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = getHoja(ss, def.sheet, def.columns);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, def.columns.length).setValues([def.columns]);
    sheet.getRange(1, 1, 1, def.columns.length).setFontWeight('bold');
  }
  var fila = objetoAFila(def, dato);
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum > 0) return respuestaJson({ ok: false, error: 'Ya existe un cliente con ese ' + def.pk });
  sheet.appendRow(fila);
  return respuestaJson({ ok: true, mensaje: 'Cliente dado de alta.' });
}

function clienteBaja(params) {
  var def = TABLAS.CLIENTES;
  var pkValor = params[def.pk] || params.id;
  if (!pkValor) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, pkValor);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  sheet.deleteRow(rowNum);
  return respuestaJson({ ok: true, mensaje: 'Cliente dado de baja.' });
}

function clienteModificacion(params) {
  var def = TABLAS.CLIENTES;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  var fila = objetoAFila(def, dato);
  sheet.getRange(rowNum, 1, rowNum, def.columns.length).setValues([fila]);
  return respuestaJson({ ok: true, mensaje: 'Cliente actualizado.' });
}

function clienteLeer(params) {
  var def = TABLAS.CLIENTES;
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: true, datos: [] });
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return respuestaJson({ ok: true, datos: [] });
  var headers = datos[0];
  var filas = [];
  for (var i = 1; i < datos.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var val = datos[i][c];
      obj[headers[c]] = (val !== undefined && val !== null) ? val : '';
    }
    var pkVal = (obj[def.pk] !== undefined && obj[def.pk] !== null) ? String(obj[def.pk]).trim() : '';
    if (pkVal === '') continue;
    filas.push(obj);
  }
  var id = params[def.pk] || params.id;
  if (id) {
    filas = filas.filter(function (f) { return String(f[def.pk]).trim() === String(id).trim(); });
  }
  return respuestaJson({ ok: true, datos: filas });
}

// --- PRODUCTOS ---

function productoAlta(params) {
  var def = TABLAS.PRODUCTOS;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = getHoja(ss, def.sheet, def.columns);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, def.columns.length).setValues([def.columns]);
    sheet.getRange(1, 1, 1, def.columns.length).setFontWeight('bold');
  }
  var fila = objetoAFila(def, dato);
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum > 0) return respuestaJson({ ok: false, error: 'Ya existe un producto con ese ' + def.pk });
  sheet.appendRow(fila);
  return respuestaJson({ ok: true, mensaje: 'Producto dado de alta.' });
}

function productoBaja(params) {
  var def = TABLAS.PRODUCTOS;
  var pkValor = params[def.pk] || params.id;
  if (!pkValor) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, pkValor);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  sheet.deleteRow(rowNum);
  return respuestaJson({ ok: true, mensaje: 'Producto dado de baja.' });
}

function productoModificacion(params) {
  var def = TABLAS.PRODUCTOS;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  var fila = objetoAFila(def, dato);
  sheet.getRange(rowNum, 1, rowNum, def.columns.length).setValues([fila]);
  return respuestaJson({ ok: true, mensaje: 'Producto actualizado.' });
}

function productoLeer(params) {
  var def = TABLAS.PRODUCTOS;
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: true, datos: [] });
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return respuestaJson({ ok: true, datos: [] });
  var headers = datos[0];
  var filas = [];
  for (var i = 1; i < datos.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var val = c < datos[i].length ? datos[i][c] : '';
      obj[headers[c]] = (val !== undefined && val !== null) ? val : '';
    }
    var pkVal = (obj[def.pk] !== undefined && obj[def.pk] !== null) ? String(obj[def.pk]).trim() : '';
    if (pkVal === '') continue;
    filas.push(obj);
  }
  var id = params[def.pk] || params.id;
  if (id) {
    filas = filas.filter(function (f) { return String(f[def.pk]).trim() === String(id).trim(); });
  }
  return respuestaJson({ ok: true, datos: filas });
}

// --- PEDIDOS (ENERO .. DICIEMBRE, PK = ID-PEDIDO). guardarVenta/ventaAlta acepta idVenta o idPedido. ---

var COLUMNAS_PEDIDOS = ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO'];

function ventaAlta(params) {
  var hojaNombre = params.hoja || 'ENERO';
  var def = TABLAS[hojaNombre] || { sheet: hojaNombre, pk: 'ID-PEDIDO', columns: COLUMNAS_PEDIDOS };
  var idPedido = params.idPedido || params.idVenta || '';
  var fechaOperativa = params.fechaOperativa || '';
  var hora = params.hora || '';
  var nombreApellido = params.nombreApellido || params['NOMBRE-APELLIDO'] || '';
  var tipoListaPrecio = params.tipoListaPrecio || params['TIPO-LISTA-PRECIO'] || '';
  var items = params.items || [];
  if (!idPedido || !items.length) return respuestaJson({ ok: false, error: 'Falta idPedido/idVenta o items.' });
  var anio = new Date().getFullYear();
  var ss = getSS();
  var sheet = getHoja(ss, def.sheet, def.columns);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, def.columns.length).setValues([def.columns]);
    sheet.getRange(1, 1, 1, def.columns.length).setFontWeight('bold');
  }
  var filas = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    filas.push([
      idPedido,
      anio,
      fechaOperativa,
      hora,
      nombreApellido,
      tipoListaPrecio,
      it.idProducto || '',
      it.categoria || '',
      it.producto || '',
      it.cantidad !== undefined ? it.cantidad : 0,
      it.precio !== undefined ? it.precio : 0,
      it.monto !== undefined ? it.monto : 0
    ]);
  }
  if (filas.length === 0) return respuestaJson({ ok: true, mensaje: 'Sin ítems.' });
  var startRow = sheet.getLastRow() + 1;
  var endRow = startRow + filas.length - 1;
  sheet.getRange(startRow, 1, endRow, def.columns.length).setValues(filas);
  return respuestaJson({ ok: true, mensaje: 'Pedido guardado.' });
}

function ventaBaja(params) {
  var hojaNombre = params.hoja || 'ENERO';
  var idPedido = params.idPedido || params.idVenta || params['ID-PEDIDO'];
  if (!idPedido) return respuestaJson({ ok: false, error: 'Falta idPedido.' });
  var def = TABLAS[hojaNombre] || { sheet: hojaNombre, pk: 'ID-PEDIDO' };
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return respuestaJson({ ok: true, mensaje: 'Nada que borrar.' });
  var colIdx = datos[0].indexOf(def.pk);
  if (colIdx === -1) return respuestaJson({ ok: false, error: 'Columna ' + def.pk + ' no encontrada.' });
  var filasABorrar = [];
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][colIdx]) === String(idPedido)) filasABorrar.push(i + 1);
  }
  for (var j = filasABorrar.length - 1; j >= 0; j--) sheet.deleteRow(filasABorrar[j]);
  return respuestaJson({ ok: true, mensaje: 'Pedido dado de baja.', filasBorradas: filasABorrar.length });
}

function ventaModificacion(params) {
  var hojaNombre = params.hoja || 'ENERO';
  var idPedido = params.idPedido || params.idVenta || params['ID-PEDIDO'];
  var items = params.items || [];
  if (!idPedido) return respuestaJson({ ok: false, error: 'Falta idPedido.' });
  var def = TABLAS[hojaNombre] || { sheet: hojaNombre, pk: 'ID-PEDIDO', columns: COLUMNAS_PEDIDOS };
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var datos = sheet.getDataRange().getValues();
  var headers = datos[0];
  var colIdx = headers.indexOf(def.pk);
  var colAnio = headers.indexOf('AÑO');
  var colNombre = headers.indexOf('NOMBRE-APELLIDO');
  var colTipoLista = headers.indexOf('TIPO-LISTA-PRECIO');
  if (colIdx === -1) return respuestaJson({ ok: false, error: 'Columna ' + def.pk + ' no encontrada.' });
  var nombreApellido = params.nombreApellido || params['NOMBRE-APELLIDO'];
  var tipoListaPrecio = params.tipoListaPrecio || params['TIPO-LISTA-PRECIO'];
  var filasActualizadas = 0;
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][colIdx]) === String(idPedido) && items[filasActualizadas]) {
      var it = items[filasActualizadas];
      var anio = colAnio >= 0 ? datos[i][colAnio] : new Date().getFullYear();
      var nom = nombreApellido !== undefined ? nombreApellido : (colNombre >= 0 ? datos[i][colNombre] : '');
      var tipo = tipoListaPrecio !== undefined ? tipoListaPrecio : (colTipoLista >= 0 ? datos[i][colTipoLista] : '');
      var fila = [
        idPedido,
        anio,
        it.fechaOperativa !== undefined ? it.fechaOperativa : (headers.indexOf('FECHA_OPERATIVA') >= 0 ? datos[i][headers.indexOf('FECHA_OPERATIVA')] : ''),
        it.hora !== undefined ? it.hora : (headers.indexOf('HORA') >= 0 ? datos[i][headers.indexOf('HORA')] : ''),
        nom,
        tipo,
        it.idProducto !== undefined ? it.idProducto : (headers.indexOf('ID-PRODUCTO') >= 0 ? datos[i][headers.indexOf('ID-PRODUCTO')] : ''),
        it.categoria !== undefined ? it.categoria : (headers.indexOf('CATEGORIA') >= 0 ? datos[i][headers.indexOf('CATEGORIA')] : ''),
        it.producto !== undefined ? it.producto : (headers.indexOf('PRODUCTO') >= 0 ? datos[i][headers.indexOf('PRODUCTO')] : ''),
        it.cantidad !== undefined ? it.cantidad : (headers.indexOf('CANTIDAD') >= 0 ? datos[i][headers.indexOf('CANTIDAD')] : 0),
        it.precio !== undefined ? it.precio : (headers.indexOf('PRECIO') >= 0 ? datos[i][headers.indexOf('PRECIO')] : 0),
        it.monto !== undefined ? it.monto : (headers.indexOf('MONTO') >= 0 ? datos[i][headers.indexOf('MONTO')] : 0)
      ];
      sheet.getRange(i + 1, 1, i + 1, def.columns.length).setValues([fila]);
      filasActualizadas++;
    }
  }
  return respuestaJson({ ok: true, mensaje: 'Pedido actualizado.', filasActualizadas: filasActualizadas });
}

function ventaLeer(params) {
  var hojaNombre = params.hoja || 'ENERO';
  var idPedido = params.idPedido || params.idVenta || params['ID-PEDIDO'];
  var def = TABLAS[hojaNombre] || { sheet: hojaNombre, pk: 'ID-PEDIDO', columns: COLUMNAS_PEDIDOS };
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: true, datos: [] });
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return respuestaJson({ ok: true, datos: [] });
  var headers = datos[0];
  var pkCol = def.pk;
  var filas = [];
  for (var i = 1; i < datos.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var val = c < datos[i].length ? datos[i][c] : '';
      obj[headers[c]] = (val !== undefined && val !== null) ? val : '';
    }
    filas.push(obj);
  }
  if (idPedido) filas = filas.filter(function (f) { return String(f[pkCol] || '').trim() === String(idPedido).trim(); });
  return respuestaJson({ ok: true, datos: filas });
}

// --- USUARIOS (hoja USUARIOS, PK = ID-USUARIO) ---

function usuarioAlta(params) {
  var def = TABLAS.USUARIOS;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = getHoja(ss, def.sheet, def.columns);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, def.columns.length).setValues([def.columns]);
    sheet.getRange(1, 1, 1, def.columns.length).setFontWeight('bold');
  }
  var fila = objetoAFila(def, dato);
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum > 0) return respuestaJson({ ok: false, error: 'Ya existe un usuario con ese ' + def.pk });
  if (dato['FECHA-ALTA'] === undefined || dato['FECHA-ALTA'] === '') {
    var idxFecha = def.columns.indexOf('FECHA-ALTA');
    if (idxFecha >= 0) fila[idxFecha] = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  sheet.appendRow(fila);
  return respuestaJson({ ok: true, mensaje: 'Usuario dado de alta.' });
}

function usuarioBaja(params) {
  var def = TABLAS.USUARIOS;
  var pkValor = params[def.pk] || params.id;
  if (!pkValor) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, pkValor);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  sheet.deleteRow(rowNum);
  return respuestaJson({ ok: true, mensaje: 'Usuario dado de baja.' });
}

function usuarioModificacion(params) {
  var def = TABLAS.USUARIOS;
  var dato = params.dato || params;
  if (!dato[def.pk]) return respuestaJson({ ok: false, error: 'Falta ' + def.pk });
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: false, error: 'No existe la hoja ' + def.sheet });
  var rowNum = buscarFilaPorPK(sheet, def, dato[def.pk]);
  if (rowNum === -1) return respuestaJson({ ok: false, error: 'No encontrado.' });
  var fila = objetoAFila(def, dato);
  sheet.getRange(rowNum, 1, rowNum, def.columns.length).setValues([fila]);
  return respuestaJson({ ok: true, mensaje: 'Usuario actualizado.' });
}

function usuarioLeer(params) {
  var def = TABLAS.USUARIOS;
  var ss = getSS();
  var sheet = ss.getSheetByName(def.sheet);
  if (!sheet) return respuestaJson({ ok: true, datos: [] });
  var datos = sheet.getDataRange().getValues();
  if (datos.length < 2) return respuestaJson({ ok: true, datos: [] });
  var headers = datos[0];
  var filas = [];
  for (var i = 1; i < datos.length; i++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var val = c < datos[i].length ? datos[i][c] : '';
      obj[headers[c]] = (val !== undefined && val !== null) ? val : '';
    }
    var pkVal = (obj[def.pk] !== undefined && obj[def.pk] !== null) ? String(obj[def.pk]).trim() : '';
    if (pkVal === '') continue;
    filas.push(obj);
  }
  var id = params[def.pk] || params.id;
  if (id) {
    filas = filas.filter(function (f) { return String(f[def.pk]).trim() === String(id).trim(); });
  }
  return respuestaJson({ ok: true, datos: filas });
}

function respuestaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
