import { ChatNode } from './types';

export const CHAT_TREE: Record<string, ChatNode> = {
  start: {
    id: 'start',
    botMessages: [
      '¡Hola! 👋 Te damos la bienvenida a **Aliaga Gestión & Corretaje**.',
      'Soy tu asistente virtual. ¿En qué podemos ayudarte hoy en gestión inmobiliaria, parcelas y propiedades?'
    ],
    quickReplies: [
      { id: 'qr_parcelas', label: '🌲 Buscar Parcelas y Terrenos', nextNodeId: 'parcelas_menu' },
      { id: 'qr_casas', label: '🏡 Buscar Casas y Chalets', nextNodeId: 'casas_menu' },
      { id: 'qr_deptos', label: '🏢 Departamentos & Inversión', nextNodeId: 'deptos_menu' },
      { id: 'qr_vender', label: '🔑 Quiero Vender o Arrendar mi Propiedad', nextNodeId: 'vender_inicio' },
      { id: 'qr_faq', label: '❓ Preguntas Frecuentes (Rol, Comisión, etc.)', nextNodeId: 'faq_menu' },
      { id: 'qr_wa', label: '💬 Hablar directo con un Asesor Humano', nextNodeId: 'asesor_directo' }
    ]
  },

  // ==========================================
  // FLUJO PARCELAS
  // ==========================================
  parcelas_menu: {
    id: 'parcelas_menu',
    botMessages: [
      '🌲 Excelente elección. Contamos con parcelas de agrado desde 5.000 m², con bosque nativo, esteros y vista a volcanes.',
      '¿En qué sector o comuna de la Araucanía te gustaría explorar?'
    ],
    quickReplies: [
      { id: 'qr_parc_vil', label: '🌋 Villarrica / Cuenca del Lago', nextNodeId: 'parcelas_villarrica' },
      { id: 'qr_parc_puc', label: '🎿 Pucón / Lago Caburgua', nextNodeId: 'parcelas_pucon' },
      { id: 'qr_parc_tem', label: '🌾 Temuco y Alrededores', nextNodeId: 'parcelas_temuco' },
      { id: 'qr_parc_all', label: '🔎 Ver Todas las Parcelas Disponibles', nextNodeId: 'parcelas_todas' },
      { id: 'qr_parc_back', label: '↩️ Volver al menú principal', nextNodeId: 'start' }
    ]
  },

  parcelas_villarrica: {
    id: 'parcelas_villarrica',
    botMessages: [
      '📍 **Villarrica**: Contamos con parcelas con **Rol Propio Individual**, empalme de luz y factibilidad de agua mediante APR o pozo.',
      'He actualizado el catálogo de la pantalla con las parcelas disponibles en Villarrica para que puedas ver sus fotos y fichas.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'parcela', commune: 'Villarrica' }
    },
    quickReplies: [
      { id: 'qr_vil_vis', label: '📅 Agendar visita a terreno', nextNodeId: 'agendar_visita' },
      { id: 'qr_vil_wa', label: '💬 Consultar detalles por WhatsApp', nextNodeId: 'asesor_directo_parcela' },
      { id: 'qr_vil_menu', label: '↩️ Explorar otra zona', nextNodeId: 'parcelas_menu' }
    ]
  },

  parcelas_pucon: {
    id: 'parcelas_pucon',
    botMessages: [
      '🏔️ **Pucón**: Terrenos exclusivos en loteos consolidados con control de acceso, añosos bosques de coigües y vistas directas al volcán.',
      'Filtro aplicado en pantalla: mostrando parcelas en la zona de Pucón.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'parcela', commune: 'Pucón' }
    },
    quickReplies: [
      { id: 'qr_puc_vis', label: '📅 Coordinar recorrido en terreno', nextNodeId: 'agendar_visita' },
      { id: 'qr_puc_wa', label: '💬 Consultar a broker por WhatsApp', nextNodeId: 'asesor_directo_parcela' },
      { id: 'qr_puc_back', label: '↩️ Ver otras opciones', nextNodeId: 'parcelas_menu' }
    ]
  },

  parcelas_temuco: {
    id: 'parcelas_temuco',
    botMessages: [
      '🌾 **Temuco / Padre Las Casas / Cajón**: Parcelas ideales para primera vivienda campestre a solo 15 minutos del centro de la ciudad.',
      'Filtro aplicado en pantalla para parcelas cercanas a Temuco.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'parcela', commune: 'Temuco' }
    },
    quickReplies: [
      { id: 'qr_tem_vis', label: '📅 Agendar visita guiada', nextNodeId: 'agendar_visita' },
      { id: 'qr_tem_back', label: '↩️ Volver', nextNodeId: 'parcelas_menu' }
    ]
  },

  parcelas_todas: {
    id: 'parcelas_todas',
    botMessages: [
      'Listo, he configurado el catálogo principal para mostrar **todas las parcelas activas** en la Araucanía.',
      'Recuerda que todas cuentan con aprobación SAG y plano archivado en el CBR.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'parcela', commune: 'todas' }
    },
    quickReplies: [
      { id: 'qr_parc_custom', label: '📝 No encuentro lo que busco: Pedir encargo', nextNodeId: 'abrir_encargo' },
      { id: 'qr_parc_faq_rol', label: '📜 ¿Cómo verifican el Rol Propio?', nextNodeId: 'faq_rol' },
      { id: 'qr_parc_start', label: '↩️ Menú principal', nextNodeId: 'start' }
    ]
  },

  // ==========================================
  // FLUJO CASAS Y DEPARTAMENTOS
  // ==========================================
  casas_menu: {
    id: 'casas_menu',
    botMessages: [
      '🏡 Disponemos de residencias exclusivas en la zona lacustre y casas consolidadas en barrios residenciales de Temuco.',
      '¿Qué estilo de casa buscas?'
    ],
    quickReplies: [
      { id: 'qr_casa_lago', label: '🏖️ Villas Lacustres (Pucón / Villarrica)', nextNodeId: 'casas_lago' },
      { id: 'qr_casa_tem', label: '🏙️ Casas en Temuco (Portal de la Frontera, etc.)', nextNodeId: 'casas_temuco' },
      { id: 'qr_casa_all', label: '🔍 Ver Todas las Casas del Catálogo', nextNodeId: 'casas_todas' },
      { id: 'qr_casa_back', label: '↩️ Volver al menú', nextNodeId: 'start' }
    ]
  },

  casas_lago: {
    id: 'casas_lago',
    botMessages: [
      '🌊 Residencias con muelle privado, hot-tub, maderas nobles y vistas panorámicas al Lago Villarrica.',
      'Catálogo actualizado con casas lacustres.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'casa', commune: 'Pucón' }
    },
    quickReplies: [
      { id: 'qr_cl_vis', label: '📅 Agendar visita presencial', nextNodeId: 'agendar_visita' },
      { id: 'qr_cl_wa', label: '💬 Consultar por WhatsApp', nextNodeId: 'asesor_directo' },
      { id: 'qr_cl_back', label: '↩️ Volver a casas', nextNodeId: 'casas_menu' }
    ]
  },

  casas_temuco: {
    id: 'casas_temuco',
    botMessages: [
      '🏙️ Propiedades en los mejores sectores residenciales de Temuco: alta conectividad, seguridad y colegios cercanos.',
      'Filtro aplicado en pantalla para casas en Temuco.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'casa', commune: 'Temuco' }
    },
    quickReplies: [
      { id: 'qr_ct_vis', label: '📅 Coordinar visita', nextNodeId: 'agendar_visita' },
      { id: 'qr_ct_back', label: '↩️ Volver', nextNodeId: 'casas_menu' }
    ]
  },

  casas_todas: {
    id: 'casas_todas',
    botMessages: [
      'Mostrando el catálogo completo de casas en la Araucanía.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'casa', commune: 'todas' }
    },
    quickReplies: [
      { id: 'qr_c_all_vis', label: '📅 Agendar visita a una propiedad', nextNodeId: 'agendar_visita' },
      { id: 'qr_c_all_menu', label: '↩️ Menú principal', nextNodeId: 'start' }
    ]
  },

  deptos_menu: {
    id: 'deptos_menu',
    botMessages: [
      '🏢 Departamentos y Penthouses ideales para inversión o vivienda en centros urbanos y turísticos de la región.',
      'He filtrado los departamentos en pantalla para tu comodidad.'
    ],
    action: {
      type: 'FILTER_CATALOG',
      payload: { propertyType: 'departamento', commune: 'todas' }
    },
    quickReplies: [
      { id: 'qr_dep_inv', label: '📈 Consultar rentabilidad y arriendo estimado', nextNodeId: 'faq_inversion' },
      { id: 'qr_dep_wa', label: '💬 Hablar con Asesor de Inversiones', nextNodeId: 'asesor_directo' },
      { id: 'qr_dep_back', label: '↩️ Volver al menú', nextNodeId: 'start' }
    ]
  },

  // ==========================================
  // FLUJO CAPTACIÓN / VENDER PROPIEDAD
  // ==========================================
  vender_inicio: {
    id: 'vender_inicio',
    botMessages: [
      '🔑 ¡Excelente decisión! En **Aliaga Gestión & Corretaje** brindamos una gestión integral de corretaje:',
      '• Tasación comercial y estudio de mercado.\n• Sesión fotográfica HD y video tour.\n• Publicación destacada en portales líderes (PortalInmobiliario, Yapo, redes).\n• Filtro riguroso de prospectos y asesoría legal completa.'
    ],
    quickReplies: [
      { id: 'qr_v_wa', label: '📲 Contactar al Broker por WhatsApp (+56 9 7669 1216)', nextNodeId: 'asesor_vender_wa' },
      { id: 'qr_v_form', label: '📝 Registrar solicitud en formulario web', nextNodeId: 'abrir_encargo' },
      { id: 'qr_v_com', label: '💰 ¿Cuál es la comisión por vender?', nextNodeId: 'faq_comision' },
      { id: 'qr_v_back', label: '↩️ Volver al inicio', nextNodeId: 'start' }
    ]
  },

  asesor_vender_wa: {
    id: 'asesor_vender_wa',
    botMessages: [
      'Perfecto. Para coordinar la tasación de tu propiedad, pulsa el botón a continuación para abrir WhatsApp directamente con **Paulina Aliaga**:'
    ],
    action: {
      type: 'OPEN_WHATSAPP',
      payload: {
        text: 'Hola Paulina, me comunico desde la web de Aliaga Gestión & Corretaje. Me gustaría solicitar una tasación y asesoría para vender/arrendar mi propiedad.'
      }
    },
    quickReplies: [
      { id: 'qr_v_wa_back', label: '↩️ Volver al menú principal', nextNodeId: 'start' }
    ]
  },

  // ==========================================
  // FLUJO PREGUNTAS FRECUENTES (FAQ)
  // ==========================================
  faq_menu: {
    id: 'faq_menu',
    botMessages: [
      '❓ Estas son las consultas más habituales de nuestros clientes en la Araucanía. ¿Cuál te gustaría revisar?'
    ],
    quickReplies: [
      { id: 'qr_faq_1', label: '📜 ¿Tienen Rol Propio las parcelas?', nextNodeId: 'faq_rol' },
      { id: 'qr_faq_2', label: '💰 ¿Cuánto es la comisión de corretaje?', nextNodeId: 'faq_comision' },
      { id: 'qr_faq_3', label: '⚡ ¿Tienen empalme de luz y agua?', nextNodeId: 'faq_servicios' },
      { id: 'qr_faq_4', label: '🏦 ¿Aceptan crédito hipotecario?', nextNodeId: 'faq_credito' },
      { id: 'qr_faq_back', label: '↩️ Menú principal', nextNodeId: 'start' }
    ]
  },

  faq_rol: {
    id: 'faq_rol',
    botMessages: [
      '✅ **100% con Rol Propio Individual:**',
      'No vendemos cesiones de derechos ni acciones porcentuales. Todas nuestras parcelas cuentan con:\n• Subdivisión aprobada por el SAG (5.000 m² mínimo).\n• Plano visado y archivado en el Conservador de Bienes Raíces (CBR).\n• Rol de avalúo independiente asignado por el SII.',
      'Están 100% listas para escriturar de forma inmediata ante notario.'
    ],
    quickReplies: [
      { id: 'qr_fr_parc', label: '🌲 Ver parcelas listas para escriturar', nextNodeId: 'parcelas_menu' },
      { id: 'qr_fr_faq', label: '❓ Ver otra pregunta frecuente', nextNodeId: 'faq_menu' },
      { id: 'qr_fr_wa', label: '💬 Consultar con nuestro equipo legal', nextNodeId: 'asesor_directo' }
    ]
  },

  faq_comision: {
    id: 'faq_comision',
    botMessages: [
      '📊 **Tarifas de Corretaje Estándar en Chile:**',
      '• **Compraventa:** 2% + IVA sobre el valor final pactado, cancelado por cada una de las partes (comprador y vendedor) al firmar la escritura de compraventa.\n• **Arriendos:** 50% + IVA del primer mes de arriendo (pago único contra contrato).',
      'Incluye estudio de títulos preliminar, redacción de promesa de compraventa, coordinación bancaria y entrega material de la propiedad con acta formal.'
    ],
    quickReplies: [
      { id: 'qr_fc_faq', label: '❓ Ver otra pregunta', nextNodeId: 'faq_menu' },
      { id: 'qr_fc_wa', label: '💬 Hablar con Paulina Aliaga', nextNodeId: 'asesor_directo' },
      { id: 'qr_fc_start', label: '↩️ Inicio', nextNodeId: 'start' }
    ]
  },

  faq_servicios: {
    id: 'faq_servicios',
    botMessages: [
      '💡 **Factibilidad Eléctrica e Hídrica:**',
      '• **Luz:** En cada ficha indicamos si el loteo posee empalme aéreo o soterrado de Frontel/CGE, o si requiere generador/paneles solares.\n• **Agua:** Indicamos si cuenta con conexión a red de Agua Potable Rural (APR), vertientes inscritas o factibilidad técnica de pozo profundo a napas freáticas.'
    ],
    quickReplies: [
      { id: 'qr_fs_parc', label: '🌲 Ver parcelas con servicios', nextNodeId: 'parcelas_menu' },
      { id: 'qr_fs_faq', label: '❓ Volver a preguntas', nextNodeId: 'faq_menu' }
    ]
  },

  faq_credito: {
    id: 'faq_credito',
    botMessages: [
      '🏦 **Opciones de Financiamiento:**',
      '• **Casas y Departamentos:** 100% aptos para crédito hipotecario en cualquier banco comercial (BancoEstado, Santander, BCI, Scotiabank, Banco de Chile).\n• **Parcelas de Agrado:** Pago al contado, cheques o créditos con fines generales.',
      'Gestionamos la entrega de todos los antecedentes que requiera la tasación del banco tasador.'
    ],
    quickReplies: [
      { id: 'qr_fcr_wa', label: '💬 Consultar simulación con asesor', nextNodeId: 'asesor_directo' },
      { id: 'qr_fcr_faq', label: '❓ Ver otra pregunta', nextNodeId: 'faq_menu' },
      { id: 'qr_fcr_start', label: '↩️ Inicio', nextNodeId: 'start' }
    ]
  },

  faq_inversion: {
    id: 'faq_inversion',
    botMessages: [
      '📈 **Inversión y Rentabilidad Lacustre:**',
      'La zona lacustre (Pucón - Villarrica) destaca por alta plusvalía anual (8% a 14% histórico) y excelente rendimiento por arriendos de temporada estival e invernal (turismo termal y de esquí en volcán).'
    ],
    quickReplies: [
      { id: 'qr_fi_wa', label: '💬 Recibir portafolio de inversión por WhatsApp', nextNodeId: 'asesor_directo' },
      { id: 'qr_fi_back', label: '↩️ Volver', nextNodeId: 'deptos_menu' }
    ]
  },

  // ==========================================
  // CANAL DIRECTO ASESOR & ACCIONES
  // ==========================================
  asesor_directo: {
    id: 'asesor_directo',
    botMessages: [
      '📲 Conectando con **Paulina Aliaga**, Directora & Broker de Aliaga Gestión & Corretaje.',
      'Haz clic en el botón verde abajo para abrir el chat directo en WhatsApp:'
    ],
    action: {
      type: 'OPEN_WHATSAPP',
      payload: {
        text: 'Hola Paulina, estoy navegando en la web de Aliaga Gestión & Corretaje y me gustaría recibir asesoría sobre opciones de propiedades.'
      }
    },
    quickReplies: [
      { id: 'qr_ad_vis', label: '📅 O prefiero Agendar una Visita en la web', nextNodeId: 'agendar_visita' },
      { id: 'qr_ad_menu', label: '↩️ Volver al menú principal', nextNodeId: 'start' }
    ]
  },

  asesor_directo_parcela: {
    id: 'asesor_directo_parcela',
    botMessages: [
      'Puedes escribirnos directamente para consultar planos topográficos, coordenadas KLM/GPS o certificado de informaciones previas (CIP):'
    ],
    action: {
      type: 'OPEN_WHATSAPP',
      payload: {
        text: 'Hola Paulina, me interesa información técnica y visita para parcelas y propiedades vistas en Aliaga Gestión & Corretaje.'
      }
    },
    quickReplies: [
      { id: 'qr_adp_vis', label: '📅 Agendar visita a terreno', nextNodeId: 'agendar_visita' },
      { id: 'qr_adp_back', label: '↩️ Volver al menú', nextNodeId: 'start' }
    ]
  },

  agendar_visita: {
    id: 'agendar_visita',
    botMessages: [
      '📅 ¡Excelente! En cada tarjeta del catálogo principal tienes el botón **"Agendar Visita"** para escoger fecha y horario.',
      'O si prefieres, escríbenos directamente por WhatsApp y coordinamos tu recorrido en terreno de inmediato.'
    ],
    action: {
      type: 'SCROLL_TO_CATALOG'
    },
    quickReplies: [
      { id: 'qr_av_wa', label: '📲 Coordinar día y hora por WhatsApp', nextNodeId: 'asesor_directo' },
      { id: 'qr_av_back', label: '↩️ Menú principal', nextNodeId: 'start' }
    ]
  },

  abrir_encargo: {
    id: 'abrir_encargo',
    botMessages: [
      '📝 Abriendo la ventana de **Encargo Personalizado**. Allí puedes indicarnos tu presupuesto máximo, comuna deseada y requisitos especiales para que nuestro equipo lo busque por ti.'
    ],
    action: {
      type: 'OPEN_CUSTOM_REQUEST'
    },
    quickReplies: [
      { id: 'qr_ae_wa', label: '💬 O prefiero decírselo a un asesor por WhatsApp', nextNodeId: 'asesor_directo' },
      { id: 'qr_ae_back', label: '↩️ Menú principal', nextNodeId: 'start' }
    ]
  }
};

