import React from 'react';

const TripDetails = ({ tripData }) => {
  if (!tripData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Trip Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Trip to {tripData.location}</h1>
        <div className="flex justify-center gap-4 text-gray-600">
          <span>📅 {tripData.duration}</span>
          <span>💰 {tripData.budget}</span>
          <span>👥 {tripData.people}</span>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Total Estimated Cost</h3>
            <p className="text-2xl font-bold text-blue-600">{tripData.totalEstimatedCost}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Travel Style</h3>
            <p className="text-lg">{tripData.budget} Budget</p>
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Daily Itinerary</h2>
        {tripData.itinerary.map((day, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-bold">Day {day.day}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {day.places.map((place, placeIndex) => (
                  <div key={placeIndex} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold">{place.name}</h4>
                        <p className="text-gray-600 mt-1">{place.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">⏰ {place.time}</p>
                        <p className="text-sm font-medium text-green-600">💵 {place.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Tips */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Travel Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Make sure to carry valid ID proof and necessary documents</li>
          <li>Keep emergency contact numbers handy</li>
          <li>Check weather forecasts before your trip</li>
          <li>Book accommodations in advance</li>
          <li>Carry necessary medications if required</li>
        </ul>
      </div>
    </div>
  );
};

export default TripDetails; 