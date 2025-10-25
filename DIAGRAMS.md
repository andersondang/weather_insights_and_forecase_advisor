# 📊 System Diagrams

Additional Mermaid.js diagrams for the Weather Insights & Forecast Advisor system.

---

## Agent Tool Usage Matrix

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}, 'flowchart': {'curve':'basis'}}}%%
graph LR
    subgraph Agents
        A1[Alerts Snapshot]
        A2[Forecast]
        A3[Risk Analysis]
        A4[Emergency Resources]
        A5[Hurricane Simulation]
        A6[Chat]
    end
    
    subgraph WeatherTools[Weather Tools]
        W1[get_nws_alerts]
        W2[get_nws_forecast]
        W3[get_hourly_forecast]
        W4[get_current_conditions]
        W5[get_hurricane_track]
    end
    
    subgraph MapsTools[Maps Tools]
        M1[geocode_address]
        M2[get_directions]
        M3[search_nearby_places]
        M4[generate_map]
    end
    
    subgraph DataTools[Data Tools]
        D1[get_census_demographics]
        D2[get_flood_risk_data]
        D3[get_census_tracts_in_area]
        D4[find_nearest_weather_station]
        D5[query_historical_weather]
    end
    
    subgraph AnalysisTools[Analysis Tools]
        AN1[calculate_evacuation_priority]
        AN2[get_zone_coordinates]
    end
    
    A1 --> W1
    A1 --> AN2
    
    A2 --> W2
    A2 --> W3
    A2 --> M1
    
    A3 --> W1
    A3 --> M1
    A3 --> D1
    A3 --> D2
    
    A4 --> M1
    A4 --> M3
    A4 --> M4
    
    A5 --> D2
    A5 --> AN1
    
    A6 --> W1
    A6 --> W2
    A6 --> W3
    A6 --> W4
    A6 --> W5
    A6 --> M1
    A6 --> M2
    A6 --> M3
    A6 --> M4
    A6 --> D1
    A6 --> D2
    A6 --> D3
    A6 --> D4
    A6 --> D5
    A6 --> AN1
    
    style A1 fill:#ffcdd2,stroke:#c62828
    style A2 fill:#c5e1a5,stroke:#558b2f
    style A3 fill:#fff9c4,stroke:#f57f17
    style A4 fill:#b3e5fc,stroke:#0277bd
    style A5 fill:#f8bbd0,stroke:#c2185b
    style A6 fill:#d1c4e9,stroke:#512da8
```

---

## Data Flow: Dashboard Alerts Loading

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%
sequenceDiagram
    participant User
    participant Dashboard
    participant API
    participant AlertsAgent
    participant NWS
    
    User->>Dashboard: Opens Dashboard
    Dashboard->>Dashboard: Check localStorage
    Dashboard->>API: GET /alerts ("all US states")
    API->>AlertsAgent: POST /query
    
    rect rgb(255, 240, 240)
        Note over AlertsAgent: alerts_retriever_agent
        AlertsAgent->>NWS: GET /alerts/active
        NWS-->>AlertsAgent: 357 alerts
        AlertsAgent->>AlertsAgent: Filter by severity
        AlertsAgent->>AlertsAgent: Limit to top 5
    end
    
    rect rgb(240, 240, 255)
        Note over AlertsAgent: alerts_coordinator_agent
        AlertsAgent->>AlertsAgent: Extract zone IDs
        AlertsAgent->>NWS: GET /zones/{zone_id}
        NWS-->>AlertsAgent: Zone coordinates
        AlertsAgent->>AlertsAgent: Create map markers
        AlertsAgent->>AlertsAgent: Synthesize response
    end
    
    AlertsAgent-->>API: AlertsSnapshot JSON
    API-->>Dashboard: Response
    Dashboard->>Dashboard: Save to localStorage
    Dashboard->>User: Display alerts + map
```

---

## Data Flow: Forecast Lookup

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%
sequenceDiagram
    participant User
    participant Forecast
    participant API
    participant ForecastAgent
    participant GoogleMaps
    participant NWS
    
    User->>Forecast: Types "Tampa, FL"
    Forecast->>API: GET /forecast
    API->>ForecastAgent: POST /query
    
    ForecastAgent->>GoogleMaps: Geocode "Tampa, FL"
    GoogleMaps-->>ForecastAgent: lat: 27.95, lng: -82.45
    
    ForecastAgent->>NWS: GET /points/27.95,-82.45
    NWS-->>ForecastAgent: gridId: TBW, gridX: 64, gridY: 68
    
    par Get Daily Forecast
        ForecastAgent->>NWS: GET /gridpoints/TBW/64,68/forecast
        NWS-->>ForecastAgent: 14 periods (7 days)
    and Get Hourly Forecast
        ForecastAgent->>NWS: GET /gridpoints/TBW/64,68/forecast/hourly
        NWS-->>ForecastAgent: 48 hourly periods
    end
    
    ForecastAgent->>ForecastAgent: Group day/night periods
    ForecastAgent-->>API: ForecastData JSON
    API-->>Forecast: Response
    Forecast->>User: Display 7-day + hourly forecast
