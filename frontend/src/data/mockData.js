// Comprehensive mock data for demo mode

export const mockDashboardData = {
  alerts: [
    {
      id: "1",
      event: "Hurricane Warning",
      severity: "Extreme",
      area: "Coastal Florida",
      headline: "Category 4 Hurricane Milton approaching Gulf Coast",
      description: "Extremely dangerous Category 4 hurricane with sustained winds of 150 mph expected to make landfall within 24 hours. Life-threatening storm surge of 12-15 feet possible along the coast.",
      instruction: "EVACUATE IMMEDIATELY if in evacuation zones A, B, or C. This is a life-threatening situation.",
      onset: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      expires: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      urgency: "Immediate",
      certainty: "Observed"
    },
    {
      id: "2",
      event: "Tornado Watch",
      severity: "Severe",
      area: "Central Texas",
      headline: "Tornado Watch in effect until 10:00 PM CDT",
      description: "Conditions favorable for tornadoes. Large hail up to 3 inches and damaging winds up to 75 mph also possible.",
      instruction: "Be ready to take shelter. Monitor weather radio or local media for warnings.",
      onset: new Date().toISOString(),
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      urgency: "Expected",
      certainty: "Likely"
    },
    {
      id: "3",
      event: "Flash Flood Warning",
      severity: "Severe",
      area: "Los Angeles County",
      headline: "Flash Flood Warning for urban areas",
      description: "Heavy rainfall of 2-4 inches per hour causing dangerous flash flooding in urban areas and near recent burn scars.",
      instruction: "Move to higher ground immediately. Do not drive through flooded areas.",
      onset: new Date().toISOString(),
      expires: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      urgency: "Immediate",
      certainty: "Observed"
    }
  ],
  map_data: {
    center: { lat: 28.5, lng: -82.5 },
    zoom: 7,
    markers: [
      { 
        lat: 27.9506, 
        lng: -82.4572, 
        title: "Tampa Bay - Hurricane Warning", 
        severity: "Extreme",
        address: "Tampa, FL - Category 4 Hurricane Milton approaching"
      },
      { 
        lat: 27.7676, 
        lng: -82.6403, 
        title: "St. Petersburg - Hurricane Warning", 
        severity: "Extreme",
        address: "St. Petersburg, FL - Extreme storm surge risk"
      },
      { 
        lat: 28.5383, 
        lng: -81.3792, 
        title: "Orlando - Tropical Storm Warning", 
        severity: "Severe",
        address: "Orlando, FL - Heavy rain and wind expected"
      },
      { 
        lat: 27.4989, 
        lng: -82.5748, 
        title: "Bradenton - Hurricane Warning", 
        severity: "Extreme",
        address: "Bradenton, FL - Mandatory evacuation in effect"
      },
      { 
        lat: 28.0172, 
        lng: -82.7390, 
        title: "Tarpon Springs - Hurricane Warning", 
        severity: "Extreme",
        address: "Tarpon Springs, FL - Coastal flooding expected"
      }
    ]
  },
  total_count: 3,
  severe_count: 3,
  insights: "🚨 CRITICAL SITUATION: Category 4 Hurricane Milton poses extreme threat to Gulf Coast. Immediate evacuation required for coastal zones. Multiple severe weather threats across the nation including tornadoes in Texas and flash flooding in California."
};

