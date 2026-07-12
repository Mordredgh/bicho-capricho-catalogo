// ── MOCK DATA DEFAULT ──
const defaultProducts = [
  { name: "Taza Carita Feliz", category: "vasos", price: "Desde $189", desc: "Cerámica personalizada con nombre y color a elegir. El capricho perfecto para tu desayuno.", badge: "favorito", color: "lilac", mockClass: "mug", colors: ["lilac", "pink", "butter"] },
  { name: "Termo Bestie", category: "vasos", price: "Desde $349", desc: "Termo de acero con popote, nombre y diseño a tu medida. Un capricho térmico que te acompaña todo el día.", badge: "nuevo", color: "butter", mockClass: "tumbler-small", colors: ["butter", "pink", "lime", "sky"] },
  { name: "Playera Buena Vibra", category: "textil", price: "Desde $279", desc: "Playera suave con tu frase favorita, estampado único que se siente tuyo.", badge: "top-venta", badgePos: "top-right", color: "pink", mockClass: "tshirt", colors: ["pink", "lilac", "cream"] },
  { name: "Velita Apapacho", category: "detalles", price: "Desde $159", desc: "Vela aromática con etiqueta y dedicatoria personalizada. Un capricho que ilumina cualquier rincón.", badge: "promo", color: "lime", mockClass: "candle", colors: ["lime", "butter", "pink"] },
  { name: "Tote Bag Favorita", category: "personalizados", price: "Desde $219", desc: "Bolsa de algodón con frase, nombre o ilustración que le hace sonreír.", badge: "personalizado", badgePos: "top-right", color: "grape", mockClass: "tote", colors: ["grape", "lilac", "pink"] },
  { name: "Llavero Inicial", category: "detalles", price: "Desde $89", desc: "Acrílico con inicial, colores y dije a tu gusto. Pequeño detalle, enorme sorpresa.", badge: "ed-lim", badgePos: "top-right", color: "sky", mockClass: "keychain", colors: ["sky", "pink", "lime"] },
  
  // -- Nuevos de prueba para swipe --
  { name: "Sudadera Bordada", category: "textil", price: "Desde $549", desc: "Sudadera ultra cómoda con iniciales o fecha bordada al frente.", badge: "nuevo", badgePos: "top-left", color: "lilac", mockClass: "tshirt", colors: ["lilac", "pink", "butter"] },
  { name: "Libreta de Notas", category: "personalizados", price: "Desde $129", desc: "Libreta pasta dura con tu nombre en la portada. Perfecta para tus ideas.", badge: "", color: "lime", mockClass: "tote", colors: ["lime", "butter", "grape"] },
  { name: "Taza Mágica", category: "vasos", price: "Desde $210", desc: "La imagen aparece cuando viertes bebida caliente. ¡Ideal para sorpresas!", badge: "top-venta", color: "butter", mockClass: "mug", colors: ["butter", "lilac", "pink"] },
  { name: "Termo XL", category: "vasos", price: "Desde $450", desc: "Termo de gran capacidad para mantener tus bebidas frías por 24 horas.", badge: "env-grat", badgePos: "top-right", color: "sky", mockClass: "tumbler-small", colors: ["sky", "pink", "lime"] }
];

// ── INIT & STORAGE ──
let allProducts = [];
let filteredProducts = [];
const WA_NUMBER = localStorage.getItem('bc_wa') || '521234567890';

// Cambiar la imagen de la tarjeta al presionar swatches de colores (Fase 14)
window.changeCardImage = function(e, swatch, imgUrl) {
  if (e) e.stopPropagation(); // Evitar abrir el modal detallado del producto
  if (!imgUrl) return;
  const card = swatch.closest('.catalog-card');
  if (!card) return;
  const img = card.querySelector('.photo img');
  if (img) {
    img.src = imgUrl;
  }
  // Cambiar clase activa en los swatches de esta tarjeta
  card.querySelectorAll('.swatch-dot').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
};

// Convierte nombre de categoría a slug — usa el id de Supabase directamente si está disponible
function catToSlug(name, id) {
  if (id) return id; // Supabase category IDs ya son slugs limpios
  const n = (name || '').toLowerCase();
  return n.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
}

// JSON-LD Product schema para rich snippets — solo con productos reales de Supabase,
// nunca con defaultProducts (serían datos falsos indexados por Google).
function injectProductSchema(products) {
  const items = products
    .filter(p => p.name)
    .map((p, index) => {
      const price = p.priceMin > 0 ? p.priceMin : (parseFloat(String(p.price).replace(/[^\d.]/g, '')) || undefined);
      const product = {
        '@type': 'Product',
        name: p.name,
        description: p.desc || undefined,
        image: p.mainImage ? [p.mainImage] : undefined,
        category: p.category || undefined
      };
      if (price) {
        product.offers = {
          '@type': 'Offer',
          priceCurrency: 'MXN',
          price: price,
          availability: 'https://schema.org/InStock',
          url: 'https://catalogo.manekistore.com.mx/'
        };
      }
      return { '@type': 'ListItem', position: index + 1, item: product };
    });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items
  };

  let script = document.getElementById('product-schema');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

async function loadProducts() {
  // ── CATEGORÍAS DE SUPABASE (solo sincronizar labels, NO productos) ──
  if (typeof supaGet !== 'undefined') {
    try {
      const [categories, rows, colecciones] = await Promise.all([
        supaGet('categories', 'select=id,name,emoji,color&order=name'),
        supaGet('catalogo_productos', 'select=*&activo=eq.true&order=created_at.desc'),
        supaGet('catalogo_colecciones', 'select=id,nombre,emoji,descripcion,banner_url&order=nombre').catch(() => [])
      ]);

      categories.forEach(cat => {
        if (typeof catLabelLocal !== 'undefined') catLabelLocal[cat.id] = cat.name;
      });
      renderFilterButtons(categories);

      allProducts = rows.map(p => ({
        id:           p.id,
        name:         p.nombre || '',
        category:     p.cat || '',
        price:        p.precio || 'Consultar',
        priceMin:     parseFloat(p.price_min) || 0,
        priceMax:     parseFloat(p.price_max) || 0,
        desc:         p.descripcion || '',
        badge:        p.badge || '',
        badgePos:     p.badge_pos || 'top-left',
        color:        p.color_representativo || 'lilac',
        colors:       Array.isArray(p.colores) ? p.colores : [],
        mainImage:    p.foto || '',
        galleryImages: (() => { try { return JSON.parse(p.galeria || '[]'); } catch { return []; } })(),
        sizeGuide:    p.size_guide || 'none',
        freeShipping: p.free_shipping || false,
        mockClass:    p.mock_class || 'tote',
        coleccion:    p.coleccion || ''
      }));

      // Solo mostrar colecciones que de verdad tienen al menos un producto activo
      const coleccionesConProductos = colecciones.filter(c =>
        allProducts.some(p => p.coleccion === c.id)
      );
      _coleccionesData = coleccionesConProductos;
      renderColeccionFilterButtons(coleccionesConProductos);

      filteredProducts = [...allProducts];
      renderCatalog();
      injectProductSchema(allProducts);
      if (typeof calibrateSlider === 'function') calibrateSlider();
      applyColeccionFromUrl();
      return;
    } catch (e) {
      console.warn('Supabase no disponible, usando defaults:', e.message);
    }
  }

  // ── FALLBACK: solo defaults si Supabase no responde ──
  try {
    allProducts = [...defaultProducts];
    filteredProducts = [...allProducts];
    renderCatalog();
    if (typeof calibrateSlider === 'function') calibrateSlider();
  } catch (err) {
    document.getElementById('catalog-slider').innerHTML = `<p style="text-align:center;width:100%;padding:40px;color:red;font-weight:bold;">⚠️ Error interno: ${err.message}.</p>`;
  }
}