```

---

## Data Flow: Hurricane Simulation

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%
sequenceDiagram
    participant User
    participant HurricanePage
    participant API
    participant HurricaneAgent
    participant BigQuery
    
    User->>HurricanePage: Uploads hurricane image
    HurricanePage->>API: POST /analyze (with image)
    API->>HurricaneAgent: POST /query
    
    rect rgb(255, 245, 240)
        Note over HurricaneAgent: hurricane_image_analysis_agent
        HurricaneAgent->>HurricaneAgent: Analyze image (Gemini Vision)
        HurricaneAgent->>HurricaneAgent: Extract: Category 4, FL/AL/MS/GA/TN
        HurricaneAgent->>HurricaneAgent: Write to state['hurricane_data']
    end
    
    rect rgb(240, 255, 240)
        Note over HurricaneAgent: evacuation_coordinator_agent
        loop For each affected state
            HurricaneAgent->>BigQuery: Query flood risk data
            BigQuery-->>HurricaneAgent: Historical flood events
        end
        HurricaneAgent->>HurricaneAgent: Accumulate all state data
        HurricaneAgent->>HurricaneAgent: Calculate risk scores
        HurricaneAgent->>HurricaneAgent: Deduplicate coordinates
        HurricaneAgent->>HurricaneAgent: Prioritize top 20 locations
    end
    
    HurricaneAgent-->>API: EvacuationPlan JSON
    API-->>HurricanePage: Response
    HurricanePage->>User: Display priorities + map
```

---

## Data Flow: Chat Conversation

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%
sequenceDiagram
    participant User
    participant Chat
    participant API
    participant ChatAgent
    participant Tools
    
    User->>Chat: "What's the hurricane threat to Tampa?"
    Chat->>API: POST /chat
    API->>ChatAgent: POST /query
    
    ChatAgent->>ChatAgent: Parse intent: hurricane + location
    ChatAgent->>Tools: get_nws_alerts(state="FL")
    Tools-->>ChatAgent: Hurricane warnings
    ChatAgent->>Tools: get_hurricane_track()
    Tools-->>ChatAgent: Storm position & intensity
    
    ChatAgent->>ChatAgent: Synthesize response
    ChatAgent->>ChatAgent: Generate follow-up suggestions
    
    ChatAgent-->>API: Response + suggestions
    API-->>Chat: JSON response
    Chat->>User: Display answer + 3 follow-ups
    
    User->>Chat: Clicks "Where are nearest shelters?"
    Chat->>API: POST /chat
    API->>ChatAgent: POST /query
    
    ChatAgent->>Tools: geocode_address("Tampa, FL")
    Tools-->>ChatAgent: Coordinates
    ChatAgent->>Tools: search_nearby_places("shelter")
    Tools-->>ChatAgent: 5 shelters
    
    ChatAgent-->>API: Response + new suggestions
    API-->>Chat: JSON response
    Chat->>User: Display shelters + 3 new follow-ups