export const mockForecastData = {
  location: "Tampa, Florida",
  current_conditions: "🌤️ Currently 84°F and Partly Cloudy. Humidity: 78%. Winds: ESE at 25 mph. Feels like 92°F. Pressure: 29.65 inHg and falling rapidly. Conditions will deteriorate significantly over the next 12 hours as Hurricane Milton approaches.",
  daily_forecasts: [
    { 
      date: "2025-10-25",
      day: "Today", 
      high: 86, 
      low: 70, 
      conditions: "Deteriorating to Hurricane", 
      precipitation: 100,
      description: "Partly cloudy morning becoming stormy by afternoon. Hurricane conditions by evening."
    },
    { 
      date: "2025-10-26",
      day: "Tomorrow", 
      high: 75, 
      low: 68, 
      conditions: "Hurricane Impact", 
      precipitation: 100,
      description: "Category 4 hurricane with 150 mph winds. Catastrophic damage expected."
    },
    { 
      date: "2025-10-27",
      day: "Sunday", 
      high: 78, 
      low: 70, 
      conditions: "Improving", 
      precipitation: 60,
      description: "Conditions improving but still windy and rainy. Flooding continues."
    },
    { 
      date: "2025-10-28",
      day: "Monday", 
      high: 82, 
      low: 72, 
      conditions: "Partly Cloudy", 
      precipitation: 30,
      description: "Partly cloudy with scattered showers. Cleanup and recovery begins."
    },
    { 
      date: "2025-10-29",
      day: "Tuesday", 
      high: 85, 
      low: 74, 
      conditions: "Mostly Sunny", 
      precipitation: 10,
      description: "Mostly sunny. Much improved conditions."
    },
    { 
      date: "2025-10-30",
      day: "Wednesday", 
      high: 86, 
      low: 75, 
      conditions: "Sunny", 
      precipitation: 5,
      description: "Sunny and pleasant. Normal weather returns."
    },
    { 
      date: "2025-10-31",
      day: "Thursday", 
      high: 87, 
      low: 76, 
      conditions: "Sunny", 
      precipitation: 5,
      description: "Sunny and warm. Typical Florida weather."
    }
  ],
  insights: "⚠️ **CRITICAL WEATHER SITUATION**: Hurricane Milton (Category 4) will make landfall near Tampa Bay within 24 hours. This is an extremely dangerous, life-threatening situation. **Today**: Conditions deteriorate rapidly - tropical storm force winds by 6 PM, hurricane force winds by midnight. **Tomorrow**: Peak impacts with 150 mph winds, 12-15 feet storm surge, and 10-15 inches of rain causing catastrophic flooding. **Weekend**: Gradual improvement but significant flooding and damage will persist. **IMMEDIATE ACTION REQUIRED**: If you are in evacuation zones A, B, or C, you must evacuate NOW. This is your last safe window to leave. If you cannot evacuate, seek shelter immediately at Tampa Convention Center or other designated shelters."
};

export const mockEmergencyResources = {
  shelters: [
    {
      name: "Tampa Convention Center",
      address: "333 S Franklin St, Tampa, FL 33602",
      phone: "(813) 274-8511",
      capacity: 2500,
      available: 1200,
      amenities: ["Pet-friendly", "Medical staff", "Food", "Water", "Generators"],
      distance: 2.3,
      status: "Open - Accepting evacuees"
    },
    {
      name: "Blake High School",
      address: "1701 N Blvd, Tampa, FL 33607",
      phone: "(813) 276-5620",
      capacity: 800,
      available: 450,
      amenities: ["ADA accessible", "Food", "Water", "Cots"],
      distance: 4.1,
      status: "Open"
    },
    {
      name: "Middleton High School",
      address: "4801 N 22nd St, Tampa, FL 33610",
      phone: "(813) 231-1700",
      capacity: 1000,
      available: 680,
      amenities: ["Pet-friendly", "Food", "Water", "Medical staff"],
      distance: 5.8,
      status: "Open"
    }
  ],
  hospitals: [
    {
      name: "Tampa General Hospital",
      address: "1 Tampa General Cir, Tampa, FL 33606",
      phone: "(813) 844-7000",
      type: "Level 1 Trauma Center",
      emergency: "24/7",
      distance: 1.8,
      status: "Operational - Emergency services available"
    },
    {
      name: "St. Joseph's Hospital",
      address: "3001 W Martin Luther King Jr Blvd, Tampa, FL 33607",
      phone: "(813) 870-4000",
      type: "Full Service",
      emergency: "24/7",
      distance: 3.2,
      status: "Operational"
    }
  ],
  emergencyContacts: [
    { service: "Emergency (Police/Fire/Medical)", number: "911" },
    { service: "Hillsborough County Emergency Management", number: "(813) 272-5900" },
    { service: "Florida Division of Emergency Management", number: "1-800-342-3557" },
    { service: "Red Cross Disaster Hotline", number: "1-800-RED-CROSS" },
    { service: "FEMA Helpline", number: "1-800-621-3362" },
    { service: "National Hurricane Center", number: "(305) 229-4470" }
  ],
  evacuationRoutes: [
    {
      name: "I-75 North",
      status: "Open - Heavy traffic",
      description: "Primary evacuation route to Central/North Florida",
      contraflow: "Active northbound"
    },
    {
      name: "I-4 East",
      status: "Open - Moderate traffic",
      description: "Route to Orlando and East Coast",
      contraflow: "Not active"
    },
    {
      name: "US-41 North",
      status: "Open - Light traffic",
      description: "Alternate route through Pasco County",
      contraflow: "Not active"
    }
  ],
  summary: "🚨 EVACUATION ORDERS IN EFFECT for Zones A, B, and C. Multiple shelters are open and accepting evacuees. If you cannot evacuate, go to the nearest shelter immediately. Do not wait - conditions will deteriorate rapidly."
};

