export const formatPrice = (price: number, currency: 'CLP' | 'UF'): string => {
  if (currency === 'UF') {
    return `UF ${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
  }
  return `$${price.toLocaleString('es-CL')}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-CL');
};

export const getWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const createPropertyWhatsAppMessage = (property: {
  title: string;
  code: string;
  operation: string;
  price: number;
  currency: 'CLP' | 'UF';
}): string => {
  const formattedPrice = formatPrice(property.price, property.currency);
  return `¡Hola Aliaga Gestión & Corretaje! 👋 Me interesa obtener más información sobre la propiedad en ${property.operation.toUpperCase()}: "${property.title}" (Código: ${property.code}) por un valor de ${formattedPrice}. ¿Podrían brindarme asesoría o disponibilidad para conocerla?`;
};

export const createCustomRequestWhatsAppMessage = (req: {
  name: string;
  operation: string;
  propertyType: string;
  maxBudget: number;
  currency: 'CLP' | 'UF';
  communes: string[];
}): string => {
  const budget = formatPrice(req.maxBudget, req.currency);
  const communesText = req.communes.length > 0 ? req.communes.join(', ') : 'Cualquiera';
  return `¡Hola Aliaga Gestión & Corretaje! Mi nombre es ${req.name}. Estoy buscando una propiedad para ${req.operation.toUpperCase()} de tipo ${req.propertyType}. Mi presupuesto es de aprox. ${budget} en las comunas: ${communesText}. ¿Tienen opciones disponibles?`;
};

export const extractYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  
  // Handle youtube.com/watch?v=ID or youtu.be/ID
  const matchWatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (matchWatch && matchWatch[1]) {
    return `https://www.youtube.com/embed/${matchWatch[1]}?autoplay=0`;
  }
  const matchShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (matchShort && matchShort[1]) {
    return `https://www.youtube.com/embed/${matchShort[1]}?autoplay=0`;
  }
  return url;
};
