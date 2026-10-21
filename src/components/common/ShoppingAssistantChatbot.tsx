import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  ExternalLink,
  Phone,
  ArrowRight,
  ArrowUp,
  Grid,
  Search,
  Eye,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    isPrimary?: boolean;
    isExternal?: boolean;
    icon?: React.ReactNode;
  }>;
  suggestedProducts?: Product[];
}

export const ShoppingAssistantChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, openProductDetail, setCurrentView } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WhatsApp configured business number
  const phone = (import.meta.env.VITE_WHATSAPP_PHONE || '917578887888').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hello LAP OF LUXURY Concierge, I would like assistance with my luxury shopping enquiry.'
  )}`;

  // Quick Reply Main Menu Actions
  const buildMainMenuActions = () => [
    {
      label: '🛍️ Shop Products',
      onClick: () => handleSelectOption('shop'),
      isPrimary: true,
    },
    {
      label: '📂 Browse Categories',
      onClick: () => handleSelectOption('categories'),
      isPrimary: true,
    },
    {
      label: '👔 Check New Outfits',
      onClick: () => handleSelectOption('outfits'),
    },
    {
      label: '✨ About Us',
      onClick: () => handleSelectOption('about'),
    },
    {
      label: '📞 Contact Concierge',
      onClick: () => handleSelectOption('contact'),
    },
  ];

  // Welcome message
  const initialMessages: ChatMessage[] = useMemo(
    () => [
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: "Welcome to LAP OF LUXURY ✨\n\nI am your personal shopping concierge. How may I assist you with your luxury selection today?",
        actions: [
          {
            label: '🛍️ Shop Products',
            onClick: () => handleSelectOption('shop'),
            isPrimary: true,
          },
          {
            label: '📂 Browse Categories',
            onClick: () => handleSelectOption('categories'),
            isPrimary: true,
          },
          {
            label: '👔 New Outfits',
            onClick: () => handleSelectOption('outfits'),
          },
          {
            label: '✨ About Us',
            onClick: () => handleSelectOption('about'),
          },
          {
            label: '📞 Contact Concierge',
            onClick: () => handleSelectOption('contact'),
          },
        ],
      },
    ],
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Smooth scroll to bottom of chat
  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Scroll to top of chat message container
  const handleScrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Track chat container scroll position to toggle scroll-to-top button
  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop } = chatContainerRef.current;
    setShowScrollTop(scrollTop > 60);
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isTyping) {
      scrollToBottom(true);
    }
  }, [messages, isTyping, isOpen]);

  // Restart / Clear Conversation
  const handleRestartChat = () => {
    setMessages([
      {
        id: `restart-${Date.now()}`,
        sender: 'bot',
        text: "Conversation refreshed. ✨ How can I help you discover our luxury collections today?",
        actions: buildMainMenuActions(),
      },
    ]);
    setTimeout(() => scrollToBottom(true), 50);
  };

  // Helper to send bot reply with animated typing indicator
  const pushBotReply = (
    text: string,
    actions?: ChatMessage['actions'],
    suggestedProducts?: Product[]
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text,
        actions,
        suggestedProducts,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  // Interactive quick option handlers
  const handleSelectOption = (
    option: 'shop' | 'categories' | 'outfits' | 'about' | 'contact' | 'main'
  ) => {
    if (option === 'main') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '↩️ Main Menu',
      };
      setMessages((prev) => [...prev, userMsg]);
      pushBotReply(
        "How can I assist you with your LAP OF LUXURY experience today? ✨",
        buildMainMenuActions()
      );
      return;
    }

    if (option === 'shop') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '🛍️ Shop Products',
      };
      setMessages((prev) => [...prev, userMsg]);

      // Highlight select sample products from inventory
      const sampleProducts = products.slice(0, 3);

      pushBotReply(
        "Explore our mastercrafted luxury catalog! Choose a department or discover client favourites below:",
        [
          {
            label: "👔 Men's Collection",
            onClick: () => {
              navigate('/men');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '👟 Footwear Collection',
            onClick: () => {
              navigate('/footwear');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '👜 Bags & Luggage',
            onClick: () => {
              navigate('/bags');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '✨ Royal Perfumes',
            onClick: () => {
              navigate('/perfumes');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '⌚ Watches & Horology',
            onClick: () => {
              navigate('/watches');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '👖 Denim Jeans',
            onClick: () => {
              navigate('/jeans');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        sampleProducts
      );
      return;
    }

    if (option === 'categories') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '📂 Browse Categories',
      };
      setMessages((prev) => [...prev, userMsg]);

      // Category options based on actual categories
      const categoryActions = [
        {
          label: "👔 Men's Fashion",
          onClick: () => {
            navigate('/men');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '👟 Footwear',
          onClick: () => {
            navigate('/footwear');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '👜 Bags & Leather',
          onClick: () => {
            navigate('/bags');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '✨ Perfumes',
          onClick: () => {
            navigate('/perfumes');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '⌚ Watches',
          onClick: () => {
            navigate('/watches');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '👖 Jeans',
          onClick: () => {
            navigate('/jeans');
            setIsOpen(false);
          },
          isPrimary: true,
        },
        {
          label: '↩️ Main Menu',
          onClick: () => handleSelectOption('main'),
        },
      ];

      pushBotReply(
        "Select any of our signature departments to view curated pieces, styles, and luxury labels:",
        categoryActions
      );
      return;
    }

    if (option === 'outfits') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '👔 Check New Outfits',
      };
      setMessages((prev) => [...prev, userMsg]);

      // Find shirts or t-shirts for outfits
      const outfitProducts = products
        .filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const sub = (p.subCategory || '').toLowerCase();
          return cat === 'men' || sub.includes('shirt') || sub.includes('t-shirt') || sub.includes('hoodie');
        })
        .slice(0, 3);

      pushBotReply(
        "Looking for your next signature outfit? 👔✨ Explore our tailored shirts, hoodies, and luxury denim:",
        [
          {
            label: "Explore Men's Outfits →",
            onClick: () => {
              navigate('/men');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: 'Festive & Occasion Atelier →',
            onClick: () => {
              navigate('/collections');
              setIsOpen(false);
            },
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        outfitProducts.length > 0 ? outfitProducts : undefined
      );
      return;
    }

    if (option === 'about') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '✨ About Us',
      };
      setMessages((prev) => [...prev, userMsg]);

      pushBotReply(
        "Welcome to LAP OF LUXURY — Experience Premium In Every Touch. ✨\n\nWe bring you curated luxury fashion, Swiss timepieces, royal parfums, artisanal leather bags, and premium footwear.\n\n📍 Flagship Store:\nD/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, beside Prashant Residency, Mahbubnagar, Telangana 509001.\n\n⏰ Hours: 9:30 AM – 10:00 PM (Everyday)\n📞 Concierge: +91 75 7888 7888",
        [
          {
            label: 'Explore Storefront →',
            onClick: () => {
              navigate('/');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: 'Chat on WhatsApp 💬',
            onClick: () => {
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            },
            isExternal: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ]
      );
      return;
    }

    if (option === 'contact') {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '📞 Contact Concierge',
      };
      setMessages((prev) => [...prev, userMsg]);

      pushBotReply(
        "We are here to assist you with order tracking, sizing guidance, custom sourcing, and product queries! 💬",
        [
          {
            label: 'Chat with Concierge on WhatsApp 💬',
            onClick: () => {
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            },
            isPrimary: true,
            isExternal: true,
          },
          {
            label: 'Call Store: +91 75 7888 7888 📞',
            onClick: () => {
              window.location.href = 'tel:+917578887888';
            },
            isExternal: true,
          },
          {
            label: 'Store Information & Map 📍',
            onClick: () => {
              navigate('/contact-us');
              setIsOpen(false);
            },
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ]
      );
      return;
    }
  };

  // Text message submit handler with smart keyword matching and real product lookup
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    const lower = query.toLowerCase();

    // Greetings
    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.startsWith('hi ') ||
      lower.startsWith('hello ') ||
      lower.startsWith('hey ') ||
      lower === 'namaste' ||
      lower === 'good morning' ||
      lower === 'good evening'
    ) {
      pushBotReply(
        "Hello! 👋 Welcome back to LAP OF LUXURY. How may I assist your luxury shopping journey today?",
        buildMainMenuActions()
      );
      return;
    }

    // Footwear / Shoes query
    if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('sneaker') || lower.includes('croc') || lower.includes('loafer')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase().includes('footwear') ||
          p.category.toLowerCase().includes('shoe') ||
          (p.subCategory && p.subCategory.toLowerCase().includes('sneaker')) ||
          (p.subCategory && p.subCategory.toLowerCase().includes('croc')) ||
          (p.subCategory && p.subCategory.toLowerCase().includes('loafer'))
      ).slice(0, 3);

      pushBotReply(
        "Here are our premium footwear selections, including luxury sneakers, loafers, and formal shoes:",
        [
          {
            label: 'View Footwear Department →',
            onClick: () => {
              navigate('/footwear');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Watches query
    if (lower.includes('watch') || lower.includes('timepiece') || lower.includes('chronograph') || lower.includes('rolex') || lower.includes('rado') || lower.includes('tissot')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase().includes('watch') ||
          (p.brand && p.brand.toLowerCase().includes('watch')) ||
          (p.subCategory && p.subCategory.toLowerCase().includes('watch'))
      ).slice(0, 3);

      pushBotReply(
        "Discover our curated horology collection featuring Swiss movements, chronographs, and heirloom watches:",
        [
          {
            label: 'View Watches Collection →',
            onClick: () => {
              navigate('/watches');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Perfumes query
    if (lower.includes('perfume') || lower.includes('scent') || lower.includes('oud') || lower.includes('fragrance') || lower.includes('attar')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase().includes('perfume') ||
          (p.subCategory && p.subCategory.toLowerCase().includes('oud'))
      ).slice(0, 3);

      pushBotReply(
        "Explore our private parfum blends, rare Cambodian oud, and royal amber extraits:",
        [
          {
            label: 'View Perfumes Collection →',
            onClick: () => {
              navigate('/perfumes');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Jeans query
    if (lower.includes('jean') || lower.includes('denim') || lower.includes('pant')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase().includes('jean') ||
          (p.subCategory && p.subCategory.toLowerCase().includes('denim')) ||
          (p.subCategory && p.subCategory.toLowerCase().includes('jean'))
      ).slice(0, 3);

      pushBotReply(
        "Here are our premium denim and tailored jean fits (Slim, Regular, Baggy & Raw Denim):",
        [
          {
            label: 'View Jeans Collection →',
            onClick: () => {
              navigate('/jeans');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Bags query
    if (lower.includes('bag') || lower.includes('wallet') || lower.includes('luggage') || lower.includes('backpack')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase().includes('bag') ||
          (p.subCategory && p.subCategory.toLowerCase().includes('bag')) ||
          (p.subCategory && p.subCategory.toLowerCase().includes('wallet'))
      ).slice(0, 3);

      pushBotReply(
        "Discover our leather atelier bags, backpacks, travel luggage, and slim wallets:",
        [
          {
            label: 'View Bags Collection →',
            onClick: () => {
              navigate('/bags');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Men's query
    if (lower.includes('men') || lower.includes('shirt') || lower.includes('tshirt') || lower.includes('hoodie')) {
      const matching = products.filter(
        (p) =>
          p.category.toLowerCase() === 'men' ||
          (p.subCategory && p.subCategory.toLowerCase().includes('shirt'))
      ).slice(0, 3);

      pushBotReply(
        "Explore our sartorial men's shirts, luxury hoodies, and essentials:",
        [
          {
            label: "View Men's Collection →",
            onClick: () => {
              navigate('/men');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matching.length > 0 ? matching : undefined
      );
      return;
    }

    // Order / Shipping query
    if (lower.includes('order') || lower.includes('track') || lower.includes('delivery') || lower.includes('shipping')) {
      pushBotReply(
        "Orders are inspected and dispatched within 24 hours. Standard delivery across India takes 2 to 4 business days. Track your order or contact our concierge below:",
        [
          {
            label: 'Track My Order →',
            onClick: () => {
              navigate('/track-order');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: 'Chat on WhatsApp 💬',
            onClick: () => {
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            },
            isExternal: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ]
      );
      return;
    }

    // General product keyword search across names & tags
    const matchingProducts = products
      .filter((p) => {
        const pName = (p.name || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pSub = (p.subCategory || '').toLowerCase();
        const pBrand = (p.brand || '').toLowerCase();
        return (
          pName.includes(lower) ||
          pCat.includes(lower) ||
          pSub.includes(lower) ||
          pBrand.includes(lower)
        );
      })
      .slice(0, 3);

    if (matchingProducts.length > 0) {
      pushBotReply(
        `I found ${matchingProducts.length} items matching "${query}". Tap any piece to view details:`,
        [
          {
            label: '🛍️ Explore All Collections',
            onClick: () => {
              navigate('/men');
              setIsOpen(false);
            },
            isPrimary: true,
          },
          {
            label: '↩️ Main Menu',
            onClick: () => handleSelectOption('main'),
          },
        ],
        matchingProducts
      );
      return;
    }

    // Friendly fallback response with WhatsApp option
    pushBotReply(
      `Thank you for asking about "${query}". ✨ Our concierge team is happy to assist you personally with product availability and bespoke sizing:`,
      [
        {
          label: 'Chat with Concierge on WhatsApp 💬',
          onClick: () => {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          },
          isPrimary: true,
          isExternal: true,
        },
        {
          label: '🛍️ Explore Collections',
          onClick: () => handleSelectOption('shop'),
        },
        {
          label: '↩️ Main Menu',
          onClick: () => handleSelectOption('main'),
        },
      ]
    );
  };

  return (
    <>
      {/* Floating Animated Chat Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Shopping Concierge"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#111113] via-[#2A241C] to-[#111113] border-2 border-[#D4AF37] text-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
        >
          {/* Subtle golden pulsing glow ring */}
          <span className="absolute -inset-1 rounded-full bg-[#D4AF37] opacity-25 animate-ping pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform group-hover:rotate-90 duration-300" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-2.5 h-2.5 text-[#F3E5AB] absolute -top-1 -right-1 animate-pulse" />
            </div>
          )}

          {/* Unread badge indicator */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#111113] text-[10px] font-black shadow-md border border-white">
              1
            </span>
          )}
        </button>
      </div>

      {/* Modern, Highly Animated Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] max-w-[430px] bg-white rounded-3xl border border-[#D5C2A5] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans">
          {/* Premium Gold & Black Header */}
          <div className="bg-[#111113] text-white px-4 py-3.5 border-b border-[#D4AF37]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B8860B] via-[#E5C07B] to-[#F3E5AB] flex items-center justify-center text-[#111113] font-bold shadow-md">
                <Sparkles className="w-4 h-4 text-[#111113]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wider text-[#F3E5AB] uppercase leading-none">
                  LAP OF LUXURY
                </h3>
                <p className="text-[10.5px] text-[#A89F91] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Personal Shopping Concierge</span>
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              {/* Working Scroll-to-Top Control Button */}
              <button
                type="button"
                onClick={handleScrollToTop}
                className="p-1.5 text-[#A89F91] hover:text-[#D4AF37] hover:bg-white/10 rounded-full transition-all cursor-pointer"
                title="Scroll to Top"
                aria-label="Scroll to top of chat"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              {/* Restart / Clear Chat */}
              <button
                type="button"
                onClick={handleRestartChat}
                className="p-1.5 text-[#A89F91] hover:text-[#D4AF37] hover:bg-white/10 rounded-full transition-all cursor-pointer"
                title="Restart Conversation"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#A89F91] hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                title="Close Concierge"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Notice & Scroll-To-Top Quick Trigger */}
          <div className="px-4 py-1.5 bg-[#FAF5E8] border-b border-[#E8DEC8] flex items-center justify-between text-[11px] text-[#8A671A] shrink-0">
            <span className="font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              Instant Shopping Assistant
            </span>

            {showScrollTop && (
              <button
                type="button"
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8A671A] hover:text-[#111113] hover:underline cursor-pointer transition-colors"
              >
                <ArrowUp className="w-3 h-3 text-[#B8860B]" />
                <span>Top of Chat</span>
              </button>
            )}
          </div>

          {/* Chat Messages Body - Independent Scrolling Area */}
          <div
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            className="p-4 space-y-3.5 overflow-y-auto max-h-[380px] sm:max-h-[420px] bg-[#FAF8F5] text-xs relative select-text"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } animate-in fade-in duration-200`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] px-4 py-2.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#111113] text-white rounded-br-xs'
                      : 'bg-white text-[#2A241E] border border-[#E8DEC8] rounded-bl-xs'
                  }`}
                >
                  <p className="text-[12px]">{msg.text}</p>
                </div>

                {/* Suggested Product Cards */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[95%] space-y-2">
                    <p className="text-[10px] uppercase font-bold text-[#8A671A] tracking-wider">
                      Suggested Creations:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 bg-white rounded-xl border border-[#D4AF37]/40 shadow-xs flex items-center justify-between gap-3 hover:border-[#D4AF37] transition-all group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={normalizeImageUrl(prod.image, prod.category)}
                              alt={prod.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                              }}
                              className="w-11 h-11 rounded-lg object-cover bg-gray-50 shrink-0 border border-[#EAE0CD]"
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold text-[#111113] truncate">
                                {prod.name}
                              </p>
                              <p className="text-[11px] font-semibold text-[#8A671A]">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              openProductDetail(prod);
                              setIsOpen(false);
                            }}
                            className="px-2.5 py-1.5 bg-[#FAF5E8] hover:bg-[#D4AF37] text-[#8A671A] hover:text-[#111113] text-[10px] font-bold rounded-lg border border-[#D4AF37]/50 shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Action / Quick Reply Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[92%]">
                    {msg.actions.map((action, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={action.onClick}
                        className={`text-left text-xs font-semibold py-2 px-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group active:scale-98 ${
                          action.isPrimary
                            ? 'bg-[#FAF5E8] border-[#D4AF37] text-[#8A671A] hover:bg-[#F3E8CE] hover:border-[#B8860B] shadow-2xs'
                            : 'bg-white border-[#E8DEC8] text-[#3D3327] hover:bg-[#FAF8F5] hover:border-[#D4AF37]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {action.label}
                        </span>
                        {action.isExternal ? (
                          <ExternalLink className="w-3 h-3 text-[#B8860B] opacity-70 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <ArrowRight className="w-3 h-3 text-[#B8860B] opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Smooth animated 3-dot typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#E8DEC8] rounded-2xl rounded-bl-xs px-3.5 py-2.5 w-16 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Menu Footer Bar */}
          <div className="px-4 py-2 bg-[#FAF5E8] border-t border-[#E8DEC8] flex items-center justify-between text-[11px] text-[#8A671A] shrink-0">
            <button
              type="button"
              onClick={() => handleSelectOption('main')}
              className="font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Main Menu</span>
            </button>

            <button
              type="button"
              onClick={handleScrollToTop}
              className="font-semibold text-[10px] text-[#7A6C58] hover:text-[#111113] flex items-center gap-1 cursor-pointer"
              title="Return to top of messages"
            >
              <ArrowUp className="w-3 h-3 text-[#B8860B]" />
              <span>Scroll to Top</span>
            </button>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[#E8DEC8] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about shoes, watches, perfumes, jeans..."
              className="flex-1 bg-[#FAF8F5] border border-[#E8DEC8] focus:border-[#B8860B] rounded-full px-4 py-2 text-xs text-[#111113] focus:outline-none placeholder:text-[#8C8274] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-full bg-[#111113] hover:bg-[#B8860B] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 active:scale-95 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
