
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndianRupee, TrendingUp } from 'lucide-react';

export const BudgetTracker: React.FC = () => {
  // Mock data for MVP visual with new color palette - Updated for INR approximate values
  const data = [
    { name: 'Accommodation', value: 25000, color: '#1a1d1f' }, // Dark
    { name: 'Food', value: 12000, color: '#ffcd44' }, // Brand Yellow
    { name: 'Transport', value: 5000, color: '#94a3b8' }, // Slate 400
    { name: 'Activities', value: 8000, color: '#e2e8f0' }, // Slate 200
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-6 pt-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Trip Spending</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Total Spent</p>
          <p className="text-4xl font-extrabold text-dark mt-2">₹{total.toLocaleString()}</p>
          <div className="inline-flex items-center gap-1 mt-2 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
            <TrendingUp size={12} />
            On Track
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
            {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                    <div className="flex-1">
                        <p className="text-xs text-slate-500">{item.name}</p>
                        <p className="text-sm font-bold text-slate-800">₹{item.value.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <button className="w-full bg-black text-brand font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-colors">
        <IndianRupee size={20} />
        Add Expense
      </button>
    </div>
  );
};