// ── RENDER CATALOG ──
function esc(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const badgeLabel = {
  nuevo:'Nuevo', oferta:'Oferta', promo:'Promo', favorito:'Favorito',
  personalizado:'Personalizado', 'top-venta':'Top venta',
  'ed-lim':'Ed. limitada', 'env-grat':'Envío gratis', agotado:'Agotado'
};
const catLabel = { vasos:'Vasos y tazas', textil:'Textil', detalles:'Detalles', personalizados:'Personalizados' };

function createCardHTML(p, index) {
  const tilt = index % 3 === 0 ? 'tilt-left' : index % 2 === 0 ? 'tilt-right' : '';
  const doodle = index % 2 !== 0 ? 'doodle-accent' : '';
  const pos = p.badgePos || 'top-left';
  const color = p.color || 'lilac';
  
  // Marcos dinámicos (estilo scrapbook)
  const frameClasses = ['frame-arch', 'frame-squircle', 'frame-asymmetric', 'frame-pill'];
  const frameClass = frameClasses[index % frameClasses.length];
  
  // Doodles superpuestos (estilo scrapbook)
  const doodlesList = [
    '<img class="card-doodle doodle-star" src="assets/doodles/doodle-asterisco.webp" alt="">',
    '<img class="card-doodle doodle-heart" src="assets/doodles/doodle-corazon-contorno.webp" alt="">',
    '<img class="card-doodle doodle-spiral" src="assets/doodles/doodle-espiral.webp" alt="">',
    ''
  ];
  const cardDoodle = doodlesList[index % doodlesList.length];

  // Washi Tapes coordinados por el color representativo del producto
  const colorTapeMap = {
    lilac: 'lilac',
    butter: 'yellow',
    pink: 'pink',
    lime: 'green',
    grape: 'grape',
    sky: 'sky'
  };
  const tapeColor = colorTapeMap[p.color] || 'lilac';
  const washiTapeHTML = `<div class="card-washi ${tapeColor}"></div>`;
  
  const photoContent = p.mainImage 
    ? `<img src="${p.mainImage}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="${p.name}">` 
    : `<div class="visual ${p.mockClass || 'tote'}"><span>Bicho</span></div><i class="confetti c1">✦</i>`;

  // Validar que el badge tenga un archivo correspondiente
  const validBadges = ['nuevo', 'oferta', 'personalizado', 'promo', 'top-venta', 'ed-lim', 'recomend', 'premium', 'env-grat', 'agotado', 'favorito'];
  // Mapeo de badges que no tienen archivo propio a uno existente
  const badgeFileMap = {
    'favorito': 'oferta',    // favorito usa el visual de oferta
  };
  const badgeFile = (p.badge && badgeFileMap[p.badge]) ? badgeFileMap[p.badge] : p.badge;
  const badgeHTML = (p.badge && validBadges.includes(p.badge)) ? `<div class="badge-official ${pos} ${p.badge}" style="background-image:url('assets/badges/badge-${badgeFile}.webp'); background-size:contain;"></div>` : '';
  
  const colorsHTML = p.colors && Array.isArray(p.colors) ? `
    <div class="card-swatches">
      ${p.colors.map((c, i) => {
        const isHex = c.startsWith('#');
        const styleAttr = isHex ? `style="background-color: ${c};"` : '';
        const classAttr = isHex ? '' : c;
        // La primera foto es la principal, las siguientes corresponden a la galería
        const targetImg = i === 0 ? p.mainImage : (p.galleryImages && p.galleryImages[i - 1]) || p.mainImage;
        const clickAttr = targetImg ? `onclick="changeCardImage(event, this, '${targetImg.replace(/'/g, "\\'")}')"` : 'onclick="event.stopPropagation();"';
        return `<span class="swatch-dot ${classAttr} ${i === 0 ? 'active' : ''}" ${styleAttr} ${clickAttr} title="Disponible en ${c}"></span>`;
      }).join('')}
    </div>
  ` : '';

  return `
    <article class="catalog-card ${tilt} ${doodle}" data-index="${index}">
      ${cardDoodle}
      ${washiTapeHTML}
      <div class="photo ${color} ${frameClass}">
        ${badgeHTML}
        ${photoContent}
      </div>
      <div class="card-body">
        <span class="category">${catLabel[p.category] || p.category}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        ${colorsHTML}
        <div class="price-row"><strong>${esc(p.price)}</strong><button aria-label="Pedir">Ver más <span>+</span></button></div>
      </div>
      <button class="card-compare-btn" data-name="${esc(p.name)}" aria-label="Comparar ${esc(p.name)}">📊 Comparar</button>
    </article>
  `;
}

function renderCatalog() {
  const slider = document.getElementById('catalog-slider');
  const dotsContainer = document.getElementById('slider-dots');
  
  if (filteredProducts.length === 0) {
    slider.innerHTML = `
      <div class="empty-state">
        <img src="assets/mascotas/STICKER/sticker pensando.webp" alt="Flik pensando">
        <h3>¡Ups! No encontramos ese capricho</h3>
        <p>Prueba buscando con palabras sencillas como "taza", "termo", "vela" o "bolsa".</p>
      </div>
    `;
    dotsContainer.innerHTML = '';
    const btnPrev = document.getElementById('slider-prev');
    const btnNext = document.getElementById('slider-next');
    if (btnPrev && btnNext) {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
    }
    return;
  }

  const chunks = [];
  for (let i = 0; i < filteredProducts.length; i += 8) {
    chunks.push(filteredProducts.slice(i, i + 8));
  }

  let html = '';
  let dots = '';
  chunks.forEach((chunk, pageIndex) => {
    html += `<div class="catalog-page" id="page-${pageIndex}"><div class="product-grid">`;
    // Bug #16 fix: use the filtered index offset instead of indexOf (which can return wrong result
    // when filteredProducts is a subset of allProducts with object references that may not match)
    const pageOffset = pageIndex * 8;
    chunk.forEach((p, chunkIdx) => {
      const originalIndex = allProducts.findIndex(ap => ap.name === p.name && ap.category === p.category);
      const displayIndex = originalIndex !== -1 ? originalIndex : pageOffset + chunkIdx;
      html += createCardHTML(p, displayIndex);
    });
    html += `</div></div>`;
    dots += `<div class="slider-dot ${pageIndex === 0 ? 'active' : ''}" data-target="page-${pageIndex}"></div>`;
  });

  slider.innerHTML = html;
  dotsContainer.innerHTML = chunks.length > 1 ? dots : '';

  document.querySelectorAll('.slider-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const page = document.getElementById(dot.dataset.target);
      slider.scrollTo({ left: page.offsetLeft, behavior: 'smooth' });
    });
  });

  slider.addEventListener('scroll', () => {
    const scrollLeft = slider.scrollLeft;
    const clientWidth = slider.clientWidth;
    
    let activeIndex = Math.round(scrollLeft / clientWidth);
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });

  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  if (btnPrev && btnNext) {
    btnPrev.style.display = chunks.length > 1 ? 'grid' : 'none';
    btnNext.style.display = chunks.length > 1 ? 'grid' : 'none';
    
    btnPrev.onclick = () => slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
    btnNext.onclick = () => slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
  }

  document.querySelectorAll('.catalog-card').forEach(card => {
    card.addEventListener('click', (e) => {
      spawnDoodleConfetti(e.pageX, e.pageY);
      const idx = card.dataset.index;
      openProductModal(allProducts[idx]);
    });
  });

  initCardParallax();
}

// ── FILTERS AND SEARCH ──
let currentCategory = 'todos';
let currentColeccion = 'todas';
let searchQuery = '';

function applyFiltersAndSearch() {
  let temp = allProducts;

  if (currentCategory !== 'todos') {
    temp = allProducts.filter(p => (p._slug || p.category) === currentCategory);
  }

  if (currentColeccion !== 'todas') {
    temp = temp.filter(p => p.coleccion === currentColeccion);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    temp = temp.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q)
    );
  }
  
  filteredProducts = temp;

  // Transición tipo hojeado de cuaderno (Page Flip)
  const slider = document.getElementById('catalog-slider');
  if (slider) {
    slider.classList.add('page-flip-out');
    setTimeout(() => {
      renderCatalog();
      slider.classList.remove('page-flip-out');
      slider.classList.add('page-flip-in');
      
      // Activar animaciones de items forzando un ligero desfase
      setTimeout(() => {
        document.querySelectorAll('.catalog-page').forEach(page => {
          page.classList.add('animate-items');
        });
      }, 50);

      setTimeout(() => {
        slider.classList.remove('page-flip-in');
      }, 350);
    }, 200);
  } else {
    renderCatalog();
    document.querySelectorAll('.catalog-page').forEach(page => {
      page.classList.add('animate-items');
    });
  }
}

const mascotMap = {
  'todos': 'assets/mascotas/REGALO/regalo saludando.webp',
  'vasos': 'assets/mascotas/TAZA/taza saludando.webp',
  'textil': 'assets/mascotas/PLAYERA/playera saludando.webp',
  'detalles': 'assets/mascotas/VELA/Vela saludando.webp',
  'personalizados': 'assets/mascotas/BOLSA/bolsa saludando.webp'
};

// Event delegation — funciona aunque los botones se regeneren dinámicamente
const filterContainer = document.querySelector('.filters');
if (filterContainer) {
  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    filterContainer.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.filter;
    const mascotImg = document.getElementById('cat-mascot-img');
    if (mascotImg && mascotMap[currentCategory]) {
      mascotImg.src = mascotMap[currentCategory];
    }
    applyFiltersAndSearch();
  });
}

function renderFilterButtons(categories) {
  if (!filterContainer || !categories.length) return;
  filterContainer.innerHTML = `<button class="filter active" data-filter="todos"><span class="filter-all">✦</span> Todo</button>`;
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter';
    btn.dataset.filter = cat.id;
    btn.textContent = `${cat.emoji || ''} ${cat.name}`;
    filterContainer.appendChild(btn);
  });
  currentCategory = 'todos';
}

// ── FILTRO DE COLECCIONES ──
const coleccionFilterContainer = document.getElementById('colecciones-filters');
const coleccionBannerEl = document.getElementById('coleccion-banner');
let _coleccionesData = [];

if (coleccionFilterContainer) {
  coleccionFilterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    setColeccionActiva(btn.dataset.coleccion);
  });
}

function setColeccionActiva(id) {
  currentColeccion = id;
  if (coleccionFilterContainer) {
    coleccionFilterContainer.querySelectorAll('.filter').forEach(b => {
      b.classList.toggle('active', b.dataset.coleccion === id);
    });
  }
  renderColeccionBanner(id);
  applyFiltersAndSearch();
}

function renderColeccionBanner(id) {
  if (!coleccionBannerEl) return;
  const c = id !== 'todas' ? _coleccionesData.find(x => x.id === id) : null;
  if (!c || (!c.descripcion && !c.banner_url)) {
    coleccionBannerEl.style.display = 'none';
    coleccionBannerEl.innerHTML = '';
    return;
  }
  coleccionBannerEl.style.display = '';
  coleccionBannerEl.innerHTML = `
    ${c.banner_url ? `<img src="${c.banner_url}" alt="${esc(c.nombre)}" loading="lazy" style="width:100%;max-height:260px;object-fit:cover;border-radius:20px;margin-bottom:14px;">` : ''}
    <div style="text-align:center;margin-bottom:18px;">
      <strong style="font-family:'Fredoka',sans-serif;font-size:20px;">${c.emoji || '🎬'} ${esc(c.nombre)}</strong>
      ${c.descripcion ? `<p style="margin-top:6px;color:var(--olive);max-width:560px;margin-left:auto;margin-right:auto;">${esc(c.descripcion)}</p>` : ''}
    </div>
  `;
}

// Permite compartir un link directo a una colección: ?coleccion=mario-movie
function applyColeccionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const target = params.get('coleccion');
  if (!target) return;
  const exists = _coleccionesData.some(c => c.id === target);
  if (!exists) return;
  setColeccionActiva(target);
  const catalogSection = document.getElementById('catalogo');
  if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderColeccionFilterButtons(colecciones) {
  if (!coleccionFilterContainer) return;
  if (!colecciones.length) {
    coleccionFilterContainer.style.display = 'none';
    coleccionFilterContainer.innerHTML = '';
    currentColeccion = 'todas';
    return;
  }
  coleccionFilterContainer.style.display = '';
  coleccionFilterContainer.innerHTML = `<button class="filter active" data-coleccion="todas"><span class="filter-all">✦</span> Todas las colecciones</button>`;
  colecciones.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'filter';
    btn.dataset.coleccion = c.id;
    btn.textContent = `${c.emoji || '🎬'} ${c.nombre}`;
    coleccionFilterContainer.appendChild(btn);
  });
  currentColeccion = 'todas';
}

// Search input events with debounce (#22)
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
let _searchDebounceTimer = null;

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchClear) {
      searchClear.style.display = searchQuery.length > 0 ? 'block' : 'none';
    }
    clearTimeout(_searchDebounceTimer);
    _searchDebounceTimer = setTimeout(() => {
      applyFiltersAndSearch();
    }, 300);
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    applyFiltersAndSearch();
  });
}

// ── MODAL LOGIC ──
let modalImages = [];
let currentImageIndex = 0;

function openProductModal(product) {
  const modal = document.getElementById('p-modal-overlay');
  
  document.getElementById('pm-title').textContent = product.name;
  const pmCatText = catLabel[product.category] || product.category;
  document.getElementById('pm-category').textContent = product.coleccion
    ? `${pmCatText} · Colección: ${product.coleccion}`
    : pmCatText;
  document.getElementById('pm-desc').textContent = product.desc;
  document.getElementById('pm-price').textContent = product.price;

  const msg = encodeURIComponent(`Hola, me encantó ${product.name}. ¿Me compartes más información?`);
  document.getElementById('pm-wa-btn').href = `https://wa.me/${WA_NUMBER}?text=${msg}`;

  // Recomendaciones de Cuidado dinámicas
  const careContainer = document.getElementById('pm-care-instructions');
  if (careContainer) {
    let careHTML = '';
    if (product.category === 'vasos') {
      careHTML = `
        <div class="care-box">
          <strong>🧼 Recomendación de Cuidado:</strong>
          <p>Lavar a mano con esponja suave · Evitar el uso de fibras metálicas · No apto para microondas o lavavajillas.</p>
        </div>
      `;
    } else if (product.category === 'textil') {
      careHTML = `
        <div class="care-box">
          <strong>🧼 Recomendación de Cuidado:</strong>
          <p>Lavar al revés con agua fría · No usar secadora ni blanqueador · Planchar del revés (nunca directo sobre el estampado).</p>
        </div>
      `;
    } else {
      careHTML = `
        <div class="care-box">
          <strong>🧼 Recomendación de Cuidado:</strong>
          <p>Limpiar con un paño suave y seco · Tratar con amor y evitar caídas o humedad extrema.</p>
        </div>
      `;
    }
    careContainer.innerHTML = careHTML;
  }

  // Cross-Sell: productos relacionados (Fase 14)
  const crossSellContainer = document.getElementById('pm-crosssell-container');
  if (crossSellContainer) {
    crossSellContainer.innerHTML = buildCrossSell(product);
  }

  // Guía de Medidas dinámica (Fase 14 - Presets del Admin)
  const sgContainer = document.getElementById('pm-size-guide-container');
  if (sgContainer) {
    // Determinar qué guía mostrar (fallback a 'playera' si el producto es textil y no tiene guía asignada)
    let guide = product.sizeGuide;
    if (!guide || guide === 'none') {
      if (product.category === 'textil') {
        guide = 'playera';
      } else {
        guide = 'none';
      }
    }

    if (guide !== 'none') {
      let guideHTML = '';
      if (guide === 'playera') {
        guideHTML = `
          <div class="size-guide-accordion">
            <button class="sg-toggle-btn" id="sg-toggle-btn">
              <span>📏 Guía de Medidas: Playera (Tallas)</span>
              <span class="sg-arrow">▼</span>
            </button>
            <div class="sg-content" id="sg-content">
              <div class="sg-table-wrapper">
                <table class="sg-table">
                  <thead>
                    <tr>
                      <th>Talla</th>
                      <th>Ancho (A)</th>
                      <th>Alto (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>CH (S)</strong></td><td>47 cm</td><td>68 cm</td></tr>
                    <tr><td><strong>M</strong></td><td>50 cm</td><td>71 cm</td></tr>
                    <tr><td><strong>G (L)</strong></td><td>53 cm</td><td>73 cm</td></tr>
                    <tr><td><strong>EG (XL)</strong></td><td>56 cm</td><td>76 cm</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="sg-note">* Medidas aproximadas (pueden variar ±1.5 cm) tomadas con la prenda extendida sobre una superficie plana.</p>
            </div>
          </div>
        `;
      } else if (guide === 'sudadera') {
        guideHTML = `
          <div class="size-guide-accordion">
            <button class="sg-toggle-btn" id="sg-toggle-btn">
              <span>📏 Guía de Medidas: Sudadera (Tallas)</span>
              <span class="sg-arrow">▼</span>
            </button>
            <div class="sg-content" id="sg-content">
              <div class="sg-table-wrapper">
                <table class="sg-table">
                  <thead>
                    <tr>
                      <th>Talla</th>
                      <th>Ancho (A)</th>
                      <th>Alto (B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>CH (S)</strong></td><td>50 cm</td><td>65 cm</td></tr>
                    <tr><td><strong>M</strong></td><td>54 cm</td><td>68 cm</td></tr>
                    <tr><td><strong>G (L)</strong></td><td>58 cm</td><td>71 cm</td></tr>
                    <tr><td><strong>EG (XL)</strong></td><td>62 cm</td><td>74 cm</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="sg-note">* Medidas aproximadas (pueden variar ±1.5 cm) tomadas con la prenda extendida sobre una superficie plana.</p>
            </div>
          </div>
        `;
      } else if (guide === 'taza') {
        guideHTML = `
          <div class="size-guide-accordion">
            <button class="sg-toggle-btn" id="sg-toggle-btn">
              <span>📏 Guía de Capacidad: Taza / Termo</span>
              <span class="sg-arrow">▼</span>
            </button>
            <div class="sg-content" id="sg-content">
              <div class="sg-table-wrapper">
                <table class="sg-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Capacidad</th>
                      <th>Medidas (Alto x Diámetro)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Taza Estándar</strong></td><td>11 oz (325 ml)</td><td>9.5 cm x 8.0 cm</td></tr>
                    <tr><td><strong>Taza Grande</strong></td><td>15 oz (440 ml)</td><td>12.0 cm x 8.5 cm</td></tr>
                    <tr><td><strong>Termo</strong></td><td>16 oz (470 ml)</td><td>16.5 cm x 7.2 cm</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="sg-note">* Capacidad sugerida para tu bebida favorita de Bicho Capricho.</p>
            </div>
          </div>
        `;
      }

      sgContainer.innerHTML = guideHTML;

      const toggleBtn = document.getElementById('sg-toggle-btn');
      const content = document.getElementById('sg-content');
      if (toggleBtn && content) {
        // Vinculación de acordéon con accesibilidad ARIA
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', 'sg-content');
        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', 'sg-toggle-btn');
        content.setAttribute('hidden', '');

        toggleBtn.addEventListener('click', () => {
          const isOpen = content.classList.contains('open');
          if (isOpen) {
            content.classList.remove('open');
            toggleBtn.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            content.setAttribute('hidden', '');
          } else {
            content.classList.add('open');
            toggleBtn.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            content.removeAttribute('hidden');
          }
        });
      }
    } else {
      sgContainer.innerHTML = '';
    }
  }

  // Vincular botón de añadir a mi lista del modal
  const addListBtn = document.getElementById('pm-add-list-btn');
  if (addListBtn) {
    addListBtn.onclick = (e) => {
      // Lanzar animación de desempacado (Unboxing) volando a la wishlist
      runUnboxingAnimation(addListBtn, product);
      
      spawnDoodleConfetti(e.pageX, e.pageY);
      showStampAnimation(); // 🏷️ Efecto sello (Fase 14)
      addToWishlist(product);
      closeProductModal();
    };
  }

  modalImages = [];
  if (product.mainImage) modalImages.push(product.mainImage);
  if (product.galleryImages && product.galleryImages.length > 0) {
    modalImages = modalImages.concat(product.galleryImages);
  }
  
  if (modalImages.length === 0) {
    modalImages = ['assets/favicon-180.png'];
  }
  
  currentImageIndex = 0;
  renderModalCarousel();
  modal.classList.add('open');
}