export const mockHurricaneSimulation = {
  hurricane: {
    name: "Hurricane Milton",
    category: 4,
    windSpeed: 150,
    pressure: 938,
    movement: "NNE at 12 mph",
    location: "25.5°N, 83.2°W",
    distanceToLandfall: "145 miles SW of Tampa",
    estimatedLandfall: "Tomorrow 6:00 AM EDT"
  },
  impacts: {
    stormSurge: {
      max: "12-15 feet",
      areas: ["Tampa Bay", "St. Petersburg", "Clearwater", "Bradenton"],
      timing: "Beginning tonight, peak tomorrow morning"
    },
    wind: {
      max: "150 mph sustained, 180 mph gusts",
      hurricaneForce: "Extending 60 miles from center",
      tropicalStorm: "Extending 175 miles from center"
    },
    rainfall: {
      total: "10-15 inches",
      rate: "3-5 inches per hour at peak",
      flooding: "Catastrophic flash flooding expected"
    },
    tornadoes: {
      risk: "High",
      areas: "Outer rain bands across Central Florida"
    }
  },
  // Add image analysis results
  imageAnalysis: {
    confidence: 0.93,
    features: [
      "Well-defined eye wall structure",
      "Symmetrical cloud pattern",
      "Strong convective bands",
      "Cold cloud tops (-80°C)",
      "Expanding wind field"
    ],
    intensity: {
      current: "Category 4",
      trend: "Rapid Intensification",
      next24h: "Category 4-5"
    },
    movement: {
      direction: "NNE",
      speed: "12 mph",
      confidence: "High"
    }
  },
  
  evacuationPriority: {
    prioritized_locations: [
      {
        latitude: 27.7676,
        longitude: -82.6403,
        risk_score: 9.8,
        details: {
          state: "FL",
          station_name: "St. Petersburg Beach",
          reason: "Extreme storm surge risk + low elevation",
          population: 9200,
          evacuation_zone: "A",
          elevation: "3 ft",
          flood_risk: "Extreme",
          wind_risk: "Extreme"
        }
      },
      {
        latitude: 27.9506,
        longitude: -82.4572,
        risk_score: 9.5,
        details: {
          state: "FL",
          station_name: "Downtown Tampa",
          reason: "Storm surge + wind + flooding",
          population: 45000,
elevation: "15 ft",
          flood_risk: "High",
          wind_risk: "Extreme",
          evacuation_zone: "A"
        }
      },
      {
        latitude: 27.8643,
        longitude: -82.6318,
        risk_score: 9.3,
        details: {
          state: "FL",
          station_name: "Clearwater Beach",
          reason: "Direct coastal exposure",
          population: 11200,
          evacuation_zone: "A"
        }
      },
      {
        latitude: 27.4989,
        longitude: -82.5748,
        risk_score: 8.9,
        details: {
          state: "FL",
          station_name: "Bradenton Beach",
          reason: "Barrier island vulnerability",
          population: 1200,
          evacuation_zone: "A"
        }
      },
      {
        latitude: 28.0172,
        longitude: -82.7390,
        risk_score: 8.7,
        details: {
          state: "FL",
          station_name: "Tarpon Springs",
          reason: "Storm surge + coastal flooding",
          population: 25000,
          evacuation_zone: "B"
        }
      }
    ],
    total_unique_locations: 20,
    state_distribution: { FL: 20 },
    summary: "Identified 20 high-risk evacuation priority locations across coastal Florida. Immediate evacuation required for 150,000+ residents in Zones A and B."
  },
  timeline: [
    { time: "Now", event: "Hurricane 145 miles offshore", status: "warning" },
    { time: "+6 hours", event: "Tropical storm force winds begin", status: "warning" },
    { time: "+12 hours", event: "Hurricane force winds arrive", status: "danger" },
    { time: "+18 hours", event: "Landfall imminent - TAKE SHELTER", status: "danger" },
    { time: "+24 hours", event: "Peak impacts - eyewall passage", status: "danger" },
    { time: "+30 hours", event: "Conditions begin improving", status: "warning" },
    { time: "+36 hours", event: "All-clear for coastal areas", status: "caution" }
  ],
  summary: "🌀 CATASTROPHIC HURRICANE MILTON: Category 4 hurricane will make landfall near Tampa Bay in approximately 18 hours. This is an extremely dangerous, life-threatening situation. Storm surge of 12-15 feet will inundate coastal areas. Winds of 150 mph will cause devastating damage. Rainfall of 10-15 inches will cause catastrophic flooding. EVACUATE IMMEDIATELY if in Zones A, B, or C. If you cannot evacuate, seek shelter in a sturdy interior room away from windows."
};

