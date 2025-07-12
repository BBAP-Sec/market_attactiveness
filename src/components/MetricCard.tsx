import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  color: 'emerald' | 'green' | 'teal' | 'lime';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-300',
    green: 'from-green-500 to-green-600 text-green-300',
    teal: 'from-teal-500 to-teal-600 text-teal-300',
    lime: 'from-lime-500 to-lime-600 text-lime-300'
  };

  return (
    <div className="glass-card p-6 group hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-emerald-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-2xl font-bold mb-1">{value}</p>
          <p className="text-emerald-300 text-sm">{subtitle}</p>
        </div>
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-emerald-900/20">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 text-sm">Trend</span>
            <span className="text-emerald-300 font-semibold text-sm">{trend}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;