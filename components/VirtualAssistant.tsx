"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ChevronRight, BookOpen, PenTool, User, ExternalLink, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useContent } from "@/lib/editor/hooks";

type Option = {
    id: string;
    label: string;
    icon: React.ReactNode;
    action?: () => void;
    link?: string;
    subOptions?: Option[];
};

export function VirtualAssistant() {
    const { get } = useContent();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ type: 'bot' | 'user'; text: string; options?: Option[] }[]>([
        {
            type: 'bot',
            text: 'Hola, soy el asistente virtual del Centro. ¿En qué puedo ayudarte hoy?',
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleOptionClick = (option: Option) => {
        // Add user selection
        setMessages(prev => [...prev, { type: 'user', text: option.label }]);
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            setIsTyping(false);

            if (option.subOptions) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: 'Perfecto. Por favor selecciona una opción específica:',
                    options: option.subOptions
                }]);
            } else if (option.link) {
                // Check if it's an external link (WhatsApp or Editorial)
                const isExternal = option.link.startsWith('http');

                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: isExternal
                        ? 'Te estoy redirigiendo al sitio externo...'
                        : 'Te llevo a esa sección ahora mismo.',
                }]);

                setTimeout(() => {
                    if (option.link) window.open(option.link, isExternal ? '_blank' : '_self');
                }, 1000);

            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: 'Entendido. ¿Necesitas algo más?',
                    options: mainMenuOptions
                }]);
            }
        }, 800);
    };

    const whatsappLink = get<string>("footer.whatsappHref") ?? "https://wa.me/";
    const calLink = get<string>("integrations.calLink") ?? "";

    const bookOptions: Option[] = [
        {
            id: 'book1',
            label: 'Desprotección de la Infancia',
            icon: <BookOpen className="w-4 h-4 text-blue-500" />,
            link: "https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/"
        },
        {
            id: 'book2',
            label: 'Perspectivas Críticas Salud Mental',
            icon: <BookOpen className="w-4 h-4 text-purple-500" />,
            link: "https://www.editorialhammurabi.com/shop/derecho/privado/derecho-civil/derecho-familiar/desproteccion-de-la-infancia/" // Using same link as discussed or if specific link was found later, update here. Sticking to the one provided for now or generic editorial.
        },
        {
            id: 'back',
            label: 'Volver al menú principal',
            icon: <ChevronRight className="w-4 h-4 rotate-180" />,
            action: () => {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: '¿En qué más te puedo ayudar?',
                    options: mainMenuOptions
                }]);
            }
        }
    ];

    const mainMenuOptions: Option[] = [
        {
            id: 'consulting',
            label: 'Consultoría Estratégica',
            icon: <User className="w-4 h-4 text-yellow-500" />,
            link: whatsappLink
        },
        ...(calLink
            ? [
                {
                    id: 'calendar',
                    label: 'Agendar reunión',
                    icon: <ExternalLink className="w-4 h-4 text-cyan-500" />,
                    link: calLink
                } as Option,
            ]
            : []),
        {
            id: 'books',
            label: 'Adquirir Libros',
            icon: <BookOpen className="w-4 h-4 text-blue-500" />,
            subOptions: bookOptions
        },
        {
            id: 'submit',
            label: 'Enviar Columna',
            icon: <PenTool className="w-4 h-4 text-green-500" />,
            link: "/envia-tu-texto"
        },
        {
            id: 'contact',
            label: 'Otra consulta',
            icon: <Send className="w-4 h-4 text-gray-500" />,
            link: "/contacto"
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 w-80 sm:w-96 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        CR
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Asistente Virtual</h3>
                                    <p className="text-gray-400 text-xs">En línea</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-white/50 space-y-4 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.type === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Options Area */}
                        {!isTyping && messages[messages.length - 1]?.options && (
                            <div className="p-3 bg-gray-50/80 border-t border-gray-100 grid gap-2">
                                {messages[messages.length - 1].options?.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => option.action ? option.action() : handleOptionClick(option)}
                                        className="w-full text-left flex items-center p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors">
                                            {option.icon}
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                            {option.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

	            <motion.button
	                whileHover={{ scale: 1.05 }}
	                whileTap={{ scale: 0.95 }}
	                onClick={() => {
                        setIsOpen((open) => {
                            const next = !open;
                            if (next) {
                                setMessages((prev) => {
                                    if (prev.length === 1 && !prev[0]?.options) {
                                        return [{ ...prev[0]!, options: mainMenuOptions }];
                                    }
                                    return prev;
                                });
                            }
                            return next;
                        });
                    }}
	                className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 border border-gray-700 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all overflow-hidden"
	            >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </div>

                {/* Ping animation when closed */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
}
