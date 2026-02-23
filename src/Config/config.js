/**
 * Configuración centralizada de la aplicación.
 * Rutas para Google Sheet (lectura CSV) y Apps Script (operaciones).
 */
(function (global) {
  'use strict';

  var Config = {
    /** URL pública del Google Sheet en formato CSV (solo lectura). */
    GOOGLE_SHEET_CSV_URL:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSIUBR1fiteyhunTC-P9XGqTY8GvNlgOLLwUQQORANReBeKzIQoCGoPaRvGBMHwgC1FJoQB-dqsjtfA/pub?output=csv',

    /** URL del Web App de Google Apps Script para operaciones con la hoja (guardar, actualizar, etc.). */
    APP_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwLZBkZTmPHG6-m67nj7_dW1ZjKQn2fRq2vPu0fLcGKOL7Ypw9bEbVwsMeprBX9cw_R4g/exec',

    /**
     * Proxy CORS (dejar vacío para enviar directo al Apps Script).
     * Sin proxy: la venta se guarda; el navegador puede bloquear la respuesta por CORS y se muestra mensaje de confirmación igual.
     * Algunos proxies (corsproxy.io) dan 502; si pasa, deja CORS_PROXY: ''
     */
    CORS_PROXY: '',

    /**
     * Costo de envío: si están definidos, en Nuevo pedido se puede activar "Costo de envío".
     * COSTO_ENVIO_DEFECTO: monto por defecto en pesos.
     * ID_PRODUCTO_ENVIO: ID genérico del ítem "Gasto de envío" en la base (para estadísticas/reportes).
     * Si no existen, la pantalla funciona igual que antes (sin opción de envío).
     */
    COSTO_ENVIO_DEFECTO: 2000,
    ID_PRODUCTO_ENVIO: 'ENVIO'
  };

  global.APP_CONFIG = Config;
})(typeof window !== 'undefined' ? window : this);