/**
 * Función de matching inteligente para cuando el usuario escribe texto manual libre.
 */
export function matchUserInputToNode(input: string): string {
  const clean = input.toLowerCase().trim();

  if (clean.includes('parcela') || clean.includes('terreno') || clean.includes('sitio') || clean.includes('lote')) {
    if (clean.includes('villarrica') || clean.includes('lago')) return 'parcelas_villarrica';
    if (clean.includes('pucon') || clean.includes('pucón') || clean.includes('caburgua')) return 'parcelas_pucon';
    if (clean.includes('temuco')) return 'parcelas_temuco';
    return 'parcelas_menu';
  }

  if (clean.includes('casa') || clean.includes('chalet') || clean.includes('cabaña')) {
    if (clean.includes('pucon') || clean.includes('pucón') || clean.includes('lago')) return 'casas_lago';
    if (clean.includes('temuco')) return 'casas_temuco';
    return 'casas_menu';
  }

  if (clean.includes('depto') || clean.includes('departamento') || clean.includes('inversion') || clean.includes('inversión')) {
    return 'deptos_menu';
  }

  if (clean.includes('vender') || clean.includes('arrendar') || clean.includes('publicar') || clean.includes('tasacion') || clean.includes('tasación')) {
    return 'vender_inicio';
  }

  if (clean.includes('rol') || clean.includes('sag') || clean.includes('cbr') || clean.includes('escritur')) {
    return 'faq_rol';
  }

  if (clean.includes('comision') || clean.includes('comisión') || clean.includes('honorario') || clean.includes('cuanto cobran')) {
    return 'faq_comision';
  }

  if (clean.includes('luz') || clean.includes('agua') || clean.includes('pozo') || clean.includes('apr')) {
    return 'faq_servicios';
  }

  if (clean.includes('credito') || clean.includes('crédito') || clean.includes('banco') || clean.includes('hipotecario')) {
    return 'faq_credito';
  }

  if (clean.includes('contacto') || clean.includes('whatsapp') || clean.includes('telefono') || clean.includes('teléfono') || clean.includes('humano') || clean.includes('persona')) {
    return 'asesor_directo';
  }

  if (clean.includes('visita') || clean.includes('ir a ver') || clean.includes('recorrer')) {
    return 'agendar_visita';
  }

  if (clean.includes('hola') || clean.includes('buenas') || clean.includes('inicio') || clean.includes('menu') || clean.includes('menú')) {
    return 'start';
  }

  // Si no coincide exactamente, volver a mostrar las opciones principales
  return 'start';
}