function renderModalCarousel() {
  const carousel = document.getElementById('pm-carousel');
  const dotsContainer = document.getElementById('pm-dots');
  
  carousel.innerHTML = modalImages.map(src => `<img src="${src}" class="pm-carousel-img">`).join('');
  
  if (modalImages.length > 1) {
    dotsContainer.innerHTML = modalImages.map((_, i) => `<div class="pm-dot ${i === 0 ? 'active' : ''}"></div>`).join('');
    document.getElementById('pm-prev').style.display = 'block';
    document.getElementById('pm-next').style.display = 'block';
  } else {
    dotsContainer.innerHTML = '';
    document.getElementById('pm-prev').style.display = 'none';
    document.getElementById('pm-next').style.display = 'none';
  }
  
  updateCarouselPos();
}

function updateCarouselPos() {
  const carousel = document.getElementById('pm-carousel');
  carousel.style.transform = `translateX(-${currentImageIndex * 100}%)`;
  
  document.querySelectorAll('.pm-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentImageIndex);
  });
}

document.getElementById('pm-prev').addEventListener('click', () => {
  if (modalImages.length <= 1) return;
  currentImageIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length;
  updateCarouselPos();
});
document.getElementById('pm-next').addEventListener('click', () => {
  if (modalImages.length <= 1) return;
  currentImageIndex = (currentImageIndex + 1) % modalImages.length;
  updateCarouselPos();
});

