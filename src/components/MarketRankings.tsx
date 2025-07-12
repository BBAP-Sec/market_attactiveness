import React from 'react';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import MetricCard from './MetricCard';
import RankingChart from './charts/RankingChart';
import ConfidenceChart from './charts/ConfidenceChart';

interface MarketRankingsProps {
  data: any[];
  analysis: any;
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
}

const MarketRankings: React.FC<MarketRankingsProps> = ({ data, analysis }) => {
  const { rankings } = analysis;
  const topMarket = rankings[0];
  const avgScore = rankings.reduce((sum: number, item: any) => sum + item.score, 0) / rankings.length;
  const highConfidenceMarkets = rankings.filter((item: any) => item.confidence > 0.8).length;
  const emergingMarkets = rankings.filter((item: any) => item.score < 70).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Market Rankings</h2>
          <p className="text-emerald-300 mt-1">Comprehensive market attractiveness analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-600/30 rounded-full">
            <span className="text-emerald-300 text-sm">Live Analysis</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Top Market"
          value={topMarket?.country || 'N/A'}
          subtitle={`Score: ${topMarket?.score?.toFixed(1) || 'N/A'}`}
          icon={Award}
          trend="+2.3%"
          color="emerald"
        />
        <MetricCard
          title="Average Score"
          value={avgScore.toFixed(1)}
          subtitle="Market average"
          icon={TrendingUp}
          trend="+1.8%"
          color="green"
        />
        <MetricCard
          title="High Confidence"
          value={`${highConfidenceMarkets}/${rankings.length}`}
          subtitle="Reliable predictions"
          icon={Target}
          trend="+5.2%"
          color="teal"
        />
        <MetricCard
          title="Emerging Markets"
          value={emergingMarkets.toString()}
          subtitle="Growth opportunities"
          icon={Zap}
          trend="+3.1%"
          color="lime"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Rankings Chart */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Market Attractiveness Scores</h3>
              <div className="text-sm text-emerald-400">Updated now</div>
            </div>
            <RankingChart data={rankings} />
          </div>
        </div>

        {/* Rankings Table */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Current Rankings</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {rankings.map((country: any, index: number) => (
              <div
                key={country.country}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-emerald-900/20 hover:border-emerald-600/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-500 text-orange-900' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{country.country}</span>
                </div>
                <div className="text-right">
                  <div className="text-emerald-300 font-semibold">{country.score.toFixed(1)}</div>
                  <div className="text-xs text-emerald-500">±{(country.confidence * 10).toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Analysis */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Prediction Confidence Analysis</h3>
          <div className="text-sm text-emerald-400">Model reliability metrics</div>
        </div>
        <ConfidenceChart data={rankings} />
      </div>
    </div>
  );
};

export default MarketRankings;