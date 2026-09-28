// DATOS MAESTROS · catálogo de productos (prototipo académico).
// Para subir imágenes: guarda el archivo en public/img/productos/ con el nombre indicado en "image".
// Si el archivo no existe, la web muestra un hueco con el nombre esperado.

export const CATEGORIES = [
  { slug: 'vinilos', nombre: 'Vinilos', descripcion: 'Clásicos y modernos en el soporte que los hizo eternos.', cta: 'Explorar vinilos', image: '/img/categorias/vinilos.jpg' },
  { slug: 'tocadiscos', nombre: 'Tocadiscos', descripcion: 'El ritual de poner un disco, de principio a fin.', cta: 'Ver tocadiscos', image: '/img/categorias/tocadiscos.jpg' },
  { slug: 'altavoces', nombre: 'Altavoces', descripcion: 'Que el sonido llene la sala como merece.', cta: 'Ver altavoces', image: '/img/categorias/altavoces.jpg' },
  { slug: 'auriculares', nombre: 'Auriculares', descripcion: 'Solo tú, la música y ninguna distracción.', cta: 'Ver auriculares', image: '/img/categorias/auriculares.jpg' },
]

export const PRODUCTS = [
  {
    id: 'p001', slug: 'audio-technica-at-lp120xusb', sku: 'AT-LP120XUSB',
    category: 'tocadiscos', brand: 'Audio-Technica', name: 'AT-LP120XUSB',
    price: 349, rating: 5, reviews: 234, badge: 'Más vendido', stock: 14, featured: true,
    image: '/img/productos/at-lp120xusb.jpg',
    description: 'Tocadiscos de tracción directa con salida USB para digitalizar tu colección. Plato de aluminio, control de tono y pitch ajustable.',
    specs: { Tracción: 'Directa', Velocidades: '33 1/3, 45 y 78 rpm', Preamplificador: 'Phono/Line integrado', Conexión: 'RCA + USB', Peso: '10,8 kg' },
    compatibility: 'Compatible con amplificadores y altavoces activos con entrada RCA o línea.',
  },
  {
    id: 'p002', slug: 'sony-ps-lx310bt', sku: 'PS-LX310BT',
    category: 'tocadiscos', brand: 'Sony', name: 'PS-LX310BT',
    price: 249, rating: 4, reviews: 189, badge: null, stock: 22, featured: true,
    image: '/img/productos/ps-lx310bt.jpg',
    description: 'Tocadiscos automático de correa con Bluetooth para enviar el sonido a auriculares o altavoces inalámbricos.',
    specs: { Tracción: 'Correa', Velocidades: '33 1/3 y 45 rpm', Preamplificador: 'Integrado', Conexión: 'RCA + Bluetooth', Peso: '4,1 kg' },
    compatibility: 'Compatible con altavoces y auriculares Bluetooth.',
  },
  {
    id: 'p003', slug: 'pro-ject-debut-carbon-evo', sku: 'DEBUT-CARBON-EVO',
    category: 'tocadiscos', brand: 'Pro-Ject', name: 'Debut Carbon EVO',
    price: 599, rating: 5, reviews: 97, badge: 'Premium', stock: 6, featured: true,
    image: '/img/productos/debut-carbon-evo.jpg',
    description: 'Brazo de carbono de una pieza, plato de 8 mm con alta inercia y cápsula Sumiko Rainier premontada. Cambio de velocidad electrónico.',
    specs: { Tracción: 'Correa', Velocidades: '33 1/3 y 45 rpm', Cápsula: 'Sumiko Rainier', Brazo: 'Carbono 8,6"', Peso: '5,5 kg' },
    compatibility: 'Requiere preamplificador phono si el amplificador no lo incluye.',
  },
  {
    id: 'p004', slug: 'edifier-r1280db', sku: 'R1280DB',
    category: 'altavoces', brand: 'Edifier', name: 'R1280DB',
    price: 149, rating: 5, reviews: 312, badge: null, stock: 40, featured: true,
    image: '/img/productos/r1280db.jpg',
    description: 'Monitores activos de estantería con entradas ópticas, coaxiales, RCA y Bluetooth. Acabado en madera y mando a distancia.',
    specs: { Potencia: '42 W RMS', Respuesta: '55 Hz – 20 kHz', Conexión: 'Óptica, coaxial, RCA, Bluetooth 5.0', Tipo: 'Activos 2.0', Peso: '6,0 kg (par)' },
    compatibility: 'Compatible con cualquier tocadiscos con preamplificador integrado.',
  },
  {
    id: 'p005', slug: 'klipsch-r-41pm', sku: 'R-41PM',
    category: 'altavoces', brand: 'Klipsch', name: 'R-41PM',
    price: 279, rating: 5, reviews: 141, badge: 'Últimas 2', stock: 2, featured: true,
    image: '/img/productos/r-41pm.jpg',
    description: 'Altavoces amplificados con bocina Tractrix y woofer de cobre de 4". Entrada phono integrada para conectar el tocadiscos directamente.',
    specs: { Potencia: '70 W RMS', Respuesta: '54 Hz – 21 kHz', Conexión: 'Phono, RCA, USB, Bluetooth', Tipo: 'Activos 2.0', Peso: '10,4 kg (par)' },
    compatibility: 'Entrada phono: conecta tocadiscos sin preamplificador.',
  },
  {
    id: 'p006', slug: 'meze-99-classics', sku: '99-CLASSICS',
    category: 'auriculares', brand: 'Meze Audio', name: '99 Classics',
    price: 309, rating: 5, reviews: 88, badge: 'Premium', stock: 9, featured: true,
    image: '/img/productos/99-classics.jpg',
    description: 'Auriculares cerrados con almohadillas de piel y estructura de nogal. Cable desmontable, sonido cálido y musical.',
    specs: { Tipo: 'Circumaurales cerrados', Impedancia: '32 Ω', Respuesta: '10 Hz – 25 kHz', Conexión: 'Jack 3,5 mm / 6,3 mm', Peso: '260 g' },
    compatibility: 'Compatible con amplificadores de auriculares y salidas de 3,5 mm.',
  },
  {
    id: 'p007', slug: 'sennheiser-hd-599', sku: 'HD-599',
    category: 'auriculares', brand: 'Sennheiser', name: 'HD 599',
    price: 129, rating: 4, reviews: 203, badge: null, stock: 25, featured: false,
    image: '/img/productos/hd-599.jpg',
    description: 'Auriculares abiertos de referencia para escucha larga y cómoda. Sonido amplio y natural.',
    specs: { Tipo: 'Circumaurales abiertos', Impedancia: '50 Ω', Respuesta: '12 Hz – 38,5 kHz', Conexión: 'Jack 3,5 mm / 6,3 mm', Peso: '250 g' },
    compatibility: 'Compatible con cualquier amplificador o salida de auriculares.',
  },
  {
    id: 'p008', slug: 'dark-side-of-the-moon-50-aniversario', sku: 'VIN-DSOTM-50',
    category: 'vinilos', brand: 'Pink Floyd', name: 'The Dark Side of the Moon (50 Aniversario)',
    price: 44.99, rating: 5, reviews: 176, badge: 'Edición limitada', stock: 12, featured: true,
    image: '/img/productos/dsotm.jpg',
    description: 'Reedición en vinilo de 180 g del álbum de 1973 en vinilo de colores, con póster y pegatinas.',
    specs: { Formato: 'LP 12"', Peso: '180 g', Año: '1973 (reedición 2023)', Género: 'Rock progresivo', Discos: '1' },
    compatibility: 'Reproducible a 33 1/3 rpm en cualquier tocadiscos.',
  },
  {
    id: 'p009', slug: 'kind-of-blue-vinilo', sku: 'VIN-KOB-180',
    category: 'vinilos', brand: 'Miles Davis', name: 'Kind of Blue',
    price: 27.99, rating: 5, reviews: 121, badge: 'Vintage', stock: 18, featured: false,
    image: '/img/productos/kind-of-blue.jpg',
    description: 'Clásico del jazz modal en vinilo de 180 g con prensado de alta fidelidad.',
    specs: { Formato: 'LP 12"', Peso: '180 g', Año: '1959', Género: 'Jazz', Discos: '1' },
    compatibility: 'Reproducible a 33 1/3 rpm en cualquier tocadiscos.',
  },
  {
    id: 'p010', slug: 'kit-limpieza-vinilos', sku: 'ACC-CLEAN-01',
    category: 'vinilos', brand: 'UCAM Stereo', name: 'Kit de limpieza para vinilos',
    price: 24.9, rating: 4, reviews: 54, badge: null, stock: 60, featured: false,
    image: '/img/productos/kit-limpieza.jpg',
    description: 'Cepillo de fibra de carbono, líquido limpiador de 250 ml y paño de microfibra.',
    specs: { Contenido: 'Cepillo + líquido 250 ml + paño', Uso: 'Discos de 7", 10" y 12"' },
    compatibility: 'Apto para vinilos y cápsulas.',
  },
]

export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug)
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id)