function closeProductModal() {
  const overlay = document.getElementById('p-modal-overlay');
  // Animación elástica de cierre (Fase 14)
  overlay.classList.add('closing');
  setTimeout(() => {
    overlay.classList.remove('open', 'closing');
  }, 380);
}
document.getElementById('p-modal-close').addEventListener('click', closeProductModal);
document.getElementById('p-modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'p-modal-overlay') closeProductModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProductModal();
});

// ── SURPRISE MODAL LOGIC ──
function showSurpriseProduct() {
  if (allProducts.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * allProducts.length);
  const product = allProducts[randomIndex];
  
  const previewContainer = document.getElementById('sm-product-preview');
  if (previewContainer) {
    const isHex = product.colors && Array.isArray(product.colors) && product.colors[0] && product.colors[0].startsWith('#');
    const colorStyle = isHex ? `style="background-color: ${product.colors[0]}"` : '';
    const colorClass = isHex ? '' : (product.colors && product.colors[0] || 'lilac');
    
    const photoHTML = product.mainImage
      ? `<img src="${product.mainImage}" alt="${product.name}" class="smp-img">`
      : `<div class="smp-visual ${product.mockClass || 'tote'}"><span>Bicho</span></div>`;
      
    previewContainer.innerHTML = `
      <div class="smp-card">
        <div class="smp-photo ${colorClass}" ${colorStyle}>
          ${photoHTML}
        </div>
        <div class="smp-body">
          <span class="smp-category">${catLabel[product.category] || product.category}</span>
          <h4>${product.name}</h4>
          <p>${product.price}</p>
        </div>
      </div>
    `;
    
    const viewBtn = document.getElementById('sm-view-btn');
    if (viewBtn) {
      viewBtn.onclick = () => {
        closeSurpriseModal();
        openProductModal(product);
      };
    }
  }
  
  const overlay = document.getElementById('surprise-modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeSurpriseModal() {
  const overlay = document.getElementById('surprise-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}

const floatSurprise = document.getElementById('floating-surprise');
if (floatSurprise) {
  floatSurprise.addEventListener('click', showSurpriseProduct);
}
const closeSurprise = document.getElementById('surprise-modal-close');
if (closeSurprise) {
  closeSurprise.addEventListener('click', closeSurpriseModal);
}
const rerollSurprise = document.getElementById('sm-reroll-btn');
if (rerollSurprise) {
  rerollSurprise.addEventListener('click', showSurpriseProduct);
}
const overlaySurprise = document.getElementById('surprise-modal-overlay');
if (overlaySurprise) {
  overlaySurprise.addEventListener('click', e => {
    if (e.target.id === 'surprise-modal-overlay') closeSurpriseModal();
  });
}
loadProducts().catch(err => console.error('loadProducts error:', err));

// Enlazar dinámicamente el botón flotante de WhatsApp con el número configurado
const floatingWaBtn = document.getElementById('floating-wa-btn');
if (floatingWaBtn) {
  floatingWaBtn.href = `https://wa.me/${WA_NUMBER}`;
}

// ── EFECTO HOVER 3D (PARALLAX) EN TARJETAS ──
function initCardParallax() {
  // Respetar preferencia de reducir movimiento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.catalog-card');
  cards.forEach(card => {
    const isTiltLeft = card.classList.contains('tilt-left');
    const isTiltRight = card.classList.contains('tilt-right');
    const baseRotation = isTiltLeft ? -1 : isTiltRight ? 1 : 0;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      
      const xc = (x / width) - 0.5;
      const yc = (y / height) - 0.5;
      
      const rotateY = xc * 20; 
      const rotateX = -yc * 20;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      card.style.boxShadow = `0px 20px 30px rgba(28, 79, 50, 0.16)`;
      card.style.transition = 'none';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) rotate(${baseRotation}deg)`;
      card.style.boxShadow = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });
  });
}

// ── MICRO-ANIMACIÓN: CONFETI DE DOODLES DEL CURSOR ──
function spawnDoodleConfetti(x, y) {
  // Respetar preferencia de reducir movimiento
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const particleCount = 10;
  const symbols = ['✦', '♥', '★', '✿', '★'];
  const colors = ['#ffb4c8', '#ffd166', '#dfbfff', '#c3ec9f']; // Rosa chicle, Mantequilla, Lavanda, Lima
  
  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('i');
    el.className = 'd-confetti-particle';
    
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = `${Math.floor(Math.random() * 16) + 12}px`;
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.floor(Math.random() * 80) + 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 50; 
    const rot = Math.floor(Math.random() * 360) + 180;
    
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.setProperty('--rot', `${rot}deg`);
    
    document.body.appendChild(el);
    
    setTimeout(() => {
      el.remove();
    }, 800);
  }
}

// Bindings de confeti en elementos interactivos
const waBtn = document.getElementById('pm-wa-btn');
if (waBtn) {
  waBtn.addEventListener('click', (e) => {
    spawnDoodleConfetti(e.pageX, e.pageY);
  });
}
const floatBtn = document.getElementById('floating-surprise');
if (floatBtn) {
  floatBtn.addEventListener('click', (e) => {
    spawnDoodleConfetti(e.pageX, e.pageY);
  });
}
const rerollBtn = document.getElementById('sm-reroll-btn');
if (rerollBtn) {
  rerollBtn.addEventListener('click', (e) => {
    spawnDoodleConfetti(e.pageX, e.pageY);
  });
}

// ── LÓGICA DE LA "LISTA DE CAPRICHOS" (WISHLIST) ──
let wishlist = [];

function loadWishlist() {
  const stored = localStorage.getItem('bicho_wishlist');
  if (stored) {
    try {
      wishlist = JSON.parse(stored);
      if (!Array.isArray(wishlist)) wishlist = [];
    } catch (e) {
      wishlist = [];
    }
  }
  updateWishlistUI();
}

function saveWishlist() {
  try {
    localStorage.setItem('bicho_wishlist', JSON.stringify(wishlist));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.warn('⚠️ Almacenamiento lleno. Wishlist no guardada. Intenta borrar caché del navegador.');
      alert('⚠️ Memoria del navegador llena. Tu lista no se guardó automáticamente. Intenta borrar caché o usa "Enviar cotización" antes de cerrar.');
    } else {
      console.error('Error al guardar wishlist:', e);
    }
  }
}

function updateWishlistUI() {
  const count = wishlist.reduce((acc, item) => acc + item.quantity, 0);
  const countEl = document.getElementById('fw-count');
  if (countEl) {
    countEl.textContent = count;
  }
  
  const itemsContainer = document.getElementById('wishlist-items');
  if (itemsContainer) {
    if (wishlist.length === 0) {
      itemsContainer.innerHTML = `
        <div class="wl-empty-state">
          <span class="wl-empty-emoji">🎁</span>
          <p>Tu lista de caprichos está vacía.</p>
          <small>Navega por el catálogo y añade tus productos favoritos con el botón ✨.</small>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = wishlist.map(item => {
        const itemImageHTML = item.mainImage 
          ? `<img src="${item.mainImage}" alt="${item.name}" class="wli-img">`
          : `<div class="wli-visual"><span>✦</span></div>`;
          
        return `
          <div class="wl-item">
            ${itemImageHTML}
            <div class="wli-info">
              <h4>${item.name}</h4>
              <p>${item.price}</p>
            </div>
            <div class="wli-actions">
              <div class="wli-qty">
                <button class="qty-btn" onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
              </div>
              <button class="wli-remove-btn" onclick="removeFromWishlist('${item.name.replace(/'/g, "\\'")}')" title="Eliminar">🗑️</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  
  const quoteBtn = document.getElementById('wl-quote-btn');
  if (quoteBtn) {
    if (wishlist.length === 0) {
      quoteBtn.href = '#';
      quoteBtn.classList.add('disabled');
      quoteBtn.style.opacity = '0.5';
      quoteBtn.style.pointerEvents = 'none';
    } else {
      quoteBtn.classList.remove('disabled');
      quoteBtn.style.opacity = '1';
      quoteBtn.style.pointerEvents = 'all';
      
      const itemsListMsg = wishlist.map(item => `• ${item.quantity}x ${item.name} (${item.price})`).join('\n');
      const fullMsg = `Hola! Me encantaría cotizar estos caprichos de mi lista: \n\n${itemsListMsg}\n\n¿Me compartes detalles de disponibilidad y entregas? 💖`;
      quoteBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(fullMsg)}`;
    }
  }
}

function addToWishlist(product) {
  const existing = wishlist.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    wishlist.push({
      name: product.name,
      price: product.price,
      mainImage: product.mainImage,
      category: product.category,
      quantity: 1
    });
  }
  saveWishlist();
  updateWishlistUI();
  
  const floatWidget = document.getElementById('floating-wishlist');
  if (floatWidget) {
    floatWidget.classList.add('bounce-active');
    setTimeout(() => {
      floatWidget.classList.remove('bounce-active');
    }, 600);
  }
}

function changeQuantity(productName, delta) {
  const item = wishlist.find(item => item.name === productName);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      wishlist = wishlist.filter(i => i.name !== productName);
    }
    saveWishlist();
    updateWishlistUI();
  }
}

function removeFromWishlist(productName) {
  wishlist = wishlist.filter(item => item.name !== productName);
  saveWishlist();
  updateWishlistUI();
}

function clearWishlist() {
  wishlist = [];
  saveWishlist();
  updateWishlistUI();
}

// Registrar funciones globales para interactuar con atributos onclick en el HTML inyectado
window.changeQuantity = changeQuantity;
window.removeFromWishlist = removeFromWishlist;

// Vincular overlays y click events de apertura/cierre
const openWishlistBtn = document.getElementById('floating-wishlist');
const closeWishlistBtn = document.getElementById('wishlist-close');
const wishlistOverlay = document.getElementById('wishlist-overlay');
const clearWishlistBtn = document.getElementById('wl-clear-btn');

if (openWishlistBtn && wishlistOverlay) {
  openWishlistBtn.addEventListener('click', () => {
    wishlistOverlay.classList.add('open');
  });
}
if (closeWishlistBtn && wishlistOverlay) {
  closeWishlistBtn.addEventListener('click', () => {
    wishlistOverlay.classList.remove('open');
  });
}
if (wishlistOverlay) {
  wishlistOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'wishlist-overlay') {
      wishlistOverlay.classList.remove('open');
    }
  });
}
if (clearWishlistBtn) {
  clearWishlistBtn.addEventListener('click', clearWishlist);
}