export const mockRiskAnalysis = {
  alert_summary: "🚨 **CRITICAL LIFE-THREATENING SITUATION** - Hurricane Milton (Category 4) poses an extreme threat to Tampa Bay with catastrophic impacts expected within 24 hours. Storm surge of 12-15 feet, winds of 150 mph, and 10-15 inches of rainfall will cause devastating damage. This is a worst-case scenario requiring immediate evacuation.",
  potential_impacts: [
    "**🌊 Storm Surge (EXTREME):** 12-15 feet of storm surge will inundate coastal areas, causing catastrophic flooding. This is unsurvivable in evacuation zones A and B. Complete destruction of beachfront structures expected.",
    "**💨 Winds (EXTREME):** Sustained winds of 150 mph with gusts to 180 mph will cause devastating structural damage. Widespread power outages lasting weeks. Flying debris will create life-threatening hazards.",
    "**🌧️ Flooding (SEVERE):** 10-15 inches of rainfall will cause catastrophic flash flooding in urban areas. Roads will become impassable. Water rescues will be needed across the region.",
    "**🌪️ Tornadoes (MODERATE):** Outer rain bands may spawn tornadoes across Central Florida with little warning, causing additional localized damage and evacuation complications.",
    "**⚡ Infrastructure:** Complete loss of power, water, and communications for extended periods. Roads blocked by debris. Emergency services unable to respond during peak conditions.",
    "**👥 Population Impact:** 2.5 million people in Tampa Bay metro area at risk. Mandatory evacuations for Zones A, B, C affecting 500,000+ residents."
  ],
  safety_recommendations: [
    "🚨 **EVACUATE IMMEDIATELY** if in zones A, B, or C - This is your last safe window to leave. Do not wait.",
    "🏠 **Shelter:** If unable to evacuate, go to Tampa Convention Center NOW (1,200 spaces available, pet-friendly, medical staff on-site)",
    "🚗 **Routes:** Take I-75 North or I-4 East. Contraflow active on I-75 northbound. Avoid coastal routes.",
    "📱 **Communications:** Charge all devices now. Have backup batteries. Download offline maps. Text instead of call to preserve battery.",
    "💧 **Water:** Store minimum 1 gallon per person per day for 3+ days. Fill bathtubs as backup supply.",
    "🍱 **Food:** Stock 3+ days of non-perishable food. No cooking may be possible for extended period.",
    "💊 **Medical:** Secure 7+ days of medications. Bring medical devices and supplies to shelter. Have medical records in waterproof container.",
    "🔒 **Property:** Secure all outdoor items NOW. Board windows if possible. Turn off utilities if evacuating. Take irreplaceable items.",
    "⛽ **Fuel:** Fill all vehicles NOW. Gas stations will run out or lose power. You may need fuel for generator.",
    "🚫 **DO NOT:** Stay in mobile homes, RVs, or coastal areas. Do not attempt to ride out storm in vulnerable structures. Do not drive through flooded areas."
  ],
  supporting_links: []
};

