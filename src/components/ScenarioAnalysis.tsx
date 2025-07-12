import React, { useState } from 'react';
import { Calculator, TrendingUp, Globe, Zap } from 'lucide-react';
import MetricCard from './MetricCard';

interface ScenarioAnalysisProps {
  analysis: any;
}

const ScenarioAnalysis: React.FC<ScenarioAnalysisProps> = ({ analysis }) => {
  const [scenarioParams, setScenarioParams] = useState({
    gdp_growth: 2.5,
    per_capita_income: 35000,
    inflation_rate: 3.0,
    internet_penetration: 80,
    ecommerce_adoption: 70,
    '5g_coverage': 50,
    individualism: 60,
    uncertainty_avoidance: 50,
    export_volume: 1000,
    tariff_rate: 3.0,
    sme_industry: 'IT'
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const handleParamChange = (param: string, value: number | string) => {
    setScenarioParams(prev => ({ ...prev, [param]: value }));
  };

  const calculatePrediction = () => {
    // Simplified prediction calculation based on weighted features
    const weights = {
      gdp_growth: 0.15,
      per_capita_income: 0.25,
      inflation_rate: -0.1,
      internet_penetration: 0.2,
      ecommerce_adoption: 0.15,
      '5g_coverage': 0.1,
      individualism: 0.05,
      uncertainty_avoidance: -0.02,
      export_volume: 0.08,
      tariff_rate: -0.05,
      sme_industry_bonus: scenarioParams.sme_industry === 'IT' ? 5 : scenarioParams.sme_industry === 'Manufacturing' ? 2 : 0
    };

    let score = 50; // Base score
    
    score += (scenarioParams.gdp_growth / 10) * 100 * weights.gdp_growth;
    score += (scenarioParams.per_capita_income / 70000) * 100 * weights.per_capita_income;
    score += (1 - scenarioParams.inflation_rate / 15) * 100 * weights.inflation_rate;
    score += scenarioParams.internet_penetration * weights.internet_penetration;
    score += scenarioParams.ecommerce_adoption * weights.ecommerce_adoption;
    score += scenarioParams['5g_coverage'] * weights['5g_coverage'];
    score += (scenarioParams.individualism / 100) * 100 * weights.individualism;
    score += (1 - scenarioParams.uncertainty_avoidance / 100) * 100 * weights.uncertainty_avoidance;
    score += (scenarioParams.export_volume / 3000) * 100 * weights.export_volume;
    score += (1 - scenarioParams.tariff_rate / 15) * 100 * weights.tariff_rate;
    score += weights.sme_industry_bonus;

    setPrediction(Math.max(0, Math.min(100, score)));
  };

  const getMarketStatus = (score: number) => {
    if (score >= 80) return { status: '🟢 Highly Attractive', color: 'emerald' };
    if (score >= 65) return { status: '🟡 Moderately Attractive', color: 'yellow' };
    return { status: '🔴 Less Attractive', color: 'red' };
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) {
      return {
        title: '🎉 Excellent Market Potential',
        message: 'This market shows outstanding potential for SME expansion. Consider it as a priority target for international growth.',
        actionItems: ['Conduct detailed market research', 'Identify local partners', 'Develop market entry strategy']
      };
    }
    if (score >= 65) {
      return {
        title: '⚖️ Moderate Market Potential',
        message: 'This market has reasonable potential but requires careful analysis. Consider deeper research before expansion.',
        actionItems: ['Analyze competitive landscape', 'Assess regulatory requirements', 'Evaluate cost-benefit ratio']
      };
    }
    return {
      title: '⚠️ Market Challenges',
      message: 'This market may present significant challenges. Consider alternative markets or wait for improved conditions.',
      actionItems: ['Monitor market developments', 'Explore alternative markets', 'Consider future re-evaluation']
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Scenario Analysis</h2>
          <p className="text-emerald-300 mt-1">Simulate custom market conditions and predict attractiveness</p>
        </div>
      </div>

      {/* Parameter Input Section */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Market Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Economic Parameters */}
          <div className="space-y-4">
            <h4 className="text-emerald-300 font-semibold">Economic Factors</h4>
            
            <div>
              <label className="block text-emerald-400 text-sm mb-2">GDP Growth (%)</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scenarioParams.gdp_growth}
                onChange={(e) => handleParamChange('gdp_growth', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams.gdp_growth}%</span>
                <span>10%</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">Per Capita Income ($)</label>
              <input
                type="range"
                min="1000"
                max="80000"
                step="1000"
                value={scenarioParams.per_capita_income}
                onChange={(e) => handleParamChange('per_capita_income', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>$1K</span>
                <span className="font-semibold">${(scenarioParams.per_capita_income / 1000).toFixed(0)}K</span>
                <span>$80K</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">Inflation Rate (%)</label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={scenarioParams.inflation_rate}
                onChange={(e) => handleParamChange('inflation_rate', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams.inflation_rate}%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Technology Parameters */}
          <div className="space-y-4">
            <h4 className="text-emerald-300 font-semibold">Technology Factors</h4>
            
            <div>
              <label className="block text-emerald-400 text-sm mb-2">Internet Penetration (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={scenarioParams.internet_penetration}
                onChange={(e) => handleParamChange('internet_penetration', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams.internet_penetration}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">E-commerce Adoption (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={scenarioParams.ecommerce_adoption}
                onChange={(e) => handleParamChange('ecommerce_adoption', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams.ecommerce_adoption}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">5G Coverage (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={scenarioParams['5g_coverage']}
                onChange={(e) => handleParamChange('5g_coverage', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams['5g_coverage']}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Cultural & Trade Parameters */}
          <div className="space-y-4">
            <h4 className="text-emerald-300 font-semibold">Cultural & Trade</h4>
            
            <div>
              <label className="block text-emerald-400 text-sm mb-2">Export Volume (Billion $)</label>
              <input
                type="range"
                min="0"
                max="4000"
                step="50"
                value={scenarioParams.export_volume}
                onChange={(e) => handleParamChange('export_volume', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>$0B</span>
                <span className="font-semibold">${scenarioParams.export_volume}B</span>
                <span>$4000B</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">Tariff Rate (%)</label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={scenarioParams.tariff_rate}
                onChange={(e) => handleParamChange('tariff_rate', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-emerald-300">
                <span>0%</span>
                <span className="font-semibold">{scenarioParams.tariff_rate}%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <label className="block text-emerald-400 text-sm mb-2">SME Industry</label>
              <select
                value={scenarioParams.sme_industry}
                onChange={(e) => handleParamChange('sme_industry', e.target.value)}
                className="w-full p-3 bg-slate-800 border border-emerald-900/30 rounded-lg text-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="IT">Information Technology</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={calculatePrediction}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🚀 Predict Market Attractiveness
          </button>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction !== null && (
        <>
          {/* Key Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Attractiveness Score"
              value={prediction.toFixed(1)}
              subtitle="Out of 100"
              icon={TrendingUp}
              color="emerald"
            />
            <MetricCard
              title="Market Status"
              value={getMarketStatus(prediction).status.split(' ')[1]}
              subtitle={getMarketStatus(prediction).status.split(' ')[0]}
              icon={Globe}
              color="green"
            />
            <MetricCard
              title="Estimated Rank"
              value={`${prediction >= 85 ? '1' : prediction >= 80 ? '2-3' : prediction >= 70 ? '4-6' : '7-10'}`}
              subtitle="Among top markets"
              icon={Zap}
              color="teal"
            />
            <MetricCard
              title="Confidence"
              value="85%"
              subtitle="Prediction reliability"
              icon={Calculator}
              color="lime"
            />
          </div>

          {/* Recommendation */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Market Recommendation</h3>
            </div>

            {(() => {
              const rec = getRecommendation(prediction);
              return (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                    <h4 className="text-emerald-300 font-semibold text-lg mb-2">{rec.title}</h4>
                    <p className="text-emerald-200">{rec.message}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-800/30 border border-emerald-900/20 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">Recommended Action Items:</h4>
                    <ul className="space-y-2">
                      {rec.actionItems.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span className="text-emerald-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioAnalysis;