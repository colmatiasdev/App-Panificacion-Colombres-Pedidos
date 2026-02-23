/**
 * Definición de tablas del Sheet (columnas y PK).
 * Cada tabla = una hoja en el documento. Se pueden agregar más tablas luego.
 */
(function (global) {
  'use strict';

  var Tables = {
    /** Tabla CLIENTES: hoja "CLIENTES". PK = ID-CLIENTE */
    CLIENTES: {
      sheet: 'CLIENTES',
      pk: 'ID-CLIENTE',
      columns: ['ID-CLIENTE', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO', 'WHATSAPP', 'OBSERVACION', 'HABILITADO']
    },

    /** Tabla PRODUCTOS: hoja "PRODUCTOS". PK = ID-PRODUCTO */
    PRODUCTOS: {
      sheet: 'PRODUCTOS',
      pk: 'ID-PRODUCTO',
      columns: ['ID-PRODUCTO', 'CATEGORIA', 'NOMBRE-PRODUCTO', 'PRECIO-MAYORISTA', 'PRECIO-DISTRIBUIDOR', 'HABILITADO']
    },

    /** Tablas de pedidos por mes. PK = ID-PEDIDO (puede haber varias filas por pedido). */
    ENERO: {
      sheet: 'ENERO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    FEBRERO: {
      sheet: 'FEBRERO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    MARZO: {
      sheet: 'MARZO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    ABRIL: {
      sheet: 'ABRIL',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    MAYO: {
      sheet: 'MAYO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    JUNIO: {
      sheet: 'JUNIO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    JULIO: {
      sheet: 'JULIO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    AGOSTO: {
      sheet: 'AGOSTO',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    SEPTIEMBRE: {
      sheet: 'SEPTIEMBRE',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    OCTUBRE: {
      sheet: 'OCTUBRE',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    NOVIEMBRE: {
      sheet: 'NOVIEMBRE',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },
    DICIEMBRE: {
      sheet: 'DICIEMBRE',
      pk: 'ID-PEDIDO',
      columns: ['ID-PEDIDO', 'AÑO', 'FECHA_OPERATIVA', 'HORA', 'NOMBRE-APELLIDO', 'TIPO-LISTA-PRECIO','ID-PRODUCTO', 'CATEGORIA', 'PRODUCTO', 'CANTIDAD', 'PRECIO', 'MONTO']
    },

    /** Tabla USUARIOS: hoja "USUARIOS". PK = ID-USUARIO */
    USUARIOS: {
      sheet: 'USUARIOS',
      pk: 'ID-USUARIO',
      columns: ['ID-USUARIO', 'NOMBRE-USUARIO', 'PASSWORD', 'NOMBRE', 'APELLIDO', 'EMAIL', 'WHATSAPP', 'PERFIL', 'HABILITADO', 'FECHA-ALTA']
    }
  };

  /** Nombres de hojas por mes (1=ENERO … 12=DICIEMBRE). Ir agregando tablas ENERO, FEBRERO, etc. */
  Tables.NOMBRES_HOJAS_MES = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  global.APP_TABLES = Tables;
})(typeof window !== 'undefined' ? window : this);
