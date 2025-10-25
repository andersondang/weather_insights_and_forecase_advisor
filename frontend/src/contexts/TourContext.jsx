import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem('tourCompleted') === 'true';
  });

  const tourSteps = [
    {
      id: 'welcome',
      title: '🎬 Welcome to the Demo Tour!',
      description: 'Let me show you how our Weather Insights platform helps you stay safe during severe weather events. This demo features a realistic Hurricane Milton scenario.',
      page: '/',
      highlight: null,
      position: 'center'
    },
    {
      id: 'demo-mode',
      title: '🎯 Demo Mode',
      description: 'Notice the yellow "DEMO MODE" button in the top right. This means you\'re viewing realistic mock data. You can switch to live data anytime by clicking it.',
      page: '/',
      highlight: 'demo-toggle',
      position: 'bottom'
    },
    {
      id: 'dashboard-alerts',
      title: '⚠️ Critical Alerts Dashboard',
      description: 'The dashboard shows active severe weather alerts. Right now, Hurricane Milton (Category 4) is approaching the Gulf Coast with life-threatening conditions.',
      page: '/',
      highlight: 'alerts-section',
      position: 'top'
    },
    {
      id: 'risk-analysis',
      title: '📊 AI Risk Analysis',
      description: 'Click "Analyze Risk" on any alert to get detailed impact assessment, safety recommendations, and evacuation guidance powered by AI.',
      page: '/',
      highlight: 'alerts-section',
      position: 'top'
    },
    {
      id: 'dashboard-map',
      title: '🗺️ Interactive Alert Map',
      description: 'The map visualizes alert locations. Red markers indicate extreme threats. You can see the hurricane warning zone covering Tampa Bay.',
      page: '/',
      highlight: 'map-section',
      position: 'top'
    },
    {
      id: 'chat-page',
      title: '💬 AI Weather Assistant',
      description: 'Ask questions about weather conditions, get personalized safety advice, and receive real-time updates. The AI understands context and provides actionable guidance.',
      page: '/chat',
      highlight: 'chat-interface',
      position: 'top'
    },
    {
      id: 'forecast-page',
      title: '📊 Detailed Forecast',
      description: 'See hour-by-hour and daily forecasts. Watch how conditions deteriorate as Hurricane Milton approaches - winds increasing from 25 mph to 150+ mph.',
      page: '/forecast',
      highlight: 'forecast-section',
      position: 'top'
    },
    {
      id: 'emergency-resources',
      title: '🏥 Emergency Resources',
      description: 'Find nearby shelters, hospitals, and evacuation routes. See real-time capacity, amenities, and contact information. Critical for evacuation planning.',
      page: '/emergency-resources',
      highlight: 'resources-section',
      position: 'top'
    },
    {
      id: 'hurricane-simulation',
      title: '🌀 Hurricane Impact Analysis',
      description: 'Advanced simulation showing storm surge, wind speeds, rainfall totals, and evacuation priorities. Identifies high-risk locations that need immediate evacuation.',
      page: '/hurricane-simulation',
      highlight: 'simulation-section',
      position: 'top'
    },
    {
      id: 'complete',
      title: '✅ Tour Complete!',
      description: 'You\'ve seen all the key features! Feel free to explore on your own. Toggle between Demo and Live modes anytime. Stay safe! 🌤️',
      page: '/hurricane-simulation',
      highlight: null,
      position: 'center'
    }
  ];

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
  };

  const completeTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    setHasCompletedTour(true);
    localStorage.setItem('tourCompleted', 'true');
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    localStorage.removeItem('tourCompleted');
  };

  const getCurrentStep = () => tourSteps[currentStep];

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStep,
        tourSteps,
        hasCompletedTour,
        startTour,
        nextStep,
        previousStep,
        skipTour,
        completeTour,
        resetTour,
        getCurrentStep
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
