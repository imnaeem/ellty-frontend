'use client';

import { useEffect, useState } from 'react';
import { 
  useCommunicationCalculationsQuery, 
  useCalculationAddedSubscription,
  useAddCalculationMutation,
  Operation,
  CommunicationCalculationsQuery
} from '@/generated/graphql';
import { Plus, Minus, X, Divide, User, Clock, Loader, Send, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface CalculationHistoryProps {
  communicationId: string;
  startingNumber: number;
}

const operationIcons = {
  [Operation.Add]: { icon: Plus, symbol: '+', color: 'text-green-600', bg: 'bg-green-50' },
  [Operation.Subtract]: { icon: Minus, symbol: '−', color: 'text-red-600', bg: 'bg-red-50' },
  [Operation.Multiply]: { icon: X, symbol: '×', color: 'text-blue-600', bg: 'bg-blue-50' },
  [Operation.Divide]: { icon: Divide, symbol: '÷', color: 'text-purple-600', bg: 'bg-purple-50' },
};

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  communicationId,
  startingNumber,
}) => {
  const { user } = useAuth();
  const [selectedOperation, setSelectedOperation] = useState<Operation>(Operation.Add);
  const [numberInput, setNumberInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down');

  const { data, loading, error } = useCommunicationCalculationsQuery({
    variables: { communicationId },
    fetchPolicy: 'cache-and-network',
  });

  const [addCalculation] = useAddCalculationMutation();

  // Subscribe to new calculations
  const { data: newCalculationData } = useCalculationAddedSubscription({
    variables: { communicationId },
  });

  // Merge subscription data with query data
  const [calculations, setCalculations] = useState<CommunicationCalculationsQuery['communicationCalculations']>([]);

  useEffect(() => {
    if (data?.communicationCalculations) {
      setCalculations(data.communicationCalculations);
    }
  }, [data]);

  useEffect(() => {
    if (newCalculationData?.calculationAdded) {
      setCalculations(prev => [...prev, newCalculationData.calculationAdded]);
    }
  }, [newCalculationData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const buildCalculationTree = (calculations: CommunicationCalculationsQuery['communicationCalculations']) => {
    const tree: CommunicationCalculationsQuery['communicationCalculations'] = [];
    const calcMap = new Map<string, {calc: CommunicationCalculationsQuery['communicationCalculations'][0], children: CommunicationCalculationsQuery['communicationCalculations'], level: number}>();

    calculations.forEach(calc => {
      calcMap.set(calc.id, { calc, children: [], level: 0 });
    });

    calculations.forEach(calc => {
      const calcWithChildren = calcMap.get(calc.id)!;
      
      if (calc.parentCalculationId) {
        const parent = calcMap.get(calc.parentCalculationId);
        if (parent) {
          calcWithChildren.level = Math.min(parent.level + 1, 2);
          parent.children.push(calcWithChildren.calc);
        } else {
          tree.push(calcWithChildren.calc);
        }
      } else {
        tree.push(calcWithChildren.calc);
      }
    });

    return tree;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numberInput.trim() || !user) return;

    const rightOperand = parseFloat(numberInput);
    if (isNaN(rightOperand)) return;

    setIsSubmitting(true);
    try {
      const result = await addCalculation({
        variables: {
          input: {
            communicationId,
            operation: selectedOperation,
            rightOperand,
          },
        },
      });
      
      if (result.data?.addCalculation) {
        setNumberInput('');
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCalculation = (calcWithChildren: {calc: CommunicationCalculationsQuery['communicationCalculations'][0], children: CommunicationCalculationsQuery['communicationCalculations'], level: number}) => {
    const calc = calcWithChildren.calc;
    const config = operationIcons[calc.operation];
    const IconComponent = config.icon;
    const marginLeft = calcWithChildren.level * 32;

    return (
      <div key={calc.id} className="space-y-3">
        <div 
          className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
            <IconComponent className={`w-5 h-5 ${config.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {calc.author?.username || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(calc.createdAt)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 flex-wrap">
              {/* <span className="text-gray-900 font-medium">
                {calc.leftOperand.toLocaleString()}
              </span>
              <span className={`font-bold ${config.color}`}>
                {config.symbol}
              </span>
              <span className="text-gray-900 font-medium">
                {calc.rightOperand.toLocaleString()}
              </span>
              <span className="text-gray-500">=</span> */}
              <span className="text-lg font-bold text-gray-900">
                {calc.result.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {calcWithChildren.children.map(child => renderCalculation({calc: child, children: [], level: calcWithChildren.level + 1}))}
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading calculation history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>Failed to load calculations: {error.message}</p>
        </div>
      </div>
    );
  }

  // calculations is now managed by state
  const calculationTree = buildCalculationTree(calculations);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Calculation History
        </h3>

        <div className="space-y-4">
          {/* Starting Number */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-700 font-medium">Starting Number</span>
              </div>
              <div className="text-lg font-bold text-blue-900">
                {startingNumber.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Calculations Tree */}
          {calculationTree.map(calc => renderCalculation({calc: calc, children: [], level: 0}))}

          {/* No calculations yet */}
          {calculations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No calculations yet</p>
              <p className="text-xs">Be the first to add a calculation!</p>
            </div>
          )}

          {/* Add Calculation Form */}
          {user && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                  {/* Operation Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const spaceAbove = rect.top;
                        const dropdownHeight = 200; // Approximate height of dropdown
                        
                        // If there's not enough space below but enough above, open upward
                        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                          setDropdownPosition('up');
                        } else {
                          setDropdownPosition('down');
                        }
                        
                        setShowDropdown(!showDropdown);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-w-[120px]"
                    >
                      <span className={`font-bold ${operationIcons[selectedOperation].color}`}>
                        {operationIcons[selectedOperation].symbol}
                      </span>
                      <span className="text-sm text-gray-700">
                        {selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1).toLowerCase()}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        showDropdown && dropdownPosition === 'up' ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {showDropdown && (
                      <div className={`absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg ${
                        dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
                      }`}>
                        {Object.entries(operationIcons).map(([op, config]) => {
                          const IconComponent = config.icon;
                          return (
                            <button
                              key={op}
                              type="button"
                              onClick={() => {
                                setSelectedOperation(op as Operation);
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <IconComponent className={`w-4 h-4 ${config.color}`} />
                            
                              <span className="text-sm text-gray-700">
                                {op.charAt(0).toUpperCase() + op.slice(1).toLowerCase()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Number Input */}
                  <div className="flex-1">
                    <input
                      type="number"
                      step="any"
                      value={numberInput}
                      onChange={(e) => setNumberInput(e.target.value)}
                      placeholder="Enter a number..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!numberInput.trim() || isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
