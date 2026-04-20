import React from 'react';
import { BarChart3 } from 'lucide-react';
import Icon from '../common/Icon';

// Placeholder component for charts
function Charts({ data }) {
  return (
    <div className="text-center text-gray-400 py-4">
      <Icon icon={BarChart3} size="2xl" className="mx-auto text-slate-400" />
      <p className="mt-2 text-sm">Chart visualization</p>
    </div>
  );
}

export default Charts;