```

---

## Agent Sub-Agent Architecture

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
graph TB
    subgraph AlertsSnapshot["🚨 Alerts Snapshot Agent"]
        AR[alerts_retriever_agent<br/>Fetches from NWS API<br/>Filters by severity]
        AC[alerts_coordinator_agent<br/>Gets zone coordinates<br/>Creates map data]
        AR --> AC
    end
    
    subgraph HurricaneSimulation["🌀 Hurricane Simulation Agent"]
        HIA[hurricane_image_analysis_agent<br/>Analyzes image with Gemini Vision<br/>Extracts storm data]
        EC[evacuation_coordinator_agent<br/>Queries flood risk data<br/>Calculates priorities]
        EPF[evacuation_plan_formatter<br/>Formats EvacuationPlan schema<br/>Validates data types]
        HIA --> EC
        EC --> EPF
    end
    
    subgraph ForecastAgent["🌤️ Forecast Agent"]
        FA[Single agent<br/>Geocodes location<br/>Gets NWS forecast<br/>Groups day/night periods]
    end
    
    subgraph RiskAgent["⚠️ Risk Analysis Agent"]
        RA[Single agent<br/>Gets demographics<br/>Gets flood risk<br/>Correlates with alerts]
    end
    
    subgraph EmergencyAgent["🏥 Emergency Resources Agent"]
        EA[Single agent<br/>Geocodes location<br/>Searches places<br/>Generates map]
    end
    
    subgraph ChatAgent["💬 Chat Agent"]
        CA[Chat orchestrator<br/>Routes to specialist agents<br/>Accesses all tools<br/>Manages conversation]
    end
    
    style AlertsSnapshot fill:#ffebee,stroke:#c62828,stroke-width:2px
    style HurricaneSimulation fill:#ffebee,stroke:#c62828,stroke-width:2px
    style ForecastAgent fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style RiskAgent fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style EmergencyAgent fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style ChatAgent fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## Tool Categories

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
mindmap
  root((Shared Tools<br/>Library))
    Weather Tools
      get_nws_alerts
      get_nws_forecast
      get_hourly_forecast
      get_current_conditions
      get_hurricane_track
    Maps Tools
      geocode_address
      get_directions
      search_nearby_places
      generate_map
    Data Tools
      get_census_demographics
      get_flood_risk_data
      get_census_tracts_in_area
      find_nearest_weather_station
      query_historical_weather
    Analysis Tools
      calculate_evacuation_priority
      get_zone_coordinates
```

---

## External API Integration

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
graph LR
    subgraph System["Weather Insights System"]
        Tools[Shared Tools]
    end
    
    subgraph NWS["🌦️ National Weather Service"]
        NWS1[/alerts/active]
        NWS2[/points/lat,lng]
        NWS3[/gridpoints/.../forecast]
        NWS4[/zones/zone_id]
    end
    
    subgraph Google["🗺️ Google APIs"]
        G1[Geocoding API]
        G2[Directions API]
        G3[Places API]
        G4[Maps JavaScript API]
    end
    
    subgraph GCP["☁️ Google Cloud Platform"]
        BQ[BigQuery<br/>Public Datasets]
        NHC[NHC API<br/>Hurricane Data]
    end
    
    Tools -->|Weather data| NWS1
    Tools -->|Grid points| NWS2
    Tools -->|Forecasts| NWS3
    Tools -->|Zone coords| NWS4
    
    Tools -->|Geocoding| G1
    Tools -->|Routes| G2
    Tools -->|Resources| G3
    Tools -->|Map URLs| G4
    
    Tools -->|Demographics| BQ
    Tools -->|Flood history| BQ
    Tools -->|Hurricane tracking| NHC
    
    style NWS fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Google fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style GCP fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
```

---

## Demo Mode Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'16px'}}}%%
stateDiagram-v2
    [*] --> Dashboard: User starts tour
    Dashboard --> Alerts: Auto-load national alerts
    Alerts --> Forecast: Tour step 6
    Forecast --> TypeAnimation: Simulate typing "Tampa, FL"
    TypeAnimation --> LoadingSpinner: Show spinner (2s)
    LoadingSpinner --> ForecastDisplay: Display 7-day forecast
    ForecastDisplay --> EmergencyResources: Tour step 7
    EmergencyResources --> TypeAnimation2: Simulate typing "Tampa, FL"
    TypeAnimation2 --> LoadingSpinner2: Show spinner (2s)
    LoadingSpinner2 --> ShelterDisplay: Display 5 shelters + map
    ShelterDisplay --> HurricaneSimulation: Tour step 8
    HurricaneSimulation --> ImageAppears: Simulate image upload
    ImageAppears --> AnalyzingSpinner: Show analyzing (3s)
    AnalyzingSpinner --> EvacuationDisplay: Display priorities + map
    EvacuationDisplay --> Chat: Tour step 9
    Chat --> WelcomeMessage: Display welcome
    WelcomeMessage --> AutoPlayConversation: Step-by-step messages
    AutoPlayConversation --> FollowUpSuggestions: Show 3 suggestions
    FollowUpSuggestions --> UserClicksSuggestion: User clicks
    UserClicksSuggestion --> NewResponse: Display response
    NewResponse --> NewSuggestions: Show 3 new suggestions
    NewSuggestions --> [*]: Tour complete
```

---

## Model Usage

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
pie title Agent Model Distribution
    "gemini-2.5-flash" : 60
    "gemini-2.5-flash-lite" : 40
```

**Model Strategy:**
- **gemini-2.5-flash**: Primary agents, complex analysis, image processing
- **gemini-2.5-flash-lite**: Formatting agents, simple transformations, cost optimization

---

For the main architecture diagram, see [ARCHITECTURE.md](./ARCHITECTURE.md)
