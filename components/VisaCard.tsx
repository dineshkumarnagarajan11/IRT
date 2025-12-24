
import React from 'react';
import { VisaInfo, VisaType } from '../types';
import { AlertTriangle, CheckCircle, Clock, FileText, IndianRupee } from 'lucide-react';

interface VisaCardProps {
  visa: VisaInfo;
  hideDocuments?: boolean;
}

export const VisaCard: React.FC<VisaCardProps> = ({ visa, hideDocuments = false }) => {
  const getBadgeColor = (type: VisaType) => {
    switch (type) {
      case VisaType.VISA_FREE: return 'bg-green-100 text-green-700';
      case VisaType.VOA: return 'bg-blue-100 text-blue-700';
      case VisaType.E_VISA: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          Visa Requirements
        </h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getBadgeColor(visa.type)}`}>
          {visa.type}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><IndianRupee size={10} /> Cost</p>
          <p className="font-semibold text-slate-800">{visa.cost}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><Clock size={10} /> Processing</p>
          <p className="font-semibold text-slate-800">{visa.processingTime}</p>
        </div>
      </div>

      {!hideDocuments && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Documents</h4>
          <ul className="space-y-2">
            {visa.documents.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {visa.warning && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-md">
          <div className="flex gap-2">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold block mb-1">Important:</span>
              {visa.warning}
            </p>
          </div>
        </div>
      )}

      <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-50">
        INNROUTES does not process visas. Verify with official embassies.
      </div>
    </div>
  );
};
