'use client';
import { Users, Calculator, Clock, User, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Communications } from './CommunicationList';

interface CommunicationCardProps {
  communication: Communications[0];
  onClick?: () => void;
  index?: number;
}

export const CommunicationCard: React.FC<CommunicationCardProps> = ({ 
  communication, 
  onClick,
  index 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getResultColor = (result: number) => {
    if (result > 0) return 'text-green-600';
    if (result < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getResultBackground = (result: number) => {
    if (result > 0) return 'bg-green-50 border-green-200';
    if (result < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 cursor-pointer transform hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {communication.title || `Communication ${index !== undefined ? index + 1 : ''}`}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <User className="w-4 h-4" />
                <span>Started by {communication.author?.username || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getResultBackground(communication.currentResult)}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className={getResultColor(communication.currentResult)}>
                {communication.currentResult.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Starting Number */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Starting Number</span>
            <span className="text-lg font-bold text-blue-600">
              {communication.startingNumber.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
              <Calculator className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{communication.calculationCount}</div>
            <div className="text-xs text-gray-500">Calculations</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{communication.participantCount}</div>
            <div className="text-xs text-gray-500">Participants</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xs font-medium text-gray-900">Updated</div>
            <div className="text-xs text-gray-500">{formatDate(communication.updatedAt)}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Created {formatDate(communication.createdAt)}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {/* Show participant avatars (mock for now) */}
              {Array.from({ length: Math.min(communication.participantCount, 3) }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {communication.participantCount > 3 && (
                <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                  +{communication.participantCount - 3}
                </div>
              )}
            </div>
            
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              Join →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