export const mockChatHistory = [
  {
    role: "user",
    content: "What's the current hurricane threat to Tampa?"
  },
  {
    role: "assistant",
    content: "⚠️ **CRITICAL SITUATION - IMMEDIATE ACTION REQUIRED**\n\nHurricane Milton, a Category 4 hurricane with 150 mph winds, is currently 145 miles southwest of Tampa and approaching rapidly. Here's what you need to know:\n\n**Immediate Threats:**\n- 🌊 **Storm Surge**: 12-15 feet expected in Tampa Bay\n- 💨 **Winds**: 150 mph sustained, 180 mph gusts\n- 🌧️ **Rainfall**: 10-15 inches causing catastrophic flooding\n- ⏰ **Landfall**: Expected tomorrow morning around 6 AM\n\n**EVACUATION ORDERS:**\n- Zones A, B, and C: **MANDATORY EVACUATION**\n- You have approximately 12-18 hours before conditions become life-threatening\n\n**What to do NOW:**\n1. If in evacuation zones - LEAVE IMMEDIATELY\n2. Head to shelters (Tampa Convention Center has 1,200 spaces available)\n3. Take I-75 North or I-4 East\n4. Bring essentials: medications, documents, water, food\n5. Secure your property before leaving\n\nThis is a life-threatening situation. Do not wait - evacuate now while you still can safely."
  },
  {
    role: "user",
    content: "Where are the nearest shelters?"
  },
  {
    role: "assistant",
    content: "**Open Emergency Shelters Near You:**\n\n1. **Tampa Convention Center** ⭐ RECOMMENDED\n   - 📍 333 S Franklin St (2.3 miles)\n   - 📞 (813) 274-8511\n   - ✅ 1,200 spaces available\n   - 🐕 Pet-friendly\n   - 🏥 Medical staff on-site\n   - ⚡ Generators, food, water\n\n2. **Blake High School**\n   - 📍 1701 N Blvd (4.1 miles)\n   - 📞 (813) 276-5620\n   - ✅ 450 spaces available\n   - ♿ ADA accessible\n\n3. **Middleton High School**\n   - 📍 4801 N 22nd St (5.8 miles)\n   - 📞 (813) 231-1700\n   - ✅ 680 spaces available\n   - 🐕 Pet-friendly\n\n**Important:**\n- Bring ID, medications, important documents\n- Bring bedding, pillows, comfort items\n- Bring food/water for 3 days\n- Arrive early - shelters fill up quickly\n\nNeed directions or have questions? Call the shelter directly!"
  }
];
