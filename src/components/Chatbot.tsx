import React, { useState, useRef, useEffect } from 'react';

interface Product {
  name: string;
  price: number;
  image: string;
  url: string;
}

interface ExternalLinks {
  facebook: string;
  tayara: string;
}

interface BotResponse {
  message: string;
  products?: Product[];
  links?: ExternalLinks;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  products?: Product[];
  links?: ExternalLinks;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text: "👋 Hi there! I can help you find products and compare prices. What are you looking for?"
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = window.navigator.language || 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
       alert("Your browser does not support Speech Recognition.");
       return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = window.navigator.language || 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text, city: city }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from API");
      }

      const data: BotResponse = await response.json();

      if (data.message) {
        speakText(data.message);
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.message,
        products: data.products,
        links: data.links,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Sorry, I encountered an error while fetching the results. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-[360px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ease-in-out sm:max-h-[80vh] h-[600px]">
          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-4 flex justify-between items-center z-10 shadow-sm relative transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.24.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">ChoufPrix Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200 transition-colors focus:outline-none p-1 rounded-md hover:bg-white/10"
              aria-label="Close Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-5 transition-colors duration-300">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm transition-colors duration-300 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Products Context */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((product, idx) => (
                        <a 
                          key={idx} 
                          href={product.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center space-x-3 bg-white border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 hover:border-blue-600/30 transition-all duration-200 group no-underline"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-50">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">
                              {product.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">DT</span>
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* External Links */}
                  {msg.links && (msg.links.facebook || msg.links.tayara) && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        View More On
                      </p>
                      <div className="flex space-x-2">
                        {msg.links.facebook && (
                          <a 
                            href={msg.links.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 flex items-center justify-center bg-[#f0f2f5] hover:bg-[#e4e6eb] text-[#1877f2] py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 no-underline"
                          >
                            Facebook
                          </a>
                        )}
                        {msg.links.tayara && (
                          <a 
                            href={msg.links.tayara} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 flex items-center justify-center bg-[#fff5eb] hover:bg-[#ffead5] text-[#ff7900] py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200 no-underline"
                          >
                            Tayara
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 flex space-x-1.5 items-center w-fit">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-px" />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 transition-colors duration-300">
             <div className="flex items-center space-x-2 bg-gray-50/80 border border-gray-200 rounded-xl px-2 py-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:bg-white transition-colors duration-200">
               <select
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                 className="bg-transparent text-sm text-gray-600 focus:outline-none border-r border-gray-200 pr-2 py-1 cursor-pointer"
                 disabled={isLoading}
               >
                 <option value="">All Tunisia</option>
                 <option value="Tunis">Tunis</option>
                 <option value="Sfax">Sfax</option>
                 <option value="Sousse">Sousse</option>
                 <option value="Bizerte">Bizerte</option>
                 <option value="Nabeul">Nabeul</option>
                 <option value="Kairouan">Kairouan</option>
                 <option value="Gabès">Gabès</option>
                 <option value="Ariana">Ariana</option>
                 <option value="Monastir">Monastir</option>
               </select>
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Ask about a product..."
                 className="flex-1 bg-transparent px-2 py-1.5 focus:outline-none text-[15px] text-gray-800 placeholder-gray-400"
                 disabled={isLoading}
               />
               <button
                 onClick={startListening}
                 disabled={isLoading || isListening}
                 className={`rounded-lg p-2 transition-colors flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} disabled:opacity-40`}
                 aria-label="Voice Input"
                 title="Voice Input"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                 </svg>
               </button>
               <button
                 onClick={handleSend}
                 disabled={!input.trim() || isLoading}
                 className="bg-orange-500 text-white rounded-lg p-2 hover:opacity-90 disabled:opacity-40 transition-colors flex-shrink-0"
                 aria-label="Send message"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 translate-x-[1px] -translate-y-[1px]">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.125A59.769 59.769 0 0121.485 12 59.768 59.768 0 013.27 20.875L5.999 12Zm0 0h7.5" />
                 </svg>
               </button>
             </div>
             <p className="text-[10px] text-gray-400 mt-2 text-center">🎤 Voice feature is best experienced on Chrome or Edge</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 shadow-lg shadow-blue-600/30 text-white p-4 rounded-full hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/50 flex items-center justify-center group"
          aria-label="Open Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 group-hover:animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
