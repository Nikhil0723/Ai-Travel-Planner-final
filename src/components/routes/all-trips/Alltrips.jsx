import { db } from "@/Service/Firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AlltripsCard from "./AlltripsCard";
import { Link } from "react-router-dom";

function Alltrips() {
  const [allTrips, setAllTrips] = useState([]);

  const getAllTrips = async () => {
    const querySnapshot = await getDocs(collection(db, "Trips"));
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });

    const reversedTrips = trips.reverse();
    setAllTrips(reversedTrips);
  };

  useEffect(() => {
    getAllTrips();
  }, []);

  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center my-5 md:my-10 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        All Trips
      </h1>
      <div className="flex gap-3 flex-wrap justify-evenly items-center">
        {allTrips?.length > 0
          ? allTrips?.map((trip, idx) => (
              <Link
                key={idx}
                to={"/my-trips/" + trip.tripId}
                className="w-full md:w-[48%]"
              >
                <AlltripsCard trip={trip} />
              </Link>
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="w-[48%] h-52 rounded-md border bg-card-foreground/50 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Alltrips;
