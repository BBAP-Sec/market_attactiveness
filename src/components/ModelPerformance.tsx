  import React from 'react';
  import { Brain, Target, TrendingUp, Zap } from 'lucide-react';
  import MetricCard from './MetricCard';
  
  interface ModelPerformanceProps {
    analysis: any;
  }
  
  const ModelPerformance: React.FC<ModelPerformanceProps> = ({ analysis }) => {
    const { modelMetrics } = analysis;
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Model Performance</h2>
            <p className="text-emerald-300 mt-1">AI model accuracy and reliability metrics</p>
          </div>
        </div>
  
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Training R²"
            value={modelMetrics.trainR2.toFixed(3)}
            subtitle="Model fit quality"
            icon={Brain}
            trend="+0.012"
            color="emerald"
          />
          <MetricCard
            title="Test R²"
            value={modelMetrics.testR2.toFixed(3)}
            subtitle="Generalization"
            icon={Target}
            trend="+0.008"
            color="green"
          />
          <MetricCard
            title="Test MSE"
            value={modelMetrics.testMSE.toFixed(2)}
            subtitle="Prediction error"
            icon={TrendingUp}
            trend="-0.15"
            color="teal"
          />
          <MetricCard
            title="Model Trees"
            value="100"
            subtitle="Ensemble size"
            icon={Zap}
            color="lime"
          />
        </div>
  
        {/* Model Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Model Strengths</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                <h4 className="text-emerald-300 font-semibold mb-2">High Accuracy</h4>
                <p className="text-emerald-200 text-sm">
                  R² scores above 0.85 indicate excellent model fit and predictive capability.
                </p>
              </div>
              
              <div className="p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                <h4 className="text-emerald-300 font-semibold mb-2">Robust Ensemble</h4>
                <p className="text-emerald-200 text-sm">
                  Random Forest with 100 trees reduces overfitting and improves stability.
                </p>
              </div>
              
              <div className="p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                <h4 className="text-emerald-300 font-semibold mb-2">Feature Importance</h4>
                <p className="text-emerald-200 text-sm">
                  Provides clear insights into which factors drive market attractiveness.
                </p>
              </div>
              
              <div className="p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
                <h4 className="text-emerald-300 font-semibold mb-2">Non-linear Relationships</h4>
                <p className="text-emerald-200 text-sm">
                  Captures complex interactions between economic and cultural factors.
                </p>
              </div>
            </div>
          </div>
  
          {/* Limitations */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Considerations</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <h4 className="text-yellow-300 font-semibold mb-2">Limited Dataset</h4>
                <p className="text-yellow-200 text-sm">
                  Small sample size (10 countries) may limit generalizability to new markets.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <h4 className="text-yellow-300 font-semibold mb-2">Historical Data</h4>
                <p className="text-yellow-200 text-sm">
                  Model based on current snapshot; market conditions change over time.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <h4 className="text-yellow-300 font-semibold mb-2">Cultural Simplification</h4>
                <p className="text-yellow-200 text-sm">
                  Complex cultural factors reduced to simple numerical scores.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <h4 className="text-yellow-300 font-semibold mb-2">External Factors</h4>
                <p className="text-yellow-200 text-sm">
                  Political stability, regulatory changes not included in model.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Model Architecture */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Model Architecture</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-300 mb-2">Random Forest</div>
              <p className="text-emerald-200 text-sm">Ensemble Learning Algorithm</p>
            </div>
            
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-300 mb-2">100 Trees</div>
              <p className="text-emerald-200 text-sm">Ensemble Size</p>
            </div>
            
            <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-300 mb-2">12 Features</div>
              <p className="text-emerald-200 text-sm">Input Dimensions</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModelPerformance;