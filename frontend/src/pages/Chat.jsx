import React, { useState, useEffect, useRef } from 'react';
import { CloudIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import LocationMap from '../components/LocationMap';
import { useDemoMode } from '../contexts/DemoModeContext';
import { useTour } from '../contexts/TourContext';
import { mockChatHistory } from '../data/mockData';

const Chat = () => {
  const { isDemoMode } = useDemoMode();
  const { isTourActive, currentStep, tourSteps } = useTour();
  
  // Load messages from localStorage or use default welcome message
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    return [
      {
        role: 'assistant',
        content: 'Hello! I\'m your Weather Insights and Forecast Advisor. I can help you with:\n\n- Weather forecasts for any location\n- Active weather alerts\n- Emergency shelter locations\n- Evacuation routes\n- Risk analysis for severe weather\n- Historical weather data\n- **Hurricane path image analysis** (upload hurricane forecast maps)\n\nWhat would you like to know?',
        timestamp: new Date(),
        mapUrl: null,
        mapMarkers: [],
        mapCenter: null
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestedActions, setSuggestedActions] = useState([
    'What are the current weather alerts in California?',
    'Give me the 7-day forecast for Miami, FL',
    'Find emergency shelters near Houston',
    'Show me evacuation routes from Tampa to Orlando'
  ]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save messages to localStorage whenever they change (excluding images to avoid quota issues)
  useEffect(() => {
    const messagesToSave = messages.map(msg => ({
      ...msg,
      image: undefined // Don't save images to localStorage to avoid quota exceeded
    }));
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
    } catch (e) {
      console.error('Failed to save messages to localStorage:', e);
      // If still failing, clear old messages
      if (e.name === 'QuotaExceededError') {
        localStorage.removeItem('chatMessages');
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for session expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('[Chat] Session expired, clearing chat history');
      // Reset to welcome message
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m your Weather Insights and Forecast Advisor. I can help you with:\n\n- Weather forecasts for any location\n- Active weather alerts\n- Emergency shelter locations\n- Evacuation routes\n- Risk analysis for severe weather\n- Historical weather data\n\nWhat would you like to know?',
          timestamp: new Date(),
          mapUrl: null,
          mapMarkers: [],
          mapCenter: null
        }
      ]);
    };
    
    window.addEventListener('sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  // Load mock chat when tour reaches chat page - step by step with contextual follow-ups
  useEffect(() => {
    if (isTourActive && isDemoMode && tourSteps[currentStep]) {
      const currentStepId = tourSteps[currentStep].id;
      
      if (currentStepId === 'chat-page') {
        console.log('[Chat] Tour active - loading mock conversation step by step');
        
        // Start with welcome message and initial suggestions
        setMessages([{
          role: 'assistant',
          content: 'Hello! I\'m your Weather Insights and Forecast Advisor. Ask me about Hurricane Milton or any weather concerns.',
          timestamp: new Date(),
          mapUrl: null,
          mapMarkers: [],
          mapCenter: null
        }]);
        
        // Initial suggestions
        setSuggestedActions([
          "What's the current hurricane threat to Tampa?",
          "Show me weather alerts for Florida",
          "Find emergency shelters near me"
        ]);
        
        // Display messages one by one with delays and update suggestions
        const displayMessagesSequentially = async () => {
          for (let i = 0; i < mockChatHistory.length; i++) {
            await new Promise(resolve => setTimeout(resolve, i === 0 ? 1500 : 3000));
            
            const msg = mockChatHistory[i];
            const formattedMsg = {
              ...msg,
              timestamp: new Date(),
              mapUrl: null,
              mapMarkers: [],
              mapCenter: null
            };
            
            setMessages(prev => [...prev, formattedMsg]);
            
            // Update suggestions after each assistant response
            if (msg.role === 'assistant') {
              if (i === 1) {
                // After first response about hurricane threat
                setSuggestedActions([
                  "Where are the nearest shelters?",
                  "What evacuation routes should I take?",
                  "How do I prepare for the storm?"
                ]);
              } else if (i === 3) {
                // After shelter information
                setSuggestedActions([
                  "What supplies should I bring to the shelter?",
                  "Are there pet-friendly shelters?",
                  "What's the latest forecast update?"
                ]);
              }
            }
            
            // Show typing indicator for assistant responses
            if (msg.role === 'user' && i < mockChatHistory.length - 1) {
              setLoading(true);
              await new Promise(resolve => setTimeout(resolve, 1500));
              setLoading(false);
            }
          }
        };
        
        displayMessagesSequentially();
      }
    }
  }, [isTourActive, currentStep, isDemoMode, tourSteps]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMessage = {
      role: 'user',
      content: input || 'Analyze this hurricane path image and perform risk assessment',
      timestamp: new Date(),
      image: imagePreview
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(true);

    try {
      // Use appropriate API method based on whether there's an image
      const response = currentImage 
        ? await api.queryWithImage(currentInput || 'Analyze this hurricane path image and perform risk assessment', currentImage)
        : await api.query(currentInput);
      
      // Extract map URL and coordinates from response
      let mapUrl = null;
      let mapMarkers = [];
      let mapCenter = null;
      let content = response.content || 'I apologize, but I encountered an error processing your request.';
      
      if (content) {
        // Extract map URL
        const mapUrlMatch = content.match(/https:\/\/www\.google\.com\/maps[^\s)]+/);
        if (mapUrlMatch) {
          mapUrl = mapUrlMatch[0];
          // Remove the map URL from content
          content = content
            .replace(/View map:\s*\[?https:\/\/www\.google\.com\/maps[^\s)\]]+\]?/gi, '')
            .replace(/\[View map\]\(https:\/\/www\.google\.com\/maps[^)]+\)/gi, '')
            .replace(/https:\/\/www\.google\.com\/maps[^\s)]+/g, '')
            .replace(/\n\n+/g, '\n\n')
            .trim();
        }
        
        // Parse coordinates from response - pattern: "Name (lat, lng)"
        const locationPattern = /(\d+)\.\s*\*\*([^*]+)\*\*\s*\((-?\d+\.\d+),\s*(-?\d+\.\d+)\)/g;
        let match;
        
        while ((match = locationPattern.exec(response.content)) !== null) {
          const [, , name, lat, lng] = match;
          mapMarkers.push({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            title: name.trim(),
            address: ''
          });
        }
        
        // Set center to first marker if markers exist
        if (mapMarkers.length > 0) {
          mapCenter = [mapMarkers[0].lat, mapMarkers[0].lng];
        }
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: content,
        timestamp: new Date(),
        mapUrl: mapUrl,
        mapMarkers: mapMarkers,
        mapCenter: mapCenter
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate contextual suggestions based on the conversation
      if (currentInput && content) {
        setLoadingSuggestions(true);
        try {
          const suggestions = await api.getSuggestedActions(currentInput, content);
          if (suggestions && suggestions.length > 0) {
            setSuggestedActions(suggestions);
          }
        } catch (error) {
          console.error('Failed to get suggestions:', error);
        } finally {
          setLoadingSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        mapUrl: null,
        mapMarkers: [],
        mapCenter: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


  const handleQuickAction = async (action) => {
    // In demo mode during tour, simulate responses for follow-up questions
    if (isDemoMode && isTourActive) {
      const mockResponses = {
        "Where are the nearest shelters?": "**Open Emergency Shelters Near You:**\n\n1. **Tampa Convention Center** ⭐ RECOMMENDED\n   - 📍 333 S Franklin St (2.3 miles)\n   - 📞 (813) 274-8511\n   - ✅ 1,200 spaces available\n   - 🐕 Pet-friendly\n\n2. **Blake High School**\n   - 📍 1701 N Blvd (4.1 miles)\n   - ✅ 450 spaces available",
        "What evacuation routes should I take?": "**Recommended Evacuation Routes from Tampa:**\n\n🛣️ **Primary Route:** I-75 North\n- Head north toward Gainesville\n- Avoid peak traffic hours (3-7 PM)\n- Estimated time: 2-3 hours\n\n🛣️ **Alternate Route:** I-4 East\n- Head toward Orlando\n- Less congested than I-75\n- Estimated time: 1.5-2 hours\n\n⚠️ **Leave NOW** - conditions will deteriorate rapidly!",
        "How do I prepare for the storm?": "**Hurricane Preparation Checklist:**\n\n✅ **Immediate Actions:**\n- Fill gas tank\n- Withdraw cash ($200-300)\n- Charge all devices\n- Fill bathtubs with water\n\n✅ **Emergency Kit:**\n- 3 days of water (1 gal/person/day)\n- Non-perishable food\n- Medications\n- Flashlights & batteries\n- First aid kit\n\n✅ **Secure Property:**\n- Board up windows\n- Bring in outdoor items\n- Turn fridge to coldest setting",
        "What supplies should I bring to the shelter?": "**Essential Shelter Supplies:**\n\n📋 **Documents:**\n- ID, insurance papers\n- Medical records\n- Important contacts list\n\n🎒 **Personal Items:**\n- 3-day supply of medications\n- Bedding (pillow, blanket)\n- Change of clothes\n- Toiletries\n\n🍽️ **Food & Water:**\n- Non-perishable snacks\n- Water bottles\n- Baby formula (if needed)\n\n📱 **Electronics:**\n- Phone charger\n- Portable battery pack\n- Entertainment (books, games)",
        "Are there pet-friendly shelters?": "**Pet-Friendly Shelters in Tampa:**\n\n🐕 **Tampa Convention Center**\n- 📍 333 S Franklin St\n- ✅ Accepts all pets\n- Requirements: Leash/carrier, vaccination records\n\n🐕 **Middleton High School**\n- 📍 4801 N 22nd St\n- ✅ Accepts dogs and cats\n- Separate pet area available\n\n⚠️ **Bring:** Leash, carrier, food, water bowls, medications, vaccination records",
        "What's the latest forecast update?": "**Latest Hurricane Milton Update:**\n\n🌀 **Current Status:**\n- Category 4 hurricane\n- Winds: 150 mph sustained\n- Location: 145 miles SW of Tampa\n- Movement: NNE at 12 mph\n\n⏰ **Timeline:**\n- Tropical storm winds: 6 hours\n- Hurricane force winds: 12 hours\n- Landfall: Tomorrow 6 AM\n\n⚠️ **Impacts:**\n- Storm surge: 12-15 feet\n- Rainfall: 10-15 inches\n- Life-threatening situation",
        
        // Extended conversation responses
        "What's the traffic situation?": "**Current Traffic Conditions:**\n\n🚗 **I-75 North:**\n- ⚠️ Heavy congestion near exits 265-275\n- Average speed: 35 mph\n- Estimated delay: +45 minutes\n\n🚗 **I-4 East:**\n- ✅ Moderate traffic\n- Average speed: 55 mph\n- Better option right now\n\n💡 **Tips:**\n- Use Waze for real-time updates\n- Avoid downtown Tampa (gridlock)\n- Consider leaving between 10 PM - 5 AM for lighter traffic",
        
        "Where should I go after evacuating?": "**Safe Evacuation Destinations:**\n\n🏨 **Gainesville (120 miles north):**\n- Hotels: Holiday Inn, Hampton Inn\n- Outside hurricane path\n- 2-3 hour drive\n\n🏨 **Orlando (85 miles east):**\n- Many hotel options\n- Safer inland location\n- 1.5-2 hour drive\n\n🏨 **Tallahassee (280 miles north):**\n- Completely safe from storm\n- 4-5 hour drive\n- Book accommodations NOW\n\n💡 **Tip:** Call ahead - hotels filling up fast!",
        
        "What if I can't evacuate?": "**If You Cannot Evacuate:**\n\n🏠 **Shelter in Place:**\n- Move to interior room (bathroom, closet)\n- Stay away from windows\n- Get under sturdy furniture if possible\n\n⚠️ **Critical Supplies:**\n- Fill bathtubs with water NOW\n- Charge all devices\n- Have flashlights ready\n- Keep radio for updates\n\n📞 **Emergency Contacts:**\n- 911 for life-threatening emergencies\n- 211 for shelter information\n- Text SHELTER + ZIP to 43362\n\n⚠️ **IMPORTANT:** If storm surge enters your home, move to highest floor immediately!",
        
        "How do I secure my windows?": "**Window Protection Guide:**\n\n🔨 **Plywood Boarding:**\n- Use 5/8\" plywood minimum\n- Cover entire window + 4\" overlap\n- Secure with 2.5\" screws every 12\"\n- Mark which window each board fits\n\n🪟 **Hurricane Shutters:**\n- Close and lock all shutters\n- Check tracks are clear\n- Test operation before storm\n\n❌ **DON'T Use Tape:**\n- Tape does NOT prevent breakage\n- Creates larger, more dangerous shards\n- Common myth - avoid this!\n\n⏰ **Do This NOW:** Winds will be too strong in 6-8 hours!",
        
        "Should I turn off utilities?": "**Utility Shutdown Guide:**\n\n⚡ **Electricity:**\n- ❌ DON'T turn off main breaker\n- ✅ Unplug electronics\n- ✅ Turn off individual breakers for non-essentials\n- Keep fridge/freezer on until power goes out\n\n💧 **Water:**\n- ❌ DON'T shut off main water\n- ✅ Fill bathtubs and containers\n- ✅ Know location of shut-off valve\n- Only shut off if flooding occurs\n\n🔥 **Gas:**\n- ✅ Turn off if you smell gas\n- ✅ Know shut-off valve location\n- ⚠️ Only utility company should turn back on\n\n💡 **After Storm:** Don't restore utilities until inspected!",
        
        "What about my important documents?": "**Document Protection Strategy:**\n\n📄 **Take With You:**\n- IDs, passports\n- Insurance policies (home, auto, health)\n- Medical records\n- Bank account info\n- Property deeds/titles\n- Birth certificates, SSN cards\n\n💾 **Digital Backup:**\n- Scan all documents to cloud storage\n- Email copies to yourself\n- Store on USB drive\n- Take photos with phone\n\n🔒 **Waterproof Storage:**\n- Use waterproof document bag\n- Seal in multiple ziplock bags\n- Store in fireproof safe if staying\n- Keep in car if evacuating\n\n⏰ **Do This NOW:** Takes 30 minutes, could save years of hassle!",
        
        "How long will the storm last?": "**Hurricane Milton Timeline:**\n\n⏰ **Hour-by-Hour Forecast:**\n\n**Tonight (6 PM - Midnight):**\n- Tropical storm winds begin\n- Bands of heavy rain\n- Conditions deteriorating\n\n**Tonight (Midnight - 6 AM):**\n- Hurricane force winds arrive\n- Torrential rain\n- Storm surge begins\n\n**Tomorrow (6 AM - Noon):**\n- 🌀 LANDFALL - Peak intensity\n- Catastrophic winds (150 mph)\n- Maximum storm surge (12-15 ft)\n\n**Tomorrow (Noon - 6 PM):**\n- Winds gradually decrease\n- Flooding continues\n- Still dangerous\n\n**Tomorrow Evening:**\n- Conditions improve\n- Winds below hurricane force\n\n⚠️ **Total Duration:** 18-24 hours of dangerous conditions",
        
        "When is it safe to return home?": "**Post-Storm Safety Guide:**\n\n⏰ **Wait for All-Clear:**\n- Official announcement from authorities\n- Usually 12-24 hours after storm passes\n- Don't return during \"eye\" - winds return!\n\n⚠️ **Hazards After Storm:**\n- Downed power lines (assume live!)\n- Flooded roads (6\" can sweep car away)\n- Damaged buildings (structural collapse risk)\n- Contaminated water\n- Wildlife (snakes, alligators displaced)\n\n✅ **Before Entering Home:**\n- Check for gas leaks (smell)\n- Look for structural damage\n- Document damage (photos for insurance)\n- Wear boots, gloves, long pants\n\n📞 **Report:**\n- Downed power lines: Utility company\n- Gas leaks: 911\n- Road hazards: 311\n\n💡 **Estimate:** Safe return likely 24-48 hours after landfall"
      };

      const response = mockResponses[action];
      if (response) {
        // Add user message
        const userMsg = {
          role: 'user',
          content: action,
          timestamp: new Date(),
          mapUrl: null,
          mapMarkers: [],
          mapCenter: null
        };
        setMessages(prev => [...prev, userMsg]);
        
        // Show typing indicator
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        
        // Add assistant response
        const assistantMsg = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          mapUrl: null,
          mapMarkers: [],
          mapCenter: null
        };
        setMessages(prev => [...prev, assistantMsg]);
        
        // Update suggestions based on the question - create conversation trees
        if (action.includes("evacuation routes")) {
          setSuggestedActions([
            "What's the traffic situation?",
            "Where should I go after evacuating?",
            "What if I can't evacuate?"
          ]);
        } else if (action.includes("prepare") || action.includes("preparation")) {
          setSuggestedActions([
            "How do I secure my windows?",
            "Should I turn off utilities?",
            "What about my important documents?"
          ]);
        } else if (action.includes("traffic")) {
          setSuggestedActions([
            "Where should I go after evacuating?",
            "What if I can't evacuate?",
            "What's the latest forecast update?"
          ]);
        } else if (action.includes("go after evacuating") || action.includes("destination")) {
          setSuggestedActions([
            "How do I prepare for the storm?",
            "What supplies should I bring to the shelter?",
            "What's the latest forecast update?"
          ]);
        } else if (action.includes("can't evacuate") || action.includes("shelter in place")) {
          setSuggestedActions([
            "How do I secure my windows?",
            "Should I turn off utilities?",
            "What supplies do I need if staying?"
          ]);
        } else if (action.includes("secure my windows")) {
          setSuggestedActions([
            "Should I turn off utilities?",
            "What about my important documents?",
            "How long will the storm last?"
          ]);
        } else if (action.includes("turn off utilities")) {
          setSuggestedActions([
            "What about my important documents?",
            "How do I secure my windows?",
            "When is it safe to return home?"
          ]);
        } else if (action.includes("important documents")) {
          setSuggestedActions([
            "What supplies should I bring to the shelter?",
            "How long will the storm last?",
            "When is it safe to return home?"
          ]);
        } else if (action.includes("how long") || action.includes("duration")) {
          setSuggestedActions([
            "When is it safe to return home?",
            "What's the latest forecast update?",
            "What if I can't evacuate?"
          ]);
        } else if (action.includes("safe to return") || action.includes("after the storm")) {
          setSuggestedActions([
            "How long will the storm last?",
            "What's the latest forecast update?",
            "Where are the nearest shelters?"
          ]);
        } else if (action.includes("supplies")) {
          setSuggestedActions([
            "Are there pet-friendly shelters?",
            "What about my important documents?",
            "What's the latest forecast update?"
          ]);
        } else if (action.includes("pet")) {
          setSuggestedActions([
            "What supplies should I bring to the shelter?",
            "Where are the nearest shelters?",
            "What evacuation routes should I take?"
          ]);
        } else if (action.includes("forecast") || action.includes("update")) {
          setSuggestedActions([
            "How long will the storm last?",
            "When is it safe to return home?",
            "What evacuation routes should I take?"
          ]);
        } else {
          // Default suggestions for other questions
          setSuggestedActions([
            "What's the latest forecast update?",
            "How long will the storm last?",
            "When is it safe to return home?"
          ]);
        }
        
        return;
      }
    }
    
    // Normal mode: just set the input
    setInput(action);
    // Auto-submit if it's a complete question
    if (action.endsWith('?') || action.includes('Show') || action.includes('Find') || action.includes('Get')) {
      // Trigger form submission after a brief delay to allow state update
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 100);
    }
  };

  const handleClearChat = () => {
    const welcomeMessage = {
      role: 'assistant',
      content: 'Hello! I\'m your Weather Insights and Forecast Advisor. I can help you with:\n\n- Weather forecasts for any location\n- Active weather alerts\n- Emergency shelter locations\n- Evacuation routes\n- Risk analysis for severe weather\n- Historical weather data\n- **Hurricane path image analysis** (upload hurricane forecast maps)\n\nWhat would you like to know?',
      timestamp: new Date(),
      mapUrl: null,
      mapMarkers: [],
      mapCenter: null
    };
    setMessages([welcomeMessage]);
    localStorage.setItem('chatMessages', JSON.stringify([welcomeMessage]));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]" data-tour-id="chat-interface">
      {/* Chat Header */}
      <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CloudIcon className="h-6 w-6 mr-2 text-primary" />
              Weather Advisor Chat
            </h2>
            <p className="text-sm text-gray-600 mt-1">Ask me anything about weather, forecasts, and emergency planning</p>
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  {message.role === 'user' ? (
                    <UserIcon className="h-5 w-5 text-white" />
                  ) : (
                    <CloudIcon className="h-5 w-5 text-gray-700" />
                  )}
                </div>
              </div>

              {/* Message Bubble */}
              <div className="space-y-3">
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <div>
                      {message.image && (
                        <div className="mb-3">
                          <img 
                            src={message.image} 
                            alt="Uploaded" 
                            className="max-w-sm rounded-lg border-2 border-white shadow-lg"
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        h1: ({node, children, ...props}) => <h1 className="text-lg font-bold mb-2" {...props}>{children}</h1>,
                        h2: ({node, children, ...props}) => <h2 className="text-md font-semibold mb-2 mt-3" {...props}>{children}</h2>,
                        h3: ({node, children, ...props}) => <h3 className="text-sm font-semibold mb-1 mt-2" {...props}>{children}</h3>,
                        p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-2 ml-2" {...props} />,
                        li: ({node, ...props}) => <li {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-3 border-gray-300" {...props} />,
                        a: ({node, children, ...props}) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {/* Embedded Map with Markers */}
                {message.role === 'assistant' && (message.mapMarkers?.length > 0 || message.mapUrl) && (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    {message.mapMarkers?.length > 0 ? (
                      <div>
                        <div className="bg-gray-100 px-3 py-2 text-sm text-gray-700 font-medium">
                          📍 {message.mapMarkers.length} Location{message.mapMarkers.length > 1 ? 's' : ''} Found
                        </div>
                        <LocationMap 
                          markers={message.mapMarkers}
                          height="350px" 
                        />
                      </div>
                    ) : message.mapUrl ? (
                      <div>
                        <div className="bg-gray-100 px-3 py-2 text-sm text-gray-700 font-medium">
                          📍 Map View
                        </div>
                        <iframe
                          width="100%"
                          height="300px"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={message.mapUrl}
                          allowFullScreen
                          loading="lazy"
                          title="Map"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-3xl">
              <div className="mr-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <CloudIcon className="h-5 w-5 text-gray-700" />
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Quick Actions - Always visible */}
      {!loading && (
        <div className="bg-white border-t p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 font-medium">
              {messages.length === 1 ? '💡 Quick actions:' : '💡 Suggested follow-ups:'}
            </p>
            {loadingSuggestions && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={loadingSuggestions}
                className="text-sm px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg text-gray-700 transition-all border border-blue-200 hover:border-blue-300 hover:shadow-sm disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-b-lg shadow-md p-4 border-t">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-xs rounded-lg border-2 border-gray-300 shadow-sm"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            <div className="mt-2 text-sm text-gray-600">
              📸 Hurricane path image ready for analysis
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            title="Upload hurricane path image"
          >
            <PhotoIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? "Add message (optional)" : "Ask about weather, forecasts, alerts, or upload hurricane image..."}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedImage)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <span>Send</span>
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