// Iniciar lista al cargar
loadWishlist();


// ════════════════════════════════════════════════════════
//  FASE 14 — NUEVAS FUNCIONES Y ANIMACIONES
// ════════════════════════════════════════════════════════


// ── B. EFECTO TYPEWRITER EN HERO ────────────────────
function initTypewriter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const words = ['regalo', 'capricho', 'detalle', 'sorpresa', 'momento'];
  const el = document.getElementById('hero-typewriter-text');
  if (!el) return;

  let wordIndex = 0;
  let charIndex  = 0;
  let deleting   = false;
  let pauseTimer = null;

  function type() {
    const word = words[wordIndex];
    if (!deleting) {
      el.textContent = word.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) {
        el.classList.add('tw-done');
        pauseTimer = setTimeout(() => { deleting = true; el.classList.remove('tw-done'); type(); }, 2200);
        return;
      }
    } else {
      el.textContent = word.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 60 : 110);
  }

  setTimeout(type, 1000); // empieza 1s después de cargar
}
initTypewriter();


// ── G. PARTÍCULAS FLOTANTES EN HERO ────────────────
function initHeroParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const symbols = ['✦', '♥', '★', '✿', '♥'];
  const colors  = ['#ffb4c8', '#ffd166', '#dfbfff', '#c3ec9f', '#ffffff'];
  let particles = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function mkParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      sym:  symbols[Math.floor(Math.random() * symbols.length)],
      col:  colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8,
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   -(Math.random() * 0.6 + 0.2),
      alpha: Math.random() * 0.5 + 0.3,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.02,
    };
  }

  for (let i = 0; i < 28; i++) particles.push(mkParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.col;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillText(p.sym, 0, 0);
      ctx.restore();

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;

      if (p.y < -20) { Object.assign(p, mkParticle(), { y: canvas.height + 10 }); }
    });
    raf = requestAnimationFrame(draw);
  }
  draw();

  // Pausar cuando no es visible (performance)
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { draw(); } else { cancelAnimationFrame(raf); }
  }, { threshold: 0 });
  observer.observe(canvas);
}
initHeroParticles();


