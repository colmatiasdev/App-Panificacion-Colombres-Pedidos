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
    APP_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwhaJh7wov-tD9pyBINJusO4BY_MkvalrvYJ_f1gUlM_52TraM58wAiu0KP7YPvbpQ-pw/exec',

    /**
     * Proxy CORS (dejar vacío para enviar directo al Apps Script).
     * Sin proxy: la venta se guarda; el navegador puede bloquear la respuesta por CORS y se muestra mensaje de confirmación igual.
     * Algunos proxies (corsproxy.io) dan 502; si pasa, deja CORS_PROXY: ''
     */
    CORS_PROXY: ''
  };

  global.APP_CONFIG = Config;
})(typeof window !== 'undefined' ? window : this);
