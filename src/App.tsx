import React, { useState, useMemo } from 'react';
import { Globe, TrendingUp, BarChart3, Users, Settings, Zap } from 'lucide-react';
import MarketRankings from './components/MarketRankings';
import FeatureAnalysis from './components/FeatureAnalysis';
import CountryComparison from './components/CountryComparison';
import ModelPerformance from './components/ModelPerformance';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import { marketData, analyzeMarketData } from './utils/dataUtils';
import './styles/globals.css';

function App() {
  const [activeTab, setActiveTab] = useState('rankings');
  const [selectedCountries, setSelectedCountries] = useState(['USA', 'Germany', 'China']);
  
  const analysisResults = useMemo(() => analyzeMarketData(marketData), []);

  const navigationItems = [
    { id: 'rankings', label: 'Market Rankings', icon: TrendingUp, color: 'emerald' },
    { id: 'features', label: 'Feature Analysis', icon: BarChart3, color: 'green' },
    { id: 'comparison', label: 'Country Comparison', icon: Globe, color: 'teal' },
    { id: 'performance', label: 'Model Performance', icon: Zap, color: 'lime' },
    { id: 'scenario', label: 'Scenario Analysis', icon: Settings, color: 'emerald' }
  ];

  const renderActiveComponent = () => {
    const props = {
      data: marketData,
      analysis: analysisResults,
      selectedCountries,
      setSelectedCountries
    };

    switch (activeTab) {
      case 'rankings':
        return <MarketRankings {...props} />;
      case 'features':
        return <FeatureAnalysis {...props} />;
      case 'comparison':
        return <CountryComparison {...props} />;
      case 'performance':
        return <ModelPerformance {...props} />;
      case 'scenario':
        return <ScenarioAnalysis {...props} />;
      default:
        return <MarketRankings {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-emerald-900/30 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Market Intelligence</h1>
                <p className="text-emerald-300 text-sm">AI-Powered Expansion Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-600/30 rounded-full">
                <span className="text-emerald-300 text-sm font-medium">Live Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <nav className="w-72 bg-slate-900/30 backdrop-blur-xl border-r border-emerald-900/30 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-emerald-300 mb-6">Analysis Tools</h2>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                        : 'text-emerald-300 hover:bg-emerald-900/30 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 rounded-xl border border-emerald-700/30">
              <h3 className="text-sm font-semibold text-emerald-300 mb-3">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-sm">Top Market</span>
                  <span className="text-white font-semibold">{analysisResults.rankings[0]?.country}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-sm">Avg Score</span>
                  <span className="text-white font-semibold">
                    {analysisResults.rankings.reduce((sum, item) => sum + item.score, 0) / analysisResults.rankings.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-sm">Markets</span>
                  <span className="text-white font-semibold">{analysisResults.rankings.length}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;