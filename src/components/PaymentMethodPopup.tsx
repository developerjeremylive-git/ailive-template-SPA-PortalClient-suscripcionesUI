import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface PaymentMethodPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentMethodPopup: React.FC<PaymentMethodPopupProps> = ({ isOpen, onClose }) => {
  const { user, supabase } = useAuth();
  const { isDarkTheme } = useApp();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  const validateCardName = (value: string) => {
    if (value.length > 50) {
      setCardNameError('Name must be less than 50 characters.');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setCardNameError('Name must contain only letters and spaces.');
      return false;
    }
    setCardNameError('');
    return true;
  };

  const validateCardNumber = (value: string) => {
    if (!/^\d+$/.test(value)) {
      setCardNumberError('Card number must contain only numbers.');
      return false;
    } else if (value.length !== 16) {
      setCardNumberError('Card number must be 16 digits.');
      return false;
    } else {
      setCardNumberError('');
      return true;
    }
  };

  const validateExpiryDate = (value: string) => {
    // Basic expiry date validation (MM/YY format)
    if (value.length !== 5 || value[2] !== '/') {
      setExpiryDateError('Expiry date must be in MM/YY format.');
      return false;
    } else {
      setExpiryDateError('');
      return true;
    }
  };

  const validateCvv = (value: string) => {
    if (!/^\d+$/.test(value)) {
      setCvvError('CVV must contain only numbers.');
      return false;
    } else if (value.length !== 3) {
      setCvvError('CVV must be 3 digits.');
      return false;
    } else {
      setCvvError('');
      return true;
    }
  };

  const isFormValid = () => {
    const hasValidData = cardName.trim() !== '' && cardNumber.trim() !== '' && expiryDate.trim() !== '' && cvv.trim() !== '';
    const hasNoErrors = cardNameError === '' && cardNumberError === '' && expiryDateError === '' && cvvError === '';
    return hasValidData && hasNoErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Implement logic to add the payment method using the PayPal API
      // This is a placeholder implementation. You will need to implement the actual logic using the PayPal API.
      console.log('Adding payment method:', {
        cardName,
        cardNumber,
        expiryDate,
        cvv,
      });

      if (!user?.id) {
        console.error('User ID is missing.');
        setError('User ID is missing.');
        return;
      }

      // Store the payment method details in Supabase
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([
          {
            user_id: user.id,
            card_name: cardName,
            card_number: cardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding payment method:', error);
        setError('Failed to add payment method: ' + error.message);
      } else {
        console.log('Payment method added successfully!');
        setShowNotification(true);

        // Set a timeout to close the popup after 3 seconds
        timerIdRef.current = setTimeout(() => {
          setShowNotification(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError('Failed to add payment method: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`rounded-lg p-8 w-96 shadow-lg shadow-purple-500/50 relative ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-600 to-violet-600'}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="absolute top-4 right-4 text-violet-200 hover:text-white transition-colors"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
          <h2 className="text-2xl font-bold text-white mb-4">Add Payment Method</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardName" className="block text-white text-sm font-medium mb-1">Card Holder Name</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => {
                  setCardName(e.target.value);
                  validateCardName(e.target.value);
                }}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${cardNumberError ? 'border-red-500' : ''
                  }`}
                required
              />
              {cardNameError && <p className="text-red-500 text-sm mt-1 text-white">{cardNameError}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-violet-200 text-sm font-bold mb-2">
                Card Number
              </label>
              <motion.input
                type="text"
                id="cardNumber"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${cardNumberError ? 'border-red-500' : ''
                  }`}
                placeholder="**** **** **** ****"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  validateCardNumber(e.target.value);
                }}
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                maxLength={16}
              />
              {cardNumberError && <p className="text-red-500 text-sm mt-1 text-white">{cardNumberError}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="expiryDate" className="block text-violet-200 text-sm font-bold mb-2">
                Expiry Date
              </label>
              <motion.input
                type="text"
                id="expiryDate"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${expiryDateError ? 'border-red-500' : ''
                  }`}
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  validateExpiryDate(e.target.value);
                }}
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                maxLength={5}
              />
              {expiryDateError && <p className="text-red-500 text-sm mt-1 text-white">{expiryDateError}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="cvv" className="block text-violet-200 text-sm font-bold mb-2">
                CVV
              </label>
              <motion.input
                type="text"
                id="cvv"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${cvvError ? 'border-red-500' : ''
                  }`}
                placeholder="123"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value);
                  validateCvv(e.target.value);
                }}
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                maxLength={3}
              />
              {cvvError && <p className="text-red-500 text-sm mt-1 text-white">{cvvError}</p>}
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-white">{error}</p>}
            <div className="flex items-center justify-center" style={{ marginTop: '2rem' }}>
              <motion.button
                className={`bg-gradient-to-br from-purple-600 to-violet-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-lg shadow-purple-500/50 ${isFormValid() ? 'hover:bg-purple-200' : 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'}`}
                type="submit"
                whileHover={isFormValid() ? { scale: 1.1 } : {}}
                whileTap={isFormValid() ? { scale: 0.9 } : {}}
                transition={{ duration: 0.2 }}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? 'Adding...' : 'Add Card'}
              </motion.button>
            </div>
          </form>
        </motion.div>
        {showNotification && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-md shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            Payment method added successfully!
          </motion.div>
        )}
      </motion.div>)
  );
};

export default PaymentMethodPopup;