// ── E. EFECTO SELLO '!¡CAPRICHO AÑADIDO!' ──────
function showStampAnimation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.getElementById('stamp-overlay');
  if (!el) return;
  el.classList.remove('active');
  void el.offsetWidth; // force reflow
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 1800);
}


// ── D. SUGERENCIAS INTELIGENTES DE BÚSQL. ──────
const suggestionsEl = document.getElementById('search-suggestions');
const catLabelLocal = {
  vasos: 'Vasos y tazas', textil: 'Textil',
  detalles: 'Detalles', personalizados: 'Personalizados'
};

function renderSuggestions(query) {
  if (!suggestionsEl) return;
  const q = query.trim().toLowerCase();
  if (q.length < 2) { hideSuggestions(); return; }

  const matches = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.desc  && p.desc.toLowerCase().includes(q)) ||
    (catLabelLocal[p.category] && catLabelLocal[p.category].toLowerCase().includes(q))
  ).slice(0, 6);

  if (matches.length === 0) { hideSuggestions(); return; }

  suggestionsEl.innerHTML = matches.map((p, i) => {
    const thumb = p.mainImage
      ? `<img class="suggestion-thumb" src="${p.mainImage}" alt="" loading="lazy">`
      : `<div class="suggestion-thumb-placeholder">✦</div>`;
    return `
      <div class="suggestion-item" role="option" aria-selected="false" data-idx="${i}"
           tabindex="0" onclick="pickSuggestion('${p.name.replace(/'/g, "\\'")}')"
           onkeydown="if(event.key==='Enter') pickSuggestion('${p.name.replace(/'/g, "\\'")}')"
      >
        ${thumb}
        <div class="suggestion-info">
          <span class="suggestion-name">${p.name}</span>
          <span class="suggestion-cat">${catLabelLocal[p.category] || p.category}</span>
        </div>
        <span class="suggestion-price">${p.price}</span>
      </div>`;
  }).join('');

  suggestionsEl.classList.add('visible');
}

function hideSuggestions() {
  if (suggestionsEl) suggestionsEl.classList.remove('visible');
}

window.pickSuggestion = function(name) {
  const inp = document.getElementById('search-input');
  if (inp) { inp.value = name; }
  hideSuggestions();
  searchQuery = name;
  applyFiltersAndSearch();
  // Abrir el modal del producto directamente si solo hay uno
  const match = allProducts.find(p => p.name === name);
  if (match) setTimeout(() => openProductModal(match), 200);
};

// Vincular al input existente (que ya tiene debounce)
const _origSearchInput = document.getElementById('search-input');
if (_origSearchInput) {
  _origSearchInput.addEventListener('input', (e) => renderSuggestions(e.target.value));
  _origSearchInput.addEventListener('focus', (e) => renderSuggestions(e.target.value));
  _origSearchInput.addEventListener('blur',  () => setTimeout(hideSuggestions, 200));
}


