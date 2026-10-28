import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  RotateCcw, 
  Send, 
  Sparkles, 
  ExternalLink, 
  ChevronRight,
  User,
  Trees,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { FacelessExecutiveAvatar } from './FacelessExecutiveAvatar';
import { useProperties } from '../../context/PropertyContext';
import { ChatMessage, QuickReply, ChatAction } from './types';
import { CHAT_TREE, matchUserInputToNode } from './chatTree';

export const ChatAgent: React.FC = () => {
  const { setFilters, setIsCustomRequestOpen } = useProperties();

  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeQuickReplies, setActiveQuickReplies] = useState<QuickReply[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Inicializar chat en el nodo 'start' la primera vez
  useEffect(() => {
    if (messages.length === 0) {
      loadNode('start', false);
    }
  }, []);

  // Ocultar burbuja flotante tras 12 segundos o al abrir
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeBubble(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowWelcomeBubble(false);
    setHasInteracted(true);
  };

  // Cargar un nodo del árbol
  const loadNode = (nodeId: string, simulateTyping = true) => {
    const node = CHAT_TREE[nodeId] || CHAT_TREE['start'];
    
    // Ocultar opciones rápidas previas mientras el bot "escribe"
    setActiveQuickReplies([]);

    if (simulateTyping) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        renderNodeContent(node);
      }, 550);
    } else {
      renderNodeContent(node);
    }
  };

  const renderNodeContent = (node: typeof CHAT_TREE[string]) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Agregar mensajes del bot
    const newBotMessages: ChatMessage[] = node.botMessages.map((text, idx) => ({
      id: `bot_${Date.now()}_${idx}`,
      sender: 'bot',
      text,
      timestamp: now,
      action: idx === node.botMessages.length - 1 ? node.action : undefined
    }));

    setMessages(prev => [...prev, ...newBotMessages]);

    // Ejecutar acción si existe
    if (node.action) {
      executeAction(node.action);
    }

    // Configurar las respuestas rápidas activas
    if (node.quickReplies) {
      setActiveQuickReplies(node.quickReplies);
    } else {
      setActiveQuickReplies([]);
    }
  };

  // Ejecutar acciones en la aplicación
  const executeAction = (action: ChatAction) => {
    switch (action.type) {
      case 'FILTER_CATALOG':
        if (action.payload) {
          setFilters(prev => ({
            ...prev,
            propertyType: action.payload.propertyType || prev.propertyType,
            commune: action.payload.commune || prev.commune
          }));
        }
        break;

      case 'OPEN_CUSTOM_REQUEST':
        setIsCustomRequestOpen(true);
        break;

      case 'OPEN_WHATSAPP':
        // No redirigir inmediatamente de forma invasiva, sino presentar el botón interactivo
        break;

      case 'SCROLL_TO_CATALOG':
        window.scrollTo({ top: 580, behavior: 'smooth' });
        break;
    }
  };

  // Manejar clic en una opción rápida
  const handleQuickReplyClick = (reply: QuickReply) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Registrar mensaje del usuario en la pantalla
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: reply.label,
      timestamp: now
    };

    setMessages(prev => [...prev, userMsg]);
    setActiveQuickReplies([]);

    // Cargar siguiente nodo
    if (reply.nextNodeId) {
      loadNode(reply.nextNodeId, true);
    }
  };

  // Manejar envío de texto manual
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: now
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setActiveQuickReplies([]);

    // Procesar con el motor de intenciones
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const matchedNodeId = matchUserInputToNode(text);
      loadNode(matchedNodeId, false);
    }, 600);
  };

  // Reiniciar la conversación
  const handleReset = () => {
    setMessages([]);
    setActiveQuickReplies([]);
    loadNode('start', false);
  };

  // Renderizar texto formateando negritas (**texto**)
  const renderFormattedText = (raw: string) => {
    const parts = raw.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Burbuja Flotante de Bienvenida (Tooltip inicial) */}
      {!isOpen && showWelcomeBubble && (
        <div 
          onClick={handleOpenChat}
          className="mb-3 max-w-xs bg-white text-slate-800 p-3.5 rounded-2xl shadow-xl border border-teal-100 flex items-start gap-3 cursor-pointer hover:shadow-2xl transition-all animate-bounce"
        >
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900">¿Buscas parcela o casa en el Sur?</p>
            <p className="text-[11px] text-slate-500 leading-tight">Chatea con nuestro asistente para ver opciones con rol propio.</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowWelcomeBubble(false); }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ventana de Chat Expandida */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[400px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-[#173153] to-[#1e3a5f] text-white px-4 py-3.5 flex items-center justify-between shadow-xs border-b border-[#c5a358]/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FacelessExecutiveAvatar size={42} className="shadow-xs" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#173153] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm tracking-tight text-white">Paulina Aliaga</h4>
                  <span className="px-1.5 py-0.2 bg-[#c5a358]/30 text-[10px] rounded-md text-[#f3e0aa] font-semibold border border-[#c5a358]/40">Broker</span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Aliaga Gestión & Corretaje
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reiniciar chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Banner de Garantía Aliaga */}
          <div className="bg-[#f8f9fa] px-3.5 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-[#173153]">
            <span className="flex items-center gap-1 font-medium">
              <Trees className="w-3.5 h-3.5 text-[#1e3a5f]" />
              Parcelas con Rol Propio Individual & SAG
            </span>
            <span className="text-[10px] text-[#b38f38] font-bold">100% Legal</span>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {isBot && (
                      <div className="shrink-0 mb-1">
                        <FacelessExecutiveAvatar size={24} className="border border-[#c5a358]" />
                      </div>
                    )}
                    
                    <div 
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isBot 
                          ? 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/70' 
                          : 'bg-[#173153] text-white rounded-br-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Botón de Acción Especial: WhatsApp directo si el mensaje lo amerita */}
                      {msg.action?.type === 'OPEN_WHATSAPP' && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <a
                            href={`https://wa.me/56976691216?text=${encodeURIComponent(msg.action.payload?.text || 'Hola Paulina, me comunico desde la web de Aliaga Gestión & Corretaje.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir Chat en WhatsApp</span>
                          </a>
                        </div>
                      )}

                      {/* Botón de Acción: Ver catálogo filtrado */}
                      {msg.action?.type === 'FILTER_CATALOG' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-teal-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            Catálogo actualizado
                          </span>
                          <button
                            onClick={() => window.scrollTo({ top: 580, behavior: 'smooth' })}
                            className="text-teal-800 hover:text-teal-950 font-bold underline"
                          >
                            Ver en pantalla ↓
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-400 mt-0.5 px-2">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Indicador de "Escribiendo..." */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="shrink-0">
                  <FacelessExecutiveAvatar size={24} className="border border-[#c5a358]" />
                </div>
                <div className="bg-white border border-slate-200/70 px-3.5 py-2 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Opciones Rápidas (Pills Interactivas) */}
            {!isTyping && activeQuickReplies.length > 0 && (
              <div className="pt-2 space-y-1.5 animate-in fade-in duration-200">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
                  Opciones sugeridas:
                </p>
                <div className="flex flex-col gap-1.5">
                  {activeQuickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReplyClick(reply)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#c5a358] text-slate-800 hover:text-[#173153] text-xs font-medium transition-all shadow-2xs flex items-center justify-between group active:scale-[0.99]"
                    >
                      <span className="leading-snug">{reply.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#c5a358] shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer: Input de Texto Manual */}
          <form 
            onSubmit={handleSendText}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta o palabra clave..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#173153] hover:bg-[#1e3a5f] disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors shadow-xs"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        /* Botón Flotante Redondo (FAB) */
        <button
          onClick={handleOpenChat}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#173153] to-[#1e3a5f] hover:from-[#0d1b2a] hover:to-[#173153] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#c5a358]/50"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-[#f3e0aa]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#173153] rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#173153] rounded-full"></span>
          </div>
          <span className="font-bold text-xs tracking-wide pr-1 hidden sm:inline text-white">
            Asistente Paulina Aliaga
          </span>
        </button>
      )}

    </div>
  );
};
