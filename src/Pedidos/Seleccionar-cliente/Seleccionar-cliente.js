(function () {
  'use strict';

  var TABLA_CLIENTES = window.APP_TABLES && window.APP_TABLES.CLIENTES;
  var APP_SCRIPT_URL = window.APP_CONFIG && window.APP_CONFIG.APP_SCRIPT_URL;
  var CORS_PROXY = window.APP_CONFIG && window.APP_CONFIG.CORS_PROXY;
  var clientes = [];
  var clientesFiltrados = [];

  function llamarAppScript(accion, payload) {
    var body = 'data=' + encodeURIComponent(JSON.stringify(payload || { accion: accion }));
    var url = (CORS_PROXY && CORS_PROXY.length > 0)
      ? CORS_PROXY + encodeURIComponent(APP_SCRIPT_URL)
      : APP_SCRIPT_URL;
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var ct = (res.headers.get('Content-Type') || '').toLowerCase();
      if (ct.indexOf('json') !== -1) return res.json();
      return res.text().then(function (t) {
        try { return JSON.parse(t); } catch (e) { return { ok: false, error: t }; };
      });
    });
  }

  function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function aplicarFiltro() {
    var busqueda = (document.getElementById('seleccionar-cliente-buscar') || {}).value || '';
    var q = busqueda.trim().toLowerCase();
    if (!q) {
      clientesFiltrados = clientes.slice(0);
    } else {
      clientesFiltrados = clientes.filter(function (c) {
        var nombre = (c['NOMBRE-APELLIDO'] || '').toLowerCase();
        var tipo = (c['TIPO-LISTA-PRECIO'] || '').toLowerCase();
        var whatsapp = (c['WHATSAPP'] || '').toLowerCase();
        return nombre.indexOf(q) !== -1 || tipo.indexOf(q) !== -1 || whatsapp.indexOf(q) !== -1;
      });
    }
    pintarLista();
  }

  function pintarLista() {
    var lista = document.getElementById('seleccionar-cliente-lista');
    var vacio = document.getElementById('seleccionar-cliente-vacio');
    if (!lista) return;

    lista.innerHTML = '';
    if (clientesFiltrados.length === 0) {
      if (vacio) vacio.hidden = false;
      return;
    }
    if (vacio) vacio.hidden = true;

    var baseUrl = '../Nuevo-pedido/Nuevo-pedido.html';
    var pk = TABLA_CLIENTES ? TABLA_CLIENTES.pk : 'ID-CLIENTE';

    clientesFiltrados.forEach(function (c) {
      var idCliente = (c[pk] !== undefined && c[pk] !== null) ? String(c[pk]).trim() : '';
      if (!idCliente) return;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = baseUrl + '?cliente=' + encodeURIComponent(idCliente);
      a.className = 'seleccionar-cliente__item';

      var nombre = c['NOMBRE-APELLIDO'] || 'Sin nombre';
      var tipo = c['TIPO-LISTA-PRECIO'] || '';
      var whatsapp = c['WHATSAPP'] || '';

      a.innerHTML =
        '<span class="seleccionar-cliente__item-nombre">' + escapeHtml(nombre) + '</span>' +
        (tipo ? '<span class="seleccionar-cliente__item-tipo">' + escapeHtml(tipo) + '</span>' : '') +
        (whatsapp ? '<span class="seleccionar-cliente__item-whatsapp">WhatsApp: ' + escapeHtml(whatsapp) + '</span>' : '');

      li.appendChild(a);
      lista.appendChild(li);
    });
  }

  function cargarClientes() {
    var msg = document.getElementById('seleccionar-cliente-msg');
    var buscarWrap = document.getElementById('seleccionar-cliente-buscar-wrap');
    var lista = document.getElementById('seleccionar-cliente-lista');

    if (!APP_SCRIPT_URL || !TABLA_CLIENTES) {
      if (msg) msg.textContent = 'Falta configurar APP_SCRIPT_URL o tabla CLIENTES.';
      return;
    }

    llamarAppScript('clienteLeer', { accion: 'clienteLeer' })
      .then(function (data) {
        if (!data || !data.ok || !Array.isArray(data.datos)) {
          if (msg) msg.textContent = data && (data.error || data.mensaje) || 'No se recibieron clientes.';
          return;
        }
        var habCol = 'HABILITADO';
        clientes = (data.datos || []).filter(function (f) {
          var hab = (f[habCol] !== undefined && f[habCol] !== null ? String(f[habCol]).trim() : '').toUpperCase();
          return hab === 'SI' || hab === '1' || hab === 'TRUE' || hab === '';
        });
        clientesFiltrados = clientes.slice(0);
        if (msg) msg.textContent = '';
        if (buscarWrap) buscarWrap.hidden = clientes.length === 0;
        pintarLista();
      })
      .catch(function (err) {
        var txt = err && err.message ? err.message : String(err);
        if (msg) msg.textContent = 'No se pudieron cargar los clientes: ' + txt;
      });
  }

  function init() {
    var inputBuscar = document.getElementById('seleccionar-cliente-buscar');
    if (inputBuscar) {
      inputBuscar.addEventListener('input', aplicarFiltro);
      inputBuscar.addEventListener('keyup', aplicarFiltro);
    }
    cargarClientes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
