import React from 'react';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import MetricCard from './MetricCard';
import FeatureImportanceChart from './charts/FeatureImportanceChart';
import CorrelationMatrix from './charts/CorrelationMatrix';

interface FeatureAnalysisProps {
  data: any[];
  analysis: any;
}

const FeatureAnalysis: React.FC<FeatureAnalysisProps> = ({ data, analysis }) => {
  const { featureImportance } = analysis;
  
  const topFeature = featureImportance[0];
  const economicFactors = featureImportance.filter((f: any) => 
    ['gdp_growth', 'per_capita_income', 'inflation_rate'].includes(f.feature)
  ).length;
  
  const techFactors = featureImportance.filter((f: any) => 
    ['internet_penetration', 'ecommerce_adoption', '5g_coverage'].includes(f.feature)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Feature Analysis</h2>
          <p className="text-emerald-300 mt-1">Understanding market attractiveness drivers</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Top Feature"
          value={topFeature?.feature.replace(/_/g, ' ').toUpperCase() || 'N/A'}
          subtitle={`Importance: ${(topFeature?.importance * 100)?.toFixed(1)}%`}
          icon={TrendingUp}
          trend="+12.5%"
          color="emerald"
        />
        <MetricCard
          title="Economic Factors"
          value={economicFactors.toString()}
          subtitle="Key indicators"
          icon={BarChart3}
          trend="+8.3%"
          color="green"
        />
        <MetricCard
          title="Tech Factors"
          value={techFactors.toString()}
          subtitle="Digital readiness"
          icon={Zap}
          trend="+15.7%"
          color="teal"
        />
        <MetricCard
          title="Cultural Factors"
          value="2"
          subtitle="Behavioral drivers"
          icon={Users}
          trend="+4.2%"
          color="lime"
        />
      </div>

      {/* Feature Importance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Feature Importance Ranking</h3>
              <div className="text-sm text-emerald-400">Model insights</div>
            </div>
            <FeatureImportanceChart data={featureImportance} />
          </div>
        </div>

        {/* Feature Details */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Feature Details</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {featureImportance.slice(0, 8).map((feature: any, index: number) => (
              <div
                key={feature.feature}
                className="p-3 bg-slate-800/30 rounded-lg border border-emerald-900/20 hover:border-emerald-600/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">
                    {feature.feature.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  <span className="text-emerald-300 font-semibold text-sm">
                    {(feature.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Feature Correlation Matrix</h3>
          <div className="text-sm text-emerald-400">Relationship analysis</div>
        </div>
        <CorrelationMatrix data={data} />
      </div>
    </div>
  );
};

export default FeatureAnalysis;