(function () {
  'use strict';

  var TABLA = window.APP_TABLES && window.APP_TABLES.PRODUCTOS;
  var TABLA_CLIENTES = window.APP_TABLES && window.APP_TABLES.CLIENTES;
  var APP_SCRIPT_URL = window.APP_CONFIG && window.APP_CONFIG.APP_SCRIPT_URL;
  var CORS_PROXY = window.APP_CONFIG && window.APP_CONFIG.CORS_PROXY;
  var NEGOCIO = window.APP_NEGOCIO;
  var productos = [];
  var clientes = [];
  var clienteSeleccionado = null;
  var carrito = [];

  /** Mapea un producto del Sheet (PRECIO-MAYORISTA / PRECIO-DISTRIBUIDOR) a objeto con PRECIO para el pedido. */
  function mapearProducto(f) {
    var p = {};
    if (TABLA && TABLA.columns) {
      TABLA.columns.forEach(function (c) {
        p[c] = f[c] !== undefined && f[c] !== null ? f[c] : '';
      });
    }
    var precioDist = Number(f['PRECIO-DISTRIBUIDOR']);
    var precioMay = Number(f['PRECIO-MAYORISTA']);
    p.PRECIO = (precioDist && !isNaN(precioDist)) ? precioDist : (precioMay && !isNaN(precioMay) ? precioMay : 0);
    return p;
  }

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

  function cargarClientes() {
    var msg = document.getElementById('nuevo-pedido-cliente-msg');
    var select = document.getElementById('nuevo-pedido-cliente');
    var info = document.getElementById('nuevo-pedido-cliente-info');
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
        if (msg) msg.textContent = '';
        if (select) {
          select.innerHTML = '';
          var optVacio = document.createElement('option');
          optVacio.value = '';
          optVacio.textContent = '— Seleccione un cliente —';
          select.appendChild(optVacio);
          clientes.forEach(function (c) {
            var opt = document.createElement('option');
            opt.value = String(c[TABLA_CLIENTES.pk] || '');
            opt.textContent = (c['NOMBRE-APELLIDO'] || '') + (c['TIPO-LISTA-PRECIO'] ? ' — ' + c['TIPO-LISTA-PRECIO'] : '');
            select.appendChild(opt);
          });
        }
        var params = new URLSearchParams(window.location.search);
        var idClienteUrl = params.get('cliente');
        if (idClienteUrl && select) {
          clienteSeleccionado = clientes.find(function (c) {
            return String(c[TABLA_CLIENTES.pk] || '').trim() === String(idClienteUrl).trim();
          }) || null;
          if (clienteSeleccionado) {
            select.value = String(clienteSeleccionado[TABLA_CLIENTES.pk] || '').trim();
          }
        }
        actualizarVistaCliente();
        actualizarEstadoGuardar();
      })
      .catch(function (err) {
        var txt = err && err.message ? err.message : String(err);
        if (msg) msg.textContent = 'No se pudieron cargar los clientes: ' + txt;
      });
  }

  function actualizarEstadoGuardar() {
    var btnGuardar = document.getElementById('nuevo-pedido-btn-guardar');
    if (!btnGuardar) return;
    var puedeGuardar = clienteSeleccionado && carrito.length > 0;
    btnGuardar.disabled = !puedeGuardar;
  }

  /** Muestra el combo o el texto del cliente según haya cliente seleccionado. */
  function actualizarVistaCliente() {
    var wrap = document.getElementById('nuevo-pedido-cliente-select-wrap');
    var info = document.getElementById('nuevo-pedido-cliente-info');
    var infoText = document.getElementById('nuevo-pedido-cliente-info-text');
    if (!wrap || !info) return;
    if (clienteSeleccionado) {
      wrap.hidden = true;
      if (infoText) infoText.textContent = 'Pedido vinculado a: ' + (clienteSeleccionado['NOMBRE-APELLIDO'] || '') + (clienteSeleccionado['TIPO-LISTA-PRECIO'] ? ' (' + clienteSeleccionado['TIPO-LISTA-PRECIO'] + ')' : '');
      info.hidden = false;
    } else {
      wrap.hidden = false;
      info.hidden = true;
    }
  }

  function cargarProductos() {
    var mensaje = document.getElementById('nuevo-pedido-mensaje');
    if (!APP_SCRIPT_URL || !TABLA) {
      mensaje.textContent = 'Falta configurar APP_SCRIPT_URL o Tables en config.';
      return;
    }
    var payload = { accion: 'productoLeer' };
    var body = 'data=' + encodeURIComponent(JSON.stringify(payload));
    var url = (CORS_PROXY && CORS_PROXY.length > 0)
      ? CORS_PROXY + encodeURIComponent(APP_SCRIPT_URL)
      : APP_SCRIPT_URL;
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var ct = (res.headers.get('Content-Type') || '').toLowerCase();
        if (ct.indexOf('json') !== -1) return res.json();
        return res.text().then(function (t) {
          try { return JSON.parse(t); } catch (e) { return { ok: false, error: t }; };
        });
      })
      .then(function (data) {
        if (!data || !data.ok || !Array.isArray(data.datos)) {
          mensaje.textContent = data && (data.error || data.mensaje) || 'No se recibieron productos.';
          return;
        }
        var habCol = 'HABILITADO';
        productos = data.datos
          .filter(function (f) {
            var hab = (f[habCol] !== undefined && f[habCol] !== null ? String(f[habCol]).trim() : '').toUpperCase();
            return hab === 'SI' || hab === '1' || hab === 'TRUE';
          })
          .map(mapearProducto);
        mensaje.textContent = '';
        pintarListado();
      })
      .catch(function (err) {
        var txt = err && err.message ? err.message : String(err);
        if (/failed to fetch|cors|blocked|access-control/i.test(txt)) {
          mensaje.textContent = 'No se pudo conectar con el servidor (CORS). Revisa APP_SCRIPT_URL y el despliegue del Apps Script.';
        } else {
          mensaje.textContent = 'No se pudieron cargar los productos: ' + txt;
        }
      });
  }

  function pintarListado() {
    var contenedor = document.getElementById('nuevo-pedido-productos');
    var textoBusqueda = (document.getElementById('nuevo-pedido-buscar') || {}).value || '';
    var q = textoBusqueda.trim().toLowerCase();
    var productosVisibles = productos;
    if (q) {
      productosVisibles = productos.filter(function (p) {
        var nombre = (p['NOMBRE-PRODUCTO'] || '').toLowerCase();
        var cat = (p.CATEGORIA || '').toLowerCase();
        return nombre.indexOf(q) !== -1 || cat.indexOf(q) !== -1;
      });
    }
    var porCategoria = {};
    productosVisibles.forEach(function (p) {
      var c = p.CATEGORIA || 'Otros';
      if (!porCategoria[c]) porCategoria[c] = [];
      porCategoria[c].push(p);
    });
    var categoriasOrden = Object.keys(porCategoria).sort();
    contenedor.innerHTML = '';
    categoriasOrden.forEach(function (categoria) {
      var productosCat = porCategoria[categoria] || [];
      var seccion = document.createElement('div');
      seccion.className = 'nuevo-pedido__grupo';
      seccion.innerHTML = '<h3 class="nuevo-pedido__grupo-titulo">' + escapeHtml(categoria) + '</h3>';
      var ul = document.createElement('ul');
      ul.className = 'nuevo-pedido__productos';
      productosCat.forEach(function (p) {
        var li = document.createElement('li');
        li.className = 'nuevo-pedido__item';
        li.innerHTML =
          '<span class="nuevo-pedido__item-nombre">' + escapeHtml(p['NOMBRE-PRODUCTO']) + '</span>' +
          '<span class="nuevo-pedido__item-precio">' + formatearPrecio(p.PRECIO) + '</span>' +
          '<button type="button" class="nuevo-pedido__btn-add" data-id="' + escapeHtml(p[TABLA.pk]) + '">Agregar</button>';
        li.querySelector('.nuevo-pedido__btn-add').addEventListener('click', function () {
          agregarAlCarrito(p);
        });
        ul.appendChild(li);
      });
      seccion.appendChild(ul);
      contenedor.appendChild(seccion);
    });
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function formatearPrecio(n) {
    return '$ ' + Number(n).toLocaleString('es-AR');
  }

  function agregarAlCarrito(producto) {
    var pk = TABLA.pk;
    var id = producto[pk];
    var item = carrito.find(function (x) { return x.producto[pk] === id; });
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({ producto: producto, cantidad: 1 });
    }
    pintarResumen();
  }

  function quitarDelCarrito(idProducto) {
    carrito = carrito.filter(function (x) { return x.producto[TABLA.pk] !== idProducto; });
    pintarResumen();
  }

  function actualizarCantidad(idProducto, cantidad) {
    var n = parseInt(cantidad, 10);
    if (isNaN(n) || n < 1) n = 1;
    var item = carrito.find(function (x) { return x.producto[TABLA.pk] === idProducto; });
    if (item) item.cantidad = n;
    pintarResumen();
  }

  function pintarResumen() {
    var vacio = document.getElementById('nuevo-pedido-resumen-vacio');
    var tabla = document.getElementById('nuevo-pedido-tabla');
    var tbody = document.getElementById('nuevo-pedido-tabla-body');
    var totalEl = document.getElementById('nuevo-pedido-total');
    var btnGuardar = document.getElementById('nuevo-pedido-btn-guardar');
    var msgGuardar = document.getElementById('nuevo-pedido-guardar-msg');
    if (msgGuardar) { msgGuardar.textContent = ''; msgGuardar.className = 'nuevo-pedido__guardar-msg'; }
    if (carrito.length === 0) {
      vacio.hidden = false;
      tabla.hidden = true;
      totalEl.textContent = '0';
      actualizarEstadoGuardar();
      return;
    }
    vacio.hidden = true;
    tabla.hidden = false;
    actualizarEstadoGuardar();
    tbody.innerHTML = '';
    var total = 0;
    carrito.forEach(function (item) {
      var id = item.producto[TABLA.pk];
      var subtotal = item.producto.PRECIO * item.cantidad;
      total += subtotal;
      var tr = document.createElement('tr');
      var qty = item.cantidad;
      var trashSvg = '<svg class="nuevo-pedido__icon-trash" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      tr.innerHTML =
        '<td>' + escapeHtml(item.producto['NOMBRE-PRODUCTO']) + '</td>' +
        '<td class="nuevo-pedido__th-num">' + formatearPrecio(item.producto.PRECIO) + '</td>' +
        '<td class="nuevo-pedido__th-num nuevo-pedido__td-qty">' +
        '<div class="nuevo-pedido__qty-wrap">' +
        '<button type="button" class="nuevo-pedido__qty-btn nuevo-pedido__qty-minus" data-id="' + escapeHtml(id) + '" aria-label="Disminuir cantidad">−</button>' +
        '<input type="number" min="1" value="' + qty + '" class="nuevo-pedido__input-qty" data-id="' + escapeHtml(id) + '" aria-label="Cantidad">' +
        '<button type="button" class="nuevo-pedido__qty-btn nuevo-pedido__qty-plus" data-id="' + escapeHtml(id) + '" aria-label="Aumentar cantidad">+</button>' +
        '</div></td>' +
        '<td class="nuevo-pedido__th-num nuevo-pedido__subtotal">' + formatearPrecio(subtotal) + '</td>' +
        '<td><button type="button" class="nuevo-pedido__btn-quitar" data-id="' + escapeHtml(id) + '" aria-label="Quitar del resumen" title="Quitar">' + trashSvg + '</button></td>';
      var inputQty = tr.querySelector('.nuevo-pedido__input-qty');
      var btnMinus = tr.querySelector('.nuevo-pedido__qty-minus');
      var btnPlus = tr.querySelector('.nuevo-pedido__qty-plus');
      function syncQty() {
        var val = parseInt(inputQty.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        inputQty.value = val;
        actualizarCantidad(id, val);
        btnMinus.disabled = val <= 1;
      }
      inputQty.addEventListener('input', function () { syncQty(); });
      inputQty.addEventListener('change', function () { syncQty(); });
      btnMinus.addEventListener('click', function () {
        var v = parseInt(inputQty.value, 10) || 1;
        if (v > 1) { inputQty.value = v - 1; syncQty(); }
      });
      btnPlus.addEventListener('click', function () {
        var v = parseInt(inputQty.value, 10) || 0;
        inputQty.value = v + 1;
        syncQty();
      });
      btnMinus.disabled = qty <= 1;
      tr.querySelector('.nuevo-pedido__btn-quitar').addEventListener('click', function () {
        quitarDelCarrito(id);
      });
      tbody.appendChild(tr);
    });
    totalEl.textContent = formatearPrecio(total);
  }

  function getTotalPedido() {
    var t = 0;
    carrito.forEach(function (item) {
      t += item.producto.PRECIO * item.cantidad;
    });
    return t;
  }

  function guardarResumenYRedirigir(payload) {
    var resumen = {
      idVenta: payload.idVenta,
      idPedido: payload.idVenta,
      fechaOperativa: payload.fechaOperativa || '',
      hora: payload.hora || '',
      clienteNombre: payload.nombreApellido || '',
      clienteTipoLista: payload.tipoListaPrecio || '',
      items: (payload.items || []).map(function (it) {
        return {
          producto: it.producto,
          cantidad: it.cantidad,
          precio: it.precio,
          monto: it.monto !== undefined ? it.monto : it.precio * it.cantidad
        };
      }),
      total: payload.total || 0
    };
    try {
      sessionStorage.setItem('ultimoPedidoResumen', JSON.stringify(resumen));
    } catch (e) {}
    carrito = [];
    pintarResumen();
    window.location.href = '../Resumen-pedido/Resumen-pedido.html';
  }

  function guardarPedido() {
    if (!clienteSeleccionado) {
      mostrarMensajeGuardar('Seleccione un cliente antes de guardar el pedido.', true);
      return;
    }
    if (carrito.length === 0) return;
    if (!APP_SCRIPT_URL) {
      mostrarMensajeGuardar('Configura APP_SCRIPT_URL en config.js', true);
      return;
    }
    if (!NEGOCIO || !NEGOCIO.getFechaOperativa) {
      mostrarMensajeGuardar('Falta cargar negocio.js', true);
      return;
    }
    var fechaOp = NEGOCIO.getFechaOperativa();
    var nombreHoja = NEGOCIO.getNombreHojaMes(fechaOp);
    var total = getTotalPedido();
    var ahora = new Date();
    var hora = ahora.getHours() + ':' + (ahora.getMinutes() < 10 ? '0' : '') + ahora.getMinutes();
    var idVenta = 'P-' + Date.now();
    var payload = {
      accion: 'guardarVenta',
      hoja: nombreHoja,
      idVenta: idVenta,
      fechaOperativa: fechaOp,
      hora: hora,
      nombreApellido: clienteSeleccionado['NOMBRE-APELLIDO'] || '',
      tipoListaPrecio: clienteSeleccionado['TIPO-LISTA-PRECIO'] || '',
      total: total,
      items: carrito.map(function (item) {
        return {
          idProducto: item.producto[TABLA.pk],
          categoria: item.producto.CATEGORIA,
          producto: item.producto['NOMBRE-PRODUCTO'],
          cantidad: item.cantidad,
          precio: item.producto.PRECIO,
          monto: item.producto.PRECIO * item.cantidad
        };
      })
    };
    var btnGuardar = document.getElementById('nuevo-pedido-btn-guardar');
    var msgGuardar = document.getElementById('nuevo-pedido-guardar-msg');
    if (btnGuardar) btnGuardar.disabled = true;
    if (msgGuardar) { msgGuardar.textContent = 'Guardando…'; msgGuardar.className = 'nuevo-pedido__guardar-msg'; }
    var bodyForm = 'data=' + encodeURIComponent(JSON.stringify(payload));
    var urlGuardar = (CORS_PROXY && CORS_PROXY.length > 0)
      ? CORS_PROXY + encodeURIComponent(APP_SCRIPT_URL)
      : APP_SCRIPT_URL;
    fetch(urlGuardar, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyForm
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var ct = res.headers.get('Content-Type') || '';
        if (ct.indexOf('json') !== -1) return res.json();
        return res.text().then(function (t) {
          try {
            return JSON.parse(t);
          } catch (err) {
            return { ok: false, error: t };
          }
        });
      })
      .then(function (data) {
        var ok = data && (data.ok === true || data.success === true);
        if (ok) {
          guardarResumenYRedirigir(payload);
          return;
        }
        mostrarMensajeGuardar(data && (data.error || data.mensaje) || 'Error al guardar.', true);
      })
      .catch(function (err) {
        var msg = err && err.message ? err.message : String(err);
        var esCors = /failed to fetch|networkerror|cors|blocked|access-control/i.test(msg);
        if (esCors) {
          guardarResumenYRedirigir(payload);
          return;
        }
        mostrarMensajeGuardar('Error: ' + msg, true);
      })
      .then(function () {
        actualizarEstadoGuardar();
      });
  }

  function mostrarMensajeGuardar(texto, esError) {
    var msg = document.getElementById('nuevo-pedido-guardar-msg');
    if (!msg) return;
    msg.textContent = texto;
    msg.className = 'nuevo-pedido__guardar-msg ' + (esError ? 'err' : 'ok');
  }

  function init() {
    var selectCliente = document.getElementById('nuevo-pedido-cliente');
    if (selectCliente) {
      selectCliente.addEventListener('change', function () {
        var val = (this.value || '').trim();
        clienteSeleccionado = null;
        if (val && clientes.length) {
          clienteSeleccionado = clientes.find(function (c) {
            return String(c[TABLA_CLIENTES.pk] || '').trim() === val;
          }) || null;
        }
        actualizarVistaCliente();
        actualizarEstadoGuardar();
      });
    }
    var btnCambiarCliente = document.getElementById('nuevo-pedido-btn-cambiar-cliente');
    if (btnCambiarCliente) {
      btnCambiarCliente.addEventListener('click', function () {
        window.location.href = '../Seleccionar-cliente/Seleccionar-cliente.html';
      });
    }
    var inputBuscar = document.getElementById('nuevo-pedido-buscar');
    if (inputBuscar) {
      inputBuscar.addEventListener('input', pintarListado);
      inputBuscar.addEventListener('keyup', pintarListado);
    }
    var btnLimpiar = document.getElementById('nuevo-pedido-btn-limpiar');
    if (btnLimpiar) {
      btnLimpiar.addEventListener('click', function () {
        var inp = document.getElementById('nuevo-pedido-buscar');
        if (inp) { inp.value = ''; inp.focus(); }
        pintarListado();
      });
    }
    var btnGuardar = document.getElementById('nuevo-pedido-btn-guardar');
    if (btnGuardar) btnGuardar.addEventListener('click', guardarPedido);
    cargarClientes();
    cargarProductos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
