"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreateCommunicationModal } from "@/components/communication/CreateCommunicationModal";
import { CommunicationList } from "@/components/communication/CommunicationList";
import { CommunicationDetail } from "@/components/communication/CommunicationDetail";
import { Calculator, Users, MessageSquare, TrendingUp } from "lucide-react";
import { Communications } from '@/components/communication/CommunicationList';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communications[0] | null>(null);
  const [showExplore, setShowExplore] = useState(false);

  useEffect(() => {
    const commId = searchParams.get('comm');
    if (commId) {
      setSelectedCommunication({ id: commId } as Communications[0]);
      if (!isAuthenticated) {
        setShowExplore(true);
      }
    } else if (!commId) {
      setSelectedCommunication(null);
    }
  }, [searchParams, isAuthenticated]);

  if (isLoading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCreateCommunication = () => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const handleCommunicationClick = (communication: Communications[0]) => {
    const url = new URL(window.location.href);
    url.searchParams.set('comm', communication.id);
    router.push(url.pathname + url.search);
    setSelectedCommunication(communication);
  };

  const handleBackToList = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('comm');
    router.push(url.pathname + (url.search ? url.search : ''));
    setSelectedCommunication(null);
  };

  const handleLogoClick = () => {
    if (!isAuthenticated) {
      setShowExplore(false);
      setSelectedCommunication(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('comm');
      router.push(url.pathname);
    } else {
      setSelectedCommunication(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('comm');
      router.push(url.pathname);
    }
  };

  if (selectedCommunication) {
    return (
      <CommunicationDetail
        communicationId={selectedCommunication.id}
        onBack={handleBackToList}
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
        onLogoClick={handleLogoClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header 
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
        onLogoClick={handleLogoClick}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isAuthenticated && !showExplore ? (
          <div className="py-20">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NumberTalk</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  A revolutionary platform where people communicate through numbers and mathematical operations. 
                  Start conversations with calculations and build complex discussions through mathematical expressions.
                </p>
        </div>
        
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              
                <button
                  onClick={() => setShowExplore(true)}
                  className="inline-flex items-center px-8 py-4 border border-blue-300 text-base font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Explore as Guest
                </button>
                  </div>

              <div className="grid md:grid-cols-3 gap-8 mt-20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Number Communications</h3>
                  <p className="text-gray-600">Start conversations with a number and build discussions through mathematical operations.</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Calculation</h3>
                  <p className="text-gray-600">Multiple users can contribute to the same calculation thread, creating complex mathematical discussions.</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                  <p className="text-gray-600">See calculations and responses appear in real-time as other users contribute to the conversation.</p>
                </div>
              </div>
            </div>
        </div>
        ) : (
          <div className="py-8">
            <CommunicationList 
              onCommunicationClick={handleCommunicationClick}
              onCreateCommunication={isAuthenticated ? handleCreateCommunication : undefined}
            />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

      <CreateCommunicationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
