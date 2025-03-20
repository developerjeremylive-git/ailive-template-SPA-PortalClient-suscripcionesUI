import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCheckoutFormProps {
  name: string;
  email: string;
}

const AnimatedCheckoutForm: React.FC<AnimatedCheckoutFormProps> = ({ name, email }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-purple-600 to-violet-600 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Checkout</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-violet-200 text-sm font-bold mb-2">
            Name:
          </label>
          <motion.input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
            value={name}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-violet-200 text-sm font-bold mb-2">
            Email:
          </label>
          <motion.input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Email"
            value={email}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-violet-200 text-sm font-bold mb-2">
            Card Number:
          </label>
          <motion.input
            type="text"
            id="cardNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="**** **** **** ****"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <motion.button
          className="bg-white hover:bg-purple-200 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          Pay Now
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AnimatedCheckoutForm;
