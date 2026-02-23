const fs = require('fs');
const path = require('path');
const base = __dirname;
const logoSrc = fs.readFileSync(path.join(base, '_logo_src.txt'), 'utf8').trim();
const imgTag = '<img class="c-header__logo" src="' + logoSrc + '" alt="Logo Colombres">';
const nuevoPath = path.join(base, 'src', 'Pedidos', 'Nuevo-pedido', 'Nuevo-pedido.html');
let nuevoHtml = fs.readFileSync(nuevoPath, 'utf8');
const hasLogoImg = /<header[^>]*>[\s\S]*?<img[^>]*c-header__logo/.test(nuevoHtml);
if (!hasLogoImg) {
  const replacement = '<header class="c-header">\n  ' + imgTag + '\n  <div class="c-header__info">';
  nuevoHtml = nuevoHtml.replace(/(<header class="c-header">)\r?\n\s*(<div class="c-header__info">)/, '$1\n  ' + imgTag + '\n  $2');
  if (nuevoHtml.includes('<img class="c-header__logo"')) {
    fs.writeFileSync(nuevoPath, nuevoHtml);
    console.log('Logo agregado en Nuevo-pedido.html');
  }
}
