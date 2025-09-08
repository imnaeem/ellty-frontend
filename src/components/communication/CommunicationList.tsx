'use client';

import { useEffect, useState } from 'react';
import { useAllCommunicationsQuery, useCommunicationCreatedSubscription, AllCommunicationsQuery } from '@/generated/graphql';
import { CommunicationCard } from './CommunicationCard';
import { Calculator, Loader, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export type Communications = AllCommunicationsQuery['allCommunications'];

interface CommunicationListProps {
  onCommunicationClick?: (communication: Communications[0]) => void;
  onCreateCommunication?: () => void;
}

export const CommunicationList: React.FC<CommunicationListProps> = ({ 
  onCommunicationClick,
  onCreateCommunication 
}) => {
  const [communications, setCommunications] = useState<Communications>([]);
  const { isAuthenticated } = useAuth();

  const { data, loading, error, refetch } = useAllCommunicationsQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Subscribe to new communications
  const { data: newCommunicationData } = useCommunicationCreatedSubscription();
  
  useEffect(() => {
    if (data?.allCommunications) {
      setCommunications(data.allCommunications);
    }
  }, [data]);

  useEffect(() => {
    if (newCommunicationData?.communicationCreated) {
      setCommunications(prev => [...prev, newCommunicationData.communicationCreated]);
    }
  }, [newCommunicationData]);



  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading communications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load communications</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (communications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No communications yet</h3>
        <p className="text-gray-600">
          Be the first to start a mathematical conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Communications</h2>
          <p className="text-gray-600 mt-1">
            {communications.length} conversation{communications.length !== 1 ? 's' : ''} happening now
          </p>
        </div>
        
        {isAuthenticated ? (
          onCreateCommunication ? (
            <button
              onClick={onCreateCommunication}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Communication
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              Create feature unavailable
            </div>
          )
        ) : (
          <div className="text-sm text-gray-500">
            Sign in to start conversations
          </div>
        )}
      </div>

      {/* Communication Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communications.map((communication, index) => (
          <CommunicationCard
            key={communication.id}
            communication={communication}
            onClick={() => onCommunicationClick?.(communication)}
            index={index}
          />
        ))}
      </div>

      {/* Loading overlay for refetch */}
      {loading && data && (
        <div className="text-center py-4">
          <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-gray-600 mt-2">Updating...</p>
        </div>
      )}
    </div>
  );
};
