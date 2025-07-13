import React, { useState } from 'react';
import { Globe, TrendingUp, Wifi, ShoppingCart } from 'lucide-react';
import MetricCard from './MetricCard';
import RadarChart from './charts/RadarChart';

interface CountryComparisonProps {
  data: any[];
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}

const CountryComparison: React.FC<CountryComparisonProps> = ({ 
  data, 
  selectedCountries, 
  setSelectedCountries 
}) => {
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);

  const comparisonData = data.filter(country => 
    selectedCountries.includes(country.country)
  );

  const handleCountryToggle = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else if (selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const avgGdpGrowth = comparisonData.reduce((sum, c) => sum + c.gdp_growth, 0) / comparisonData.length;
  const avgIncome = comparisonData.reduce((sum, c) => sum + c.per_capita_income, 0) / comparisonData.length;
  const avgInternet = comparisonData.reduce((sum, c) => sum + c.internet_penetration, 0) / comparisonData.length;
  const avgEcommerce = comparisonData.reduce((sum, c) => sum + c.ecommerce_adoption, 0) / comparisonData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Country Comparison</h2>
          <p className="text-emerald-300 mt-1">Side-by-side market analysis</p>
        </div>
      </div>

      {/* Country Selection */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Select Countries to Compare</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.map(country => (
            <button
              key={country.country}
              onClick={() => handleCountryToggle(country.country)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedCountries.includes(country.country)
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800/30 border-emerald-900/30 text-emerald-300 hover:border-emerald-600/50'
              }`}
              disabled={!selectedCountries.includes(country.country) && selectedCountries.length >= 5}
            >
              {country.country}
            </button>
          ))}
        </div>
        <p className="text-emerald-400 text-sm mt-2">
          Select up to 5 countries ({selectedCountries.length}/5 selected)
        </p>
      </div>

      {comparisonData.length > 0 && (
        <>
          {/* Comparison Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Avg GDP Growth"
              value={`${avgGdpGrowth.toFixed(1)}%`}
              subtitle="Economic momentum"
              icon={TrendingUp}
              trend="+2.1%"
              color="emerald"
            />
            <MetricCard
              title="Avg Income"
              value={`$${(avgIncome / 1000).toFixed(0)}K`}
              subtitle="Purchasing power"
              icon={Globe}
              trend="+5.3%"
              color="green"
            />
            <MetricCard
              title="Avg Internet"
              value={`${avgInternet.toFixed(0)}%`}
              subtitle="Digital infrastructure"
              icon={Wifi}
              trend="+8.7%"
              color="teal"
            />
            <MetricCard
              title="Avg E-commerce"
              value={`${avgEcommerce.toFixed(0)}%`}
              subtitle="Online market"
              icon={ShoppingCart}
              trend="+12.4%"
              color="lime"
            />
          </div>

          {/* Radar Chart Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Multi-Dimensional Comparison</h3>
                  <div className="text-sm text-emerald-400">Normalized metrics</div>
                </div>
                <RadarChart data={comparisonData} />
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Detailed Metrics</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comparisonData.map((country, index) => (
                  <div
                    key={country.country}
                    className="p-4 bg-slate-800/30 rounded-lg border border-emerald-900/20"
                  >
                    <h4 className="text-white font-semibold mb-3">{country.country}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-400">GDP Growth:</span>
                        <span className="text-white">{country.gdp_growth}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Income:</span>
                        <span className="text-white">${(country.per_capita_income / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Internet:</span>
                        <span className="text-white">{country.internet_penetration}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">E-commerce:</span>
                        <span className="text-white">{country.ecommerce_adoption}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">5G Coverage:</span>
                        <span className="text-white">{country['5g_coverage']}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountryComparison;