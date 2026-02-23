(function () {
  'use strict';

  var STORAGE_KEY = 'ultimoPedidoResumen';

  function formatearPrecio(n) {
    return '$ ' + Number(n).toLocaleString('es-AR');
  }

  function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function construirTextoWhatsApp(data) {
    var lineas = [];
    lineas.push('*Panificacion Colombres*');
    lineas.push('Pedido');
    lineas.push('──────────────');
    lineas.push('ID: ' + (data.idPedido || data.idVenta || ''));
    lineas.push('Fecha: ' + (data.fechaOperativa || ''));
    lineas.push('Hora: ' + (data.hora || ''));
    lineas.push('Cliente: ' + (data.clienteNombre || ''));
    if (data.clienteTipoLista) lineas.push('Lista: ' + data.clienteTipoLista);
    lineas.push('──────────────');
    if (data.items && data.items.length) {
      data.items.forEach(function (it) {
        lineas.push(it.cantidad + ' x ' + (it.producto || '') + ' - ' + formatearPrecio(it.monto || it.precio * it.cantidad));
      });
    }
    lineas.push('──────────────');
    lineas.push('TOTAL: ' + formatearPrecio(data.total || 0));
    lineas.push('──────────────');
    lineas.push('Gracias por su pedido');
    return lineas.join('\n');
  }

  function init() {
    var ticket = document.getElementById('resumen-pedido-ticket');
    var sinDatos = document.getElementById('resumen-pedido-sin-datos');
    var btnWhatsapp = document.getElementById('resumen-pedido-btn-whatsapp');

    var raw = null;
    try {
      raw = sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (!raw) {
      if (ticket) ticket.hidden = true;
      if (sinDatos) sinDatos.hidden = false;
      if (btnWhatsapp) btnWhatsapp.style.display = 'none';
      return;
    }

    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      if (ticket) ticket.hidden = true;
      if (sinDatos) sinDatos.hidden = false;
      return;
    }

    if (sinDatos) sinDatos.hidden = true;

    document.getElementById('ticket-id').textContent = 'ID: ' + (data.idPedido || data.idVenta || '');
    document.getElementById('ticket-fecha').textContent = 'Fecha: ' + (data.fechaOperativa || '') + '  Hora: ' + (data.hora || '');
    document.getElementById('ticket-cliente').textContent = 'Cliente: ' + (data.clienteNombre || '');
    document.getElementById('ticket-listaprecio').textContent = data.clienteTipoLista ? 'Lista: ' + data.clienteTipoLista : '';

    var itemsHtml = '';
    if (data.items && data.items.length) {
      data.items.forEach(function (it) {
        var nombre = escapeHtml(it.producto || '');
        var cant = it.cantidad || 0;
        var monto = it.monto !== undefined ? it.monto : (it.precio || 0) * cant;
        itemsHtml += '<div class="resumen-pedido__ticket-item">' +
          '<span class="resumen-pedido__ticket-item-nombre">' + nombre + '</span>' +
          '<span class="resumen-pedido__ticket-item-cant">' + cant + ' x ' + formatearPrecio(it.precio || 0) + '</span>' +
          '<span class="resumen-pedido__ticket-item-monto">' + formatearPrecio(monto) + '</span>' +
          '</div>';
      });
    }
    document.getElementById('ticket-items').innerHTML = itemsHtml || '<p>Sin ítems</p>';
    document.getElementById('ticket-total').textContent = 'TOTAL: ' + formatearPrecio(data.total || 0);

    if (btnWhatsapp) {
      btnWhatsapp.href = 'https://wa.me/?text=' + encodeURIComponent(construirTextoWhatsApp(data));
      btnWhatsapp.style.display = 'inline-block';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
