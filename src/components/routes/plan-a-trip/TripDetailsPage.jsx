import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripDetails from './TripDetails';
import { Button } from '@/components/ui/button';

const TripDetailsPage = () => {
  const [tripData, setTripData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrip = localStorage.getItem('currentTrip');
    if (!storedTrip) {
      navigate('/plan-trip');
      return;
    }

    try {
      const parsedTrip = JSON.parse(storedTrip);
      setTripData(parsedTrip);
    } catch (error) {
      console.error('Error parsing trip data:', error);
      navigate('/plan-trip');
    }
  }, [navigate]);

  const handleCreateNewTrip = () => {
    navigate('/plan-a-trip');
  };

  if (!tripData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Trip Details</h1>
          <Button onClick={handleCreateNewTrip} variant="outline">
            Create New Trip
          </Button>
        </div>
        <TripDetails tripData={tripData} />
      </div>
    </div>
  );
};

export default TripDetailsPage; 