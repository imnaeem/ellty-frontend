'use client';

import { useState } from 'react';
import { X, Calculator, Hash, Type } from 'lucide-react';
import { useCreateCommunicationMutation } from '@/generated/graphql';

interface CreateCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateCommunicationModal: React.FC<CreateCommunicationModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [formData, setFormData] = useState({
    startingNumber: '',
    title: '',
  });
  const [error, setError] = useState('');

  const [createCommunication, { loading }] = useCreateCommunicationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const startingNumber = parseFloat(formData.startingNumber);
    if (isNaN(startingNumber)) {
      setError('Please enter a valid number');
      return;
    }

    try {
      const result = await createCommunication({
        variables: {
          input: {
            startingNumber,
            title: formData.title.trim() || undefined,
          },
        },
      });

      if (result.data?.createCommunication) {
        setFormData({ startingNumber: '', title: '' });
        onCreated?.();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create communication');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setFormData({ startingNumber: '', title: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal positioning wrapper */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Start New Communication
                  </h3>
                  <p className="text-sm text-gray-500">
                    Begin a mathematical conversation
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Starting Number */}
              <div>
                <label htmlFor="startingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="startingNumber"
                    name="startingNumber"
                    type="number"
                    step="any"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter a number to start with"
                    value={formData.startingNumber}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This number will be the foundation of your mathematical conversation
                </p>
              </div>

              {/* Title (Optional) */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    maxLength={100}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Give your communication a title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Help others understand what this conversation is about
                </p>
              </div>

              {/* Preview */}
              {formData.startingNumber && !isNaN(parseFloat(formData.startingNumber)) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-700">Starting with:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {parseFloat(formData.startingNumber).toLocaleString()}
                    </span>
                  </div>
                  {formData.title && (
                    <div className="mt-1">
                      <span className="text-sm text-blue-700">Title: "{formData.title}"</span>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.startingNumber || isNaN(parseFloat(formData.startingNumber))}
              className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Start Communication'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
