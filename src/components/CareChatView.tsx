import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Stethoscope,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { ChatMessage, PatientProfile } from '../types/pharmacy';

interface CareChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBookConsultation: () => void;
  patient: PatientProfile;
}

export const CareChatView: React.FC<CareChatViewProps> = ({
  messages,
  onSendMessage,
  onBookConsultation,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '¿Puedo tomar la Atorvastatina en el desayuno?',
    '¿Qué hago si olvidé mi dosis de Metformina?',
    '¿Es seguro tomar Ibuprofeno con mis medicinas?',
    '¿Por qué evitar el pomelo con la Atorvastatina?',
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full flex flex-col h-[calc(100dvh-10.5rem)] min-h-[460px] max-h-[660px] rounded-2xl sm:rounded-3xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
      {/* Chat Clinical Header */}
      <div className="w-full flex items-center justify-between border-b border-[#e2e8f0] bg-gradient-to-r from-white via-[#f8faff] to-[#eff6ff] p-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-xs">
              <Stethoscope className="h-4 w-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#0ea5e9] ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="font-heading text-xs sm:text-sm font-bold text-[#0f172a] truncate">
                Dra. Sara Jiménez
              </h2>
              <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-1.5 py-0.2 text-[9px] font-semibold text-[#1d4ed8] border border-[#bfdbfe]">
                Farmacia 701
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] truncate leading-tight">
              Especialista Clínica (BCPS) · En línea
            </p>
          </div>
        </div>

        <button
          onClick={onBookConsultation}
          className="inline-flex min-h-[40px] h-9 items-center gap-1 rounded-xl bg-[#eff6ff] px-2.5 text-xs font-semibold text-[#2563eb] border border-[#2563eb]/25 hover:bg-[#dbeafe] transition-all cursor-pointer shrink-0"
        >
          <Video className="h-3.5 w-3.5" />
          <span>Videollamada</span>
        </button>
      </div>

      {/* Message History Feed */}
      <div className="w-full flex-1 overflow-y-auto p-3 space-y-3 bg-[#f8faff]/50">
        <div className="w-full rounded-xl bg-[#eff6ff] p-2 text-center border border-[#dbeafe]">
          <p className="text-[10px] sm:text-[11px] text-[#1d4ed8]">
            <ShieldCheck className="inline h-3 w-3 mr-1 text-[#2563eb]" />
            Canal confidencial de orientación Farmacia 701.
          </p>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`w-full flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#2563eb] text-white rounded-br-xs'
                    : 'bg-white text-[#0f172a] border border-[#e2e8f0] rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#2563eb] mb-1">
                    <Stethoscope className="h-3 w-3" />
                    <span>Dra. Sara Jiménez · Farmacia 701</span>
                  </div>
                )}
                <p className="whitespace-pre-line text-xs">{msg.text}</p>
                <span
                  className={`mt-1 block text-[9px] text-right ${
                    isUser ? 'text-white/70' : 'text-[#64748b]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips: scrollable in mobile */}
      <div className="w-full border-t border-[#f1f5f9] bg-white px-2.5 py-1.5">
        <div className="w-full flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[10px] font-medium text-[#64748b] shrink-0">
            Sugerencias:
          </span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(q)}
              className="inline-flex min-h-[30px] items-center rounded-lg bg-[#f8faff] px-2 py-0.5 text-[10px] sm:text-xs text-[#334155] border border-[#e2e8f0] hover:bg-[#eff6ff] hover:text-[#2563eb] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Area */}
      <form
        onSubmit={handleSend}
        className="w-full flex items-center gap-1.5 border-t border-[#e2e8f0] bg-white p-2"
      >
        <input
          type="text"
          placeholder="Escribe tu consulta clínica..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 min-h-[44px] h-10 rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#2563eb] focus:ring-3 focus:ring-[#2563eb]/15 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex min-h-[44px] h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