// ── A. CROSS-SELL EN MODAL ────────────────────
function buildCrossSell(product) {
  if (!allProducts || allProducts.length < 2) return '';

  // Priorizar misma categoría, luego cualquier otro producto
  const related = allProducts
    .filter(p => p.name !== product.name)
    .sort((a, b) => {
      const aMatch = a.category === product.category ? -1 : 1;
      const bMatch = b.category === product.category ? -1 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 3);

  if (related.length === 0) return '';

  const cards = related.map(p => {
    const thumb = p.mainImage
      ? `<img src="${p.mainImage}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="cs-visual">✦</div>`;
    return `<div class="crosssell-card" onclick="openProductModal(window.__csProducts['${p.name.replace(/'/g, "\\'")}'?p.name:p.name]); closeProductModal(); setTimeout(()=>openProductModal(window.__allProd.find(x=>x.name==='${p.name.replace(/'/g, "\\'")}')), 420)">
      ${thumb}
      <span>${esc(p.name)}</span>
    </div>`;
  }).join('');

  return `<div class="pm-crosssell">
    <h4>❤️ También te puede gustar</h4>
    <div class="pm-crosssell-list">${cards}</div>
  </div>`;
}
// Exponer allProducts para el cross-sell onclick
Object.defineProperty(window, '__allProd', { get: () => allProducts });


// ── C. PARALLAX EN SCROLL ─────────────────────
function initScrollParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = [
    { el: document.querySelector('.custom-section'), speed: 0.06 },
    { el: document.querySelector('.benefits'),       speed: 0.04 },
    { el: document.querySelector('.faq-section'),    speed: 0.03 },
  ].filter(s => s.el !== null);

  if (sections.length === 0) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        sections.forEach(({ el, speed }) => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const offset = (center - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
initScrollParallax();


// ── B. COMPARADOR DE PRODUCTOS ────────────────
let compareList = []; // máx 3 productos

function toggleCompare(productName) {
  const product = allProducts.find(p => p.name === productName);
  if (!product) return;

  const idx = compareList.findIndex(p => p.name === productName);
  if (idx !== -1) {
    compareList.splice(idx, 1);
  } else {
    if (compareList.length >= 3) {
      // Feedback visual: sacude el botón
      const btn = document.querySelector(`.card-compare-btn[data-name="${CSS.escape(productName)}"]`);
      if (btn) { btn.textContent = '¡Máx 3!'; setTimeout(() => { btn.textContent = '📊 Comparar'; }, 1200); }
      return;
    }
    compareList.push(product);
  }
  updateCompareBar();
  updateCompareButtons();
}

function updateCompareBar() {
  const bar   = document.getElementById('compare-bar');
  const slots = document.getElementById('compare-slots');
  if (!bar || !slots) return;

  if (compareList.length === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'block';

  slots.innerHTML = compareList.map(p => `
    <div class="compare-slot filled">
      ${p.name.length > 14 ? p.name.slice(0, 13) + '…' : p.name}
      <span class="compare-slot-remove" onclick="toggleCompare('${p.name.replace(/'/g, "\\'")}')">x</span>
    </div>`);
  // Pad empty slots up to 3
  for (let i = compareList.length; i < 3; i++) {
    slots.innerHTML += `<div class="compare-slot">— vacío —</div>`;
  }
}

function updateCompareButtons() {
  document.querySelectorAll('.card-compare-btn').forEach(btn => {
    const name = btn.dataset.name;
    const inList = compareList.some(p => p.name === name);
    btn.classList.toggle('added', inList);
    btn.textContent = inList ? '✔ Comparando' : '📊 Comparar';
  });
}

function openComparePanel() {
  const overlay = document.getElementById('compare-panel-overlay');
  const grid    = document.getElementById('compare-grid');
  if (!overlay || !grid) return;

  grid.innerHTML = compareList.map(p => {
    const imgHTML = p.mainImage
      ? `<img class="compare-col-img" src="${p.mainImage}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="compare-col-visual">✦</div>`;

    const swatches = (p.colors && p.colors.length)
      ? `<div class="compare-col-swatches">${p.colors.map(c => {
          const isHex = c.startsWith('#');
          return `<span class="swatch-dot ${isHex ? '' : c}" ${isHex ? `style="background:${c}"` : ''} title="${c}"></span>`;
        }).join('')}</div>`
      : '';

    return `<div class="compare-col">
      ${imgHTML}
      <div class="compare-col-body">
        <span class="cc-cat">${catLabelLocal[p.category] || p.category}</span>
        <h4>${esc(p.name)}</h4>
        <div class="cc-price">${esc(p.price)}</div>
        <p>${esc(p.desc || '')}</p>
        ${swatches}
      </div>
    </div>`;
  }).join('');

  overlay.classList.add('open');
}

// Bindings del comparador
document.addEventListener('click', e => {
  const btn = e.target.closest('.card-compare-btn');
  if (btn) {
    e.stopPropagation();
    toggleCompare(btn.dataset.name);
  }
});

const _compareViewBtn  = document.getElementById('compare-view-btn');
const _compareClearBtn = document.getElementById('compare-clear-btn');
const _comparePanelClose = document.getElementById('compare-panel-close');
const _comparePanelOverlay = document.getElementById('compare-panel-overlay');

if (_compareViewBtn)  _compareViewBtn.addEventListener('click', openComparePanel);
if (_compareClearBtn) _compareClearBtn.addEventListener('click', () => {
  compareList = [];
  updateCompareBar();
  updateCompareButtons();
});
if (_comparePanelClose) _comparePanelClose.addEventListener('click', () => _comparePanelOverlay.classList.remove('open'));
if (_comparePanelOverlay) _comparePanelOverlay.addEventListener('click', e => {
  if (e.target === _comparePanelOverlay) _comparePanelOverlay.classList.remove('open');
});


// ── K. FILTROS AVANZADOS (FASE 14 — OPCIÓN A) ────────────────────────────

// Estado de los filtros avanzados
let advPriceMin    = 0;
let advPriceMax    = 2000;
let advFreeShip    = false;

// Referencias al DOM
const _advToggle   = document.getElementById('adv-toggle');
const _advPanel    = document.getElementById('adv-panel');
const _advChevron  = document.getElementById('adv-chevron');
const _advClear    = document.getElementById('adv-clear');
const _thumbMin    = document.getElementById('price-thumb-min');
const _thumbMax    = document.getElementById('price-thumb-max');
const _fill        = document.getElementById('price-fill');
const _labelMin    = document.getElementById('price-label-min');
const _labelMax    = document.getElementById('price-label-max');
const _freeShip    = document.getElementById('filter-free-shipping');

// Ajustar el máximo del slider según los productos reales una vez cargados
function calibrateSlider() {
  const prices = allProducts
    .map(p => p.priceMax || p.priceMin || 0)
    .filter(n => n > 0);
  if (prices.length === 0) return;
  const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100; // redondear al 100 superior
  if (_thumbMin) { _thumbMin.max = maxPrice; }
  if (_thumbMax) { _thumbMax.max = maxPrice; _thumbMax.value = maxPrice; }
  advPriceMax = maxPrice;
  if (_labelMax) _labelMax.textContent = `$${maxPrice.toLocaleString()}+`;
  updateFill();
}

// Calcular y dibujar el relleno entre los dos thumbs
function updateFill() {
  if (!_thumbMin || !_thumbMax || !_fill) return;
  const min  = parseFloat(_thumbMin.value);
  const max  = parseFloat(_thumbMax.value);
  const total = parseFloat(_thumbMin.max);
  const pct1 = (min / total) * 100;
  const pct2 = (max / total) * 100;
  _fill.style.left  = `${pct1}%`;
  _fill.style.width = `${pct2 - pct1}%`;
  if (_labelMin) _labelMin.textContent = `$${min.toLocaleString()}`;
  if (_labelMax) _labelMax.textContent = max >= total
    ? `$${max.toLocaleString()}+`
    : `$${max.toLocaleString()}`;
}

// Manejar cambio de thumbs (evitar cruce)
function onThumbChange() {
  let min = parseFloat(_thumbMin.value);
  let max = parseFloat(_thumbMax.value);
  const gap = 10; // mínimo 10 pesos de separación
  if (min >= max - gap) {
    if (this === _thumbMin) { _thumbMin.value = max - gap; min = max - gap; }
    else                    { _thumbMax.value = min + gap; max = min + gap; }
  }
  advPriceMin = min;
  advPriceMax = max;
  updateFill();
  clearTimeout(_searchDebounceTimer);
  _searchDebounceTimer = setTimeout(applyFiltersAndSearch, 250);
  updateAdvToggleIndicator();
}

if (_thumbMin) _thumbMin.addEventListener('input', onThumbChange);
if (_thumbMax) _thumbMax.addEventListener('input', onThumbChange);

// Toggle accordion
if (_advToggle && _advPanel) {
  _advToggle.addEventListener('click', () => {
    const open = _advPanel.hasAttribute('hidden');
    if (open) {
      _advPanel.removeAttribute('hidden');
      _advToggle.setAttribute('aria-expanded', 'true');
    } else {
      _advPanel.setAttribute('hidden', '');
      _advToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Checkbox envío gratis
if (_freeShip) {
  _freeShip.addEventListener('change', () => {
    advFreeShip = _freeShip.checked;
    applyFiltersAndSearch();
    updateAdvToggleIndicator();
  });
}

// Limpiar filtros avanzados
if (_advClear) {
  _advClear.addEventListener('click', () => {
    if (_thumbMin) { _thumbMin.value = 0; }
    if (_thumbMax) { _thumbMax.value = parseFloat(_thumbMax.max); }
    advPriceMin = 0;
    advPriceMax = parseFloat(_thumbMax?.max || 2000);
    if (_freeShip) { _freeShip.checked = false; }
    advFreeShip = false;
    updateFill();
    applyFiltersAndSearch();
    updateAdvToggleIndicator();
  });
}

// Punto indicador visual en el toggle cuando hay filtro activo
function updateAdvToggleIndicator() {
  if (!_advToggle) return;
  const hasFilter = advFreeShip ||
    advPriceMin > 0 ||
    advPriceMax < parseFloat(_thumbMax?.max || 2000);
  _advToggle.classList.toggle('has-active-filter', hasFilter);
}

// Hook en applyFiltersAndSearch para aplicar filtros de precio y envío a los datos
// Se sobre-escribe para extender la lógica existente sin tocar el original
const _originalApply = applyFiltersAndSearch;
applyFiltersAndSearch = function() {
  // Primero ejecuta el filtrado original por categoría y búsqueda de texto
  _originalApply();
  
  // Ahora filtramos la lista resultante (filteredProducts) con los criterios avanzados
  const totalMax = parseFloat(_thumbMax?.max || 2000);
  const hasPrice = advPriceMin > 0 || advPriceMax < totalMax;
  const hasShip  = advFreeShip;

  if (hasPrice || hasShip) {
    filteredProducts = filteredProducts.filter(p => {
      // Filtro de precio
      if (hasPrice) {
        // Si el producto no tiene campos numéricos, lo mantenemos visible
        if (p.priceMin != null || p.priceMax != null) {
          const pMin = p.priceMin ?? p.priceMax ?? 0;
          const pMax = p.priceMax ?? p.priceMin ?? 0;
          if (pMax < advPriceMin || pMin > advPriceMax) {
            return false;
          }
        }
      }
      // Filtro de envío gratis
      if (hasShip && p.badge !== 'env-grat') {
        return false;
      }
      return true;
    });

    // Volver a renderizar con la lista filtrada de verdad
    renderCatalog();
  }
};

// calibrateSlider se llama directamente dentro de loadProducts (async)

// ── A. ANIMACIÓN DE DESEMPAQUETADO (UNBOXING) ────────────────────────────
function runUnboxingAnimation(btn, product) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // Respetar accesibilidad
  }
  const rect = btn.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const targetEl = document.getElementById('floating-wishlist');
  if (!targetEl) return;
  const targetRect = targetEl.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  // 1. Crear caja de regalo (🎁)
  const box = document.createElement('div');
  box.className = 'unboxing-box-anim';
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
  box.textContent = '🎁';
  document.body.appendChild(box);

  // 2. Animar apertura de la caja y salida del producto
  setTimeout(() => {
    box.textContent = '📦';
    box.classList.add('open');

    const prodEl = document.createElement('div');
    prodEl.className = 'unboxing-prod-anim';
    prodEl.style.left = `${startX}px`;
    prodEl.style.top = `${startY - 10}px`;

    if (product.mainImage) {
      prodEl.innerHTML = `<img src="${product.mainImage}" alt="${product.name}">`;
    } else {
      prodEl.innerHTML = `<div class="unboxing-placeholder">✦</div>`;
    }
    document.body.appendChild(prodEl);

    // 3. Volar al botón de la wishlist
    setTimeout(() => {
      const dx = endX - startX;
      const dy = endY - (startY - 10);
      prodEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.3) rotate(360deg)`;
      prodEl.style.opacity = '0.6';

      // 4. Llegada
      setTimeout(() => {
        targetEl.classList.remove('bounce-active');
        void targetEl.offsetWidth; // force reflow
        targetEl.classList.add('bounce-active');

        // Confeti de doodles
        spawnDoodleConfetti(endX + window.scrollX, endY + window.scrollY);

        // Limpieza
        box.remove();
        prodEl.remove();
      }, 700);
    }, 50);
  }, 350);
}

// ── D. ANIMACIÓN DE 'CARGA MÁGICA' (FASE 14) ────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Retraso muy pequeño para asegurar que la animación sea apreciada
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 600);
  }
});


// ══════════════════════════════════════════════════════════════════════════
// MEJORA 1 — SHADER GRADIENT ANIMADO EN HERO (Canvas 2D)
// Gradiente fluido entre colores oficiales Bicho Capricho.
// Solo activo en el hero (fondo Bosque). Respeta prefers-reduced-motion.
// ══════════════════════════════════════════════════════════════════════════
(function initHeroGradient() {
  const canvas = document.getElementById('hero-gradient-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');

  // Paleta oficial — solo sobre fondos con color (regla GLASSMORPHISM_COLOR_BG_ONLY)
  const palette = [
    { r: 28,  g: 79,  b: 50  }, // Bosque  #1c4f32
    { r: 150, g: 105, b: 196 }, // Uva     #9669c4
    { r: 103, g: 141, b: 71  }, // Olivo   #678d47
    { r: 28,  g: 79,  b: 50  }, // Bosque  (cicla de vuelta)
  ];

  function lerpColor(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    };
  }
  function toRgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

  const points = [
    { x: 0.15, y: 0.20, speed: 0.00031, phase: 0.0 },
    { x: 0.75, y: 0.65, speed: 0.00023, phase: 1.1 },
    { x: 0.45, y: 0.85, speed: 0.00017, phase: 2.4 },
  ];

  let rafId = null;
  let t0    = null;

  function resize() {
    const hero = canvas.closest('.hero');
    if (!hero) return;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function draw(ts) {
    if (t0 === null) t0 = ts;
    const elapsed = ts - t0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base sólida Bosque
    ctx.fillStyle = '#1c4f32';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    points.forEach((pt, idx) => {
      const angle = elapsed * pt.speed + pt.phase;
      const cx = (pt.x + Math.sin(angle) * 0.18) * canvas.width;
      const cy = (pt.y + Math.cos(angle * 1.3) * 0.14) * canvas.height;
      const radius = Math.max(canvas.width, canvas.height) * 0.72;

      const colorIdx = (elapsed * 0.00009 + idx * 0.8) % (palette.length - 1);
      const colFloor = Math.floor(colorIdx);
      const color    = lerpColor(palette[colFloor], palette[colFloor + 1], colorIdx - colFloor);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0,   toRgba(color, 0.55));
      grad.addColorStop(0.5, toRgba(color, 0.18));
      grad.addColorStop(1,   toRgba(color, 0.0));

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    rafId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const hero = canvas.closest('.hero');
  if (!hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!rafId) rafId = requestAnimationFrame(draw);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; t0 = null; }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(hero);
})();


// ══════════════════════════════════════════════════════════════════════════
// MEJORA 2B — CONFETI DE COSTURA (Design Spells — Wishlist Add)
// Partículas de hilo/costura que explotan al pulsar "Añadir a mi lista".
// ══════════════════════════════════════════════════════════════════════════
function spawnWishlistConfetti(originEl) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!originEl) return;

  const rect   = originEl.getBoundingClientRect();
  const startX = rect.left + rect.width  / 2;
  const startY = rect.top  + rect.height / 2;

  const symbols = ['✦', '★', '♥', '✿', '✂', '◆', '·', '✱', '❋', '⌑'];
  const colors  = ['var(--pink)', 'var(--butter)', 'var(--lilac)',
                   'var(--lime)', 'var(--grape)',  'var(--olive)'];
  const count   = 12;

  for (let i = 0; i < count; i++) {
    const el      = document.createElement('span');
    el.className  = 'sewing-confetti';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left  = `${startX}px`;
    el.style.top   = `${startY}px`;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = `${14 + Math.random() * 12}px`;

    const angle  = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
    const dist   = 55 + Math.random() * 70;
    const flyX   = Math.round(Math.cos(angle) * dist);
    const flyY   = Math.round(Math.sin(angle) * dist - 30);
    const rotDeg = Math.round((Math.random() - 0.5) * 540);
    const dur    = 700 + Math.floor(Math.random() * 400);

    el.style.setProperty('--fly-x',   `${flyX}px`);
    el.style.setProperty('--fly-y',   `${flyY}px`);
    el.style.setProperty('--fly-rot', `${rotDeg}deg`);
    el.style.setProperty('--fly-dur', `${dur}ms`);
    el.style.animationDelay = `${Math.floor(Math.random() * 120)}ms`;

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  originEl.classList.add('adding');
  originEl.addEventListener('animationend', () => {
    originEl.classList.remove('adding');
  }, { once: true });
}

// Conectar confeti al botón de wishlist del modal (via MutationObserver)
(function hookWishlistConfetti() {
  const modalOverlay = document.getElementById('p-modal-overlay');
  if (!modalOverlay) return;

  const observer = new MutationObserver(() => {
    const btn = document.getElementById('pm-add-list-btn');
    if (btn && !btn.dataset.confettiHooked) {
      btn.dataset.confettiHooked = '1';
      const origOnclick = btn.onclick;
      btn.onclick = function(e) {
        spawnWishlistConfetti(btn);
        if (typeof origOnclick === 'function') origOnclick.call(btn, e);
      };
    }
  });

  observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
})();
