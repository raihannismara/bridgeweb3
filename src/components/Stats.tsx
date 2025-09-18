import React from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';

export const Stats: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mb-8">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">$2.4M</div>
        <div className="text-gray-400 text-sm">Total Volume Bridged</div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">12,847</div>
        <div className="text-gray-400 text-sm">Active Users</div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">~2min</div>
        <div className="text-gray-400 text-sm">Avg Bridge Time</div>
      </div>
    </div>
  );
};