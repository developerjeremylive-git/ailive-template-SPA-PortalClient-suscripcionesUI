import React from 'react';

const CheckoutForm: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-violet-600 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Checkout</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-violet-200 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-violet-200 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your Email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-violet-200 text-sm font-bold mb-2">
            Card Number:
          </label>
          <input
            type="text"
            id="cardNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="**** **** **** ****"
          />
        </div>
        <button
          className="bg-white hover:bg-purple-200 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
