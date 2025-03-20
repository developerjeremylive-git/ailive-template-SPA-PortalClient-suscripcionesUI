import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CustomerDetailsForm: React.FC = () => {
  const { user, profile, updateProfile, supabase } = useAuth();
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load user data from Supabase or other source
    async function loadCustomerDetails() {
      setIsLoading(true);
      try {
        // Fetch customer details from Supabase based on user ID
        // Replace this with your actual Supabase query
        const { data, error } = await supabase
          .from('customer_details')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (error) {
          console.error('Error loading customer details:', error);
          setError('Failed to load customer details.');
        } else if (data) {
          setStreetAddress(data.street_address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setZipCode(data.zip_code || '');
          setCountry(data.country || '');
          setPhoneNumber(data.phone_number || '');
        }
      } catch (err) {
        console.error('Error loading customer details:', err);
        setError('Failed to load customer details.');
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadCustomerDetails();
    }
  }, [user]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     // Update customer details in Supabase
  //     // Replace this with your actual Supabase update query
  //     const { data, error } = await supabase
  //       .from('customer_details')
  //       .update({
  //         street_address: streetAddress,
  //         city: city,
  //         state: state,
  //         zip_code: zipCode,
  //         country: country,
  //         phone_number: phoneNumber,
  //       })
  //       .eq('user_id', user?.id);

  //     if (error) {
  //       console.error('Error updating customer details:', error);
  //       setError('Failed to update customer details.');
  //     } else {
  //       console.log('Customer details updated successfully!');
  //       // Optionally, show a success message to the user
  //     }
  //   } catch (err) {
  //     console.error('Error updating customer details:', err);
  //     setError('Failed to update customer details.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (isLoading) {
    return <div>Loading customer details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // <form onSubmit={handleSubmit}>
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="streetAddress">Street Address:</label>
        <input
          type="text"
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="zipCode">Zip Code:</label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Details'}
      </button>
    </form>
  );
};

export default CustomerDetailsForm;
