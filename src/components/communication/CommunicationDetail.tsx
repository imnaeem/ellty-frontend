'use client';

import { 
  useCommunicationQuery,
  useCommunicationUpdatedSubscription
} from '@/generated/graphql';
import { ArrowLeft, Users, Calculator, TrendingUp, Loader } from 'lucide-react';
import { CalculationHistory } from './CalculationHistory';
import { Header } from '../layout/Header';
import { formatDistanceToNow } from 'date-fns';

interface CommunicationDetailProps {
  communicationId: string;
  onBack?: () => void;
  onAuthClick?: (mode: 'login' | 'register') => void;
  onLogoClick?: () => void;
}

export const CommunicationDetail: React.FC<CommunicationDetailProps> = ({
  communicationId,
  onBack,
  onAuthClick,
  onLogoClick,
}) => {
  const { data, loading, error } = useCommunicationQuery({
    variables: { id: communicationId },
    fetchPolicy: 'cache-and-network',
  });

  // Subscribe to communication updates
  const { data: updateData } = useCommunicationUpdatedSubscription({
    variables: { communicationId },
  });

  const communication = updateData?.communicationUpdated || data?.communication;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading communication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Communication not found</h2>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!communication) {
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header onAuthClick={onAuthClick} onLogoClick={onLogoClick} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {communication.title || `Communication`}
              </h1>
              <p className="text-gray-600">
                Started by {communication.author?.username || 'Unknown'} • {formatDate(communication.createdAt)}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Starting Number</div>
                  <div className="text-lg font-bold text-gray-900">
                    {communication.startingNumber.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 border ${getResultBackground(communication.currentResult)}`}>
                  <TrendingUp className={`w-5 h-5 ${getResultColor(communication.currentResult)}`} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Current Result</div>
                  <div className={`text-lg font-bold ${getResultColor(communication.currentResult)}`}>
                    {communication.currentResult.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Calculations</div>
                  <div className="text-lg font-bold text-gray-900">
                    {communication.calculationCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Participants</div>
                  <div className="text-lg font-bold text-gray-900">
                    {communication.participantCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <CalculationHistory
          communicationId={communication.id}
          startingNumber={communication.startingNumber}
        />
      </div>
    </div>
  );
};
