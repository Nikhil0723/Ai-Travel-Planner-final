import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { chatSession } from "@/Service/AiModel";
import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TripDetails from "./TripDetails";

function CreateTrip({createTripPageRef}) {
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    Budget: "",
    People: ""
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    console.log(`Updating ${name} with value:`, value);
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: value
      };
      console.log('New form state:', newState);
      return newState;
    });
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    handleInputChange("location", value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion) => {
    handleInputChange("location", suggestion.display_name);
    setShowSuggestions(false);
  };

  const SaveTrip = async (TripData) => {
    const id = Date.now().toString();
    setIsLoading(true);
    await setDoc(doc(db, "Trips", id), {
      tripId: id,
      userSelection: formData,
      tripData: TripData,
    });
    setIsLoading(false);
    localStorage.setItem("Trip", JSON.stringify(TripData));
    navigate("/my-trips/" + id);
  };

  const generateTrip = async () => {
    try {
      // Validate all fields are filled
      if (!formData.location || !formData.noOfDays || !formData.Budget || !formData.People) {
        toast.error("Please fill out all fields");
        return;
      }

      // Validate number of days
      const days = parseInt(formData.noOfDays);
      if (isNaN(days) || days < 1 || days > 5) {
        toast.error("Number of days must be between 1 and 5");
        return;
      }

      setIsLoading(true);
      console.log("Current form data:", formData);

      const prompt = `Create a detailed ${formData.noOfDays}-day trip itinerary for ${formData.location} with a ${formData.Budget} budget for ${formData.People}. Include specific places to visit, activities, and estimated costs. Format the response as a JSON object with the following structure:
      {
        "location": "${formData.location}",
        "duration": "${formData.noOfDays} days",
        "budget": "${formData.Budget}",
        "people": "${formData.People}",
        "itinerary": [
          {
            "day": 1,
            "places": [
              {
                "name": "Place Name",
                "description": "Description",
                "time": "Time to visit",
                "cost": "Estimated cost"
              }
            ]
          }
        ],
        "totalEstimatedCost": "Total estimated cost"
      }`;

      const result = await chatSession.sendMessage(prompt);
      console.log("AI Response:", result);

      if (!result || !result.response) {
        throw new Error("No response from AI");
      }

      // Get the response text
      const responseText = result.response.text();
      console.log("Response text:", responseText);

      // Try to parse the JSON response
      let tripData;
      try {
        tripData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid response format from AI");
      }

      if (!tripData || !tripData.itinerary) {
        throw new Error("Invalid trip data structure");
      }

      // Store the trip data in localStorage and navigate to the trip details page
      localStorage.setItem('currentTrip', JSON.stringify(tripData));
      setIsLoading(false);
      toast.success("Trip generated successfully!");
      navigate('/trip-details');
    } catch (error) {
      console.error("Trip generation error:", error);
      setIsLoading(false);
      toast.error(error.message || "Failed to generate trip. Please try again.");
    }
  };

  return (
    <div ref={createTripPageRef} className="mt-10 text-center">
      <div className="text">
        <h2 className="text-3xl md:text-5xl font-bold mb-5 flex items-center justify-center">
          <span className="hidden md:block">🚀</span>{" "}
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Share Your Travel Preferences{" "}
          </span>{" "}
          <span className="hidden md:block">🚀</span>
        </h2>
        <p className="opacity-90 mx-auto text-center text-md md:text-xl font-medium tracking-tight text-primary/80">
          Embark on your dream adventure with just a few simple details. <br />
          <span className="bg-gradient-to-b text-2xl from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
            JourneyJolt
          </span>{" "}
          <br /> will curate a personalized itinerary, crafted to match your
          unique preferences!
        </p>
      </div>

      <div className="form mt-14 flex flex-col gap-16 md:gap-20 ">
        <div className="place relative">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Where do you want to Explore?
            </span>{" "}
            🏖️
          </h2>
          <div className="relative">
            <Input
              className="text-center"
              placeholder="Enter your destination (e.g., Paris, France)"
              type="text"
              name="location"
              value={formData.location}
              required
              onChange={handleLocationChange}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="day">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              How long is your Trip?
            </span>{" "}
            🕜
          </h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            min="1"
            max="5"
            name="noOfDays"
            value={formData.noOfDays}
            required
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div className="budget">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              What's your Budget?{" "}
            </span>{" "}
            💰
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectBudgetOptions.map((item) => {
              return (
                <div
                  onClick={() => handleInputChange("Budget", item.title)}
                  key={item.id}
                  className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-foreground/10 hover:shadow-md
                    ${formData.Budget === item.title ? "border border-foreground/80" : ""}
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} <span className={`
                      ${formData.Budget === item.title ? 
                      "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent" :
                      ""}
                      `}>{item.title}</span>
                  </h3>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="people">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Who are you traveling with?{" "}
            </span>{" "}
            🚗
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectNoOfPersons.map((item) => {
              return (
                <div
                  onClick={() => handleInputChange("People", item.no)}
                  key={item.id}
                  className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-foreground/10 hover:shadow-md
                    ${formData.People === item.no ? "border border-foreground/80" : ""}
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} <span className={`
                      ${formData.People === item.no ? 
                      "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent" :
                      ""}
                      `}>{item.title}</span>
                  </h3>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.desc}</p>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.no}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="create-trip-btn w-full flex items-center justify-center h-32">
        <Button disabled={isLoading} onClick={generateTrip}>
          {isLoading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            "Let's Go 🌏"
          )}
        </Button>
      </div>

      {/* Display raw generated data */}
      {generatedTrip && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Raw Generated Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-left">
            {generatedTrip}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
