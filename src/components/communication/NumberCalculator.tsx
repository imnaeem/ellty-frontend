'use client';

import { useState } from 'react';
import { Plus, Minus, X, Divide, Send, Hash } from 'lucide-react';
import { Operation, useAddCalculationMutation } from '@/generated/graphql';

interface NumberCalculatorProps {
  communicationId: string;
  currentResult: number;
  onCalculationAdded?: () => void;
}

const operationConfig = {
  [Operation.Add]: {
    label: 'Add (+)',
    icon: Plus,
    symbol: '+',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  [Operation.Subtract]: {
    label: 'Subtract (−)',
    icon: Minus,
    symbol: '−',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  [Operation.Multiply]: {
    label: 'Multiply (×)',
    icon: X,
    symbol: '×',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  [Operation.Divide]: {
    label: 'Divide (÷)',
    icon: Divide,
    symbol: '÷',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
};

export const NumberCalculator: React.FC<NumberCalculatorProps> = ({
  communicationId,
  currentResult,
  onCalculationAdded,
}) => {
  const [selectedOperation, setSelectedOperation] = useState<Operation>(Operation.Add);
  const [rightOperand, setRightOperand] = useState('');
  const [error, setError] = useState('');

  const [addCalculation, { loading }] = useAddCalculationMutation();

  const calculatePreview = () => {
    const number = parseFloat(rightOperand);
    if (isNaN(number)) return null;

    switch (selectedOperation) {
      case Operation.Add:
        return currentResult + number;
      case Operation.Subtract:
        return currentResult - number;
      case Operation.Multiply:
        return currentResult * number;
      case Operation.Divide:
        return number === 0 ? null : currentResult / number;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const number = parseFloat(rightOperand);
    if (isNaN(number)) {
      setError('Please enter a valid number');
      return;
    }

    if (selectedOperation === Operation.Divide && number === 0) {
      setError('Cannot divide by zero');
      return;
    }

    try {
      const result = await addCalculation({
        variables: {
          input: {
            communicationId,
            operation: selectedOperation,
            rightOperand: number,
          },
        },
      });

      if (result.data?.addCalculation) {
        setRightOperand('');
        onCalculationAdded?.();
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to add calculation');
    }
  };

  const preview = calculatePreview();
  const config = operationConfig[selectedOperation];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Hash className="w-5 h-5 mr-2 text-blue-600" />
          Add Your Calculation
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Current Result Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Current Result</div>
              <div className="text-2xl font-bold text-gray-900">
                {currentResult.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Operation Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Operation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(operationConfig).map(([op, conf]) => {
                const Icon = conf.icon;
                const isSelected = selectedOperation === op;
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setSelectedOperation(op as Operation)}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${conf.bgColor} ${conf.borderColor} ${conf.color}`
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number Input */}
          <div>
            <label htmlFor="rightOperand" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Number
            </label>
            <input
              id="rightOperand"
              type="number"
              step="any"
              required
              value={rightOperand}
              onChange={(e) => setRightOperand(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter a number..."
            />
          </div>

          {/* Preview */}
          {rightOperand && !isNaN(parseFloat(rightOperand)) && (
            <div className={`rounded-lg p-4 border-2 ${config.bgColor} ${config.borderColor}`}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
                <div className="flex items-center justify-center space-x-3 text-lg">
                  <span className="font-bold text-gray-900">{currentResult.toLocaleString()}</span>
                  <span className={`font-bold ${config.color}`}>{config.symbol}</span>
                  <span className="font-bold text-gray-900">{parseFloat(rightOperand).toLocaleString()}</span>
                  <span className="text-gray-500">=</span>
                  <span className={`font-bold text-xl ${config.color}`}>
                    {preview !== null ? preview.toLocaleString() : 'Error'}
                  </span>
                </div>
                {preview === null && selectedOperation === Operation.Divide && parseFloat(rightOperand) === 0 && (
                  <div className="text-red-600 text-sm mt-1">Cannot divide by zero</div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !rightOperand || isNaN(parseFloat(rightOperand)) || preview === null}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding calculation...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Add Calculation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
