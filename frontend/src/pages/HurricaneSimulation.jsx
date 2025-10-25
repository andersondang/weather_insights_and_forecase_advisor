import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudIcon, 
  ExclamationTriangleIcon, 
  MapPinIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import LocationMap from '../components/LocationMap';
import api from '../services/api';
import { useDemoMode } from '../contexts/DemoModeContext';
import { useTour } from '../contexts/TourContext';
import { mockHurricaneSimulation } from '../data/mockData';

const HurricaneSimulation = () => {
  const { isDemoMode } = useDemoMode();
  const { isTourActive, currentStep, tourSteps } = useTour();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const fileInputRef = useRef(null);

  // Load mock simulation and sample image in demo mode or during tour - simulate upload and analysis
  useEffect(() => {
    const shouldLoadMockData = isDemoMode || (isTourActive && tourSteps[currentStep]?.id === 'hurricane-simulation');
    
    if (shouldLoadMockData) {
      console.log('[HurricaneSimulation] Simulating image upload and analysis');
      
      // Clear everything first
      setImagePreview(null);
      setAnalysisResult(null);
      setError(null);
      setMapMarkers([]);
      setIsAnalyzing(false);
      
      // Step 1: Simulate image upload after 1 second
      const uploadTimeout = setTimeout(() => {
        console.log('[HurricaneSimulation] Simulating image upload...');
        setImagePreview('/hurricane_track.png');
        
        // Step 2: Simulate clicking "Analyze" button after 1.5 seconds
        const analyzeTimeout = setTimeout(() => {
          console.log('[HurricaneSimulation] Simulating analysis...');
          setIsAnalyzing(true);
          
          // Step 3: Show results after 3 seconds of "analyzing"
          const resultsTimeout = setTimeout(() => {
            console.log('[HurricaneSimulation] Showing analysis results');
            
            // Create mock analysis result with EvacuationPlan schema structure
            const mockResult = {
              hurricane_category: mockHurricaneSimulation.hurricane.category,
              affected_states: ['FL'],
              total_high_risk_locations: mockHurricaneSimulation.evacuationPriority.prioritized_locations.length,
              highest_risk_score: Math.max(...mockHurricaneSimulation.evacuationPriority.prioritized_locations.map(loc => loc.risk_score)),
              prioritized_locations: mockHurricaneSimulation.evacuationPriority.prioritized_locations,
              insights: {
                hurricane_name: mockHurricaneSimulation.hurricane.name,
                category: mockHurricaneSimulation.hurricane.category,
                wind_speed: `${mockHurricaneSimulation.hurricane.windSpeed} mph`,
                location: mockHurricaneSimulation.hurricane.location,
                landfall: mockHurricaneSimulation.hurricane.estimatedLandfall,
                storm_surge: mockHurricaneSimulation.impacts.stormSurge.max,
                rainfall: mockHurricaneSimulation.impacts.rainfall.total,
                summary: mockHurricaneSimulation.summary
              }
            };
            
            setAnalysisResult(mockResult);
            setIsAnalyzing(false);
            setError(null);
            
            // Set map markers from evacuation priorities
            if (mockHurricaneSimulation.evacuationPriority?.prioritized_locations) {
              const markers = mockHurricaneSimulation.evacuationPriority.prioritized_locations.map(loc => ({
                lat: loc.latitude,
                lng: loc.longitude,
                title: `${loc.details?.station_name || 'High Risk Location'}\nRisk Score: ${loc.risk_score.toFixed(1)}/10`,
                riskScore: loc.risk_score
              }));
              setMapMarkers(markers);
            }
          }, 3000); // 3 seconds of analyzing
          
          return () => clearTimeout(resultsTimeout);
        }, 1500); // 1.5 seconds after image appears
        
        return () => clearTimeout(analyzeTimeout);
      }, 1000); // 1 second initial delay
      
      return () => clearTimeout(uploadTimeout);
    }
  }, [isTourActive, currentStep, isDemoMode, tourSteps]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('[HurricaneSimulation] Starting analysis...');
      const result = await api.analyzeHurricaneImage(selectedImage);
      console.log('[HurricaneSimulation] Analysis result:', result);
      setAnalysisResult(result);
      
      // Create map markers from prioritized locations (EvacuationPlan schema)
      if (result && result.prioritized_locations && result.prioritized_locations.length > 0) {
        const markers = result.prioritized_locations.map((location, index) => ({
          lat: location.latitude,
          lng: location.longitude,
          title: `Priority #${index + 1} - Risk: ${location.risk_score.toFixed(2)}`,
          address: `Coordinates: ${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`
        }));
        setMapMarkers(markers);
        
        console.log(`[HurricaneSimulation] Created ${markers.length} map markers from evacuation plan`);
      } else {
        console.log('[HurricaneSimulation] No prioritized locations in evacuation plan:', result);
        setMapMarkers([]);
      }
    } catch (err) {
      console.error('[HurricaneSimulation] Analysis error:', err);
      setError(err.message || 'Failed to analyze hurricane image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    if (!isDemoMode) {
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResult(null);
      setError(null);
      setMapMarkers([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getRiskLevelColor = (riskScore) => {
    if (riskScore >= 60) return 'text-red-600 bg-red-50';
    if (riskScore >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLevelText = (riskScore) => {
    if (riskScore >= 60) return 'High Risk';
    if (riskScore >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div className="space-y-6" data-tour-id="simulation-section">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CloudIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hurricane Simulation</h1>
              <p className="text-gray-600">Upload a hurricane satellite image to analyze evacuation priorities and flood risks</p>
            </div>
          </div>
          {isDemoMode && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              Demo Mode
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Hurricane satellite image"
                    className="max-h-80 mx-auto rounded-lg shadow-lg border-2 border-gray-200"
                  />
                  {analysisResult && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                      Category {analysisResult.hurricane_category}
                    </div>
                  )}
                </div>
                {!isDemoMode && (
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <span>Analyze Hurricane</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearImage}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">Upload Hurricane Image</p>
                  <p className="text-gray-500">Drag and drop or click to select</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
                >
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  <span>Choose File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analyzing Loading State */}
      {isAnalyzing && !analysisResult && (
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mb-6"></div>
              <CloudIcon className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Hurricane Image</h3>
            <p className="text-gray-600 text-center max-w-md">
              Our AI is analyzing the hurricane track, intensity, and calculating evacuation priorities for high-risk areas...
            </p>
            <div className="mt-6 flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Hurricane Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CloudIcon className="h-6 w-6 text-blue-600" />
              <span>Hurricane Analysis</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-1">Hurricane Category</div>
                <div className="text-4xl font-bold text-blue-900">
                  {analysisResult.hurricane_category}
                </div>
                <div className="text-xs text-blue-600 mt-1">Saffir-Simpson Scale</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
                <div className="text-sm font-medium text-orange-700 mb-1">Affected States</div>
                <div className="text-2xl font-bold text-orange-900">
                  {analysisResult.affected_states?.join(', ') || 'N/A'}
                </div>
                <div className="text-xs text-orange-600 mt-1">Primary Impact Zone</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-1">High-Risk Locations</div>
                <div className="text-4xl font-bold text-red-900">
                  {analysisResult.total_high_risk_locations}
                </div>
                <div className="text-xs text-red-600 mt-1">Evacuation Priority Areas</div>
              </div>
            </div>
            
            {/* Additional Hurricane Details */}
            {analysisResult.insights && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Storm Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hurricane Name:</span>
                    <span className="font-medium text-gray-900">{analysisResult.insights.hurricane_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Speed:</span>
                    <span className="font-medium text-gray-900">{analysisResult.insights.wind_speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Location:</span>
                    <span className="font-medium text-gray-900">{analysisResult.insights.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Landfall:</span>
                    <span className="font-medium text-gray-900">{analysisResult.insights.landfall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storm Surge:</span>
                    <span className="font-medium text-red-700">{analysisResult.insights.storm_surge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Rainfall:</span>
                    <span className="font-medium text-blue-700">{analysisResult.insights.rainfall}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evacuation Priorities Map */}
          <div className="bg-white rounded-lg shadow-sm p-6" data-tour-id="evacuation-map">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPinIcon className="h-6 w-6 text-red-600" />
              <span>High-Risk Evacuation Areas</span>
            </h2>
            
            {analysisResult.prioritized_locations && analysisResult.prioritized_locations.length > 0 && (
              <div className="space-y-4">
                {/* Interactive Map */}
                <LocationMap 
                  markers={mapMarkers}
                  height="450px" 
                />
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        🚨 {analysisResult.total_high_risk_locations || analysisResult.prioritized_locations.length} High-Risk Evacuation Areas Identified
                      </p>
                      <p className="text-xs text-gray-700 mb-1">
                        📍 Red markers indicate evacuation priority locations. Click markers for detailed risk information.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="bg-white bg-opacity-60 rounded px-2 py-1">
                          <span className="text-gray-600">Highest Risk Score:</span>
                          <span className="font-bold text-red-700 ml-1">{analysisResult.highest_risk_score?.toFixed(1)}/10</span>
                        </div>
                        {analysisResult.affected_states && (
                          <div className="bg-white bg-opacity-60 rounded px-2 py-1">
                            <span className="text-gray-600">Affected:</span>
                            <span className="font-bold text-orange-700 ml-1">{analysisResult.affected_states.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Priority Locations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mr-2">TOP PRIORITY</span>
                    Evacuation Locations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisResult.prioritized_locations.slice(0, 6).map((location, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                              {index + 1}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Priority #{index + 1}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            location.risk_score >= 9 ? 'bg-red-100 text-red-800' :
                            location.risk_score >= 7 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {location.risk_score.toFixed(1)}/10
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {location.details?.station_name && (
                            <div className="font-medium text-gray-900 text-base">
                              📍 {location.details.station_name}
                            </div>
                          )}
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Coordinates:</span> {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
                          </div>
                          {location.details?.evacuation_zone && (
                            <div className="inline-flex items-center bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                              Zone {location.details.evacuation_zone}
                            </div>
                          )}
                          {location.details?.reason && (
                            <div className="text-xs text-gray-700 mt-2 pt-2 border-t border-gray-200">
                              <span className="font-medium">Reason:</span> {location.details.reason}
                            </div>
                          )}
                          {location.details?.population && (
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Population:</span> {location.details.population.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          {analysisResult.insights && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                <span>Analysis Insights</span>
              </h2>
              
              <div className="space-y-4">
                {Object.entries(analysisResult.insights).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-gray-700 mt-1">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HurricaneSimulation;
