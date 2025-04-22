import { getCityDetails, PHOTO_URL } from "@/Service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRefContext } from "@/Context/RefContext/RefContext";

function Locationinfo({ trip }) {
  const [cityDets, setCityDets] = useState([]);
  const [photos, setPhotos] = useState("");
  const [Url, setUrl] = useState("");
  const { locationInfoRef } = useRefContext();

  const [allImages, setAllImages] = useState([]);

  const compliments = [
    "Indeed, a great choice!",
    "Hmm, this is one of the best places—spot on!",
    "Oh, absolutely! That's an excellent pick.",
    "I see you have a knack for picking the best.",
    "Ah, this is top-notch. You've got great taste!",
    "Can't argue with that—brilliant choice!",
    "Wow, you always know how to pick the perfect one.",
    "Hmm, I couldn't agree more—this is fantastic.",
    "This is a fantastic pick, you've got a great eye!",
    "Excellent choice, you nailed it!",
    "You've got a real talent for choosing the best.",
    "Spot on! This is exactly what I would have picked.",
    "Great minds think alike—what a selection!",
    "You've got an excellent sense for this.",
    "This is an amazing choice, very impressive!",
    "I see you've done your research—top choice.",
    "That's a choice I can definitely get behind.",
    "You have a knack for picking winners!",
    "This is a great find—well done!",
    "I couldn't have chosen better myself!",
    "Such a great pick, you really know your stuff.",
    "A fantastic choice, you've got style!",
    "That's a smart decision, I'm impressed!",
    "You have great taste, that's for sure.",
    "This was an obvious winner—great pick!",
    "Wow, this is just perfect—well chosen!",
    "That's a choice full of wisdom and class.",
  ];

  const randomCompliment =
    compliments[Math.floor(Math.random() * compliments.length)];

  const getCityInfo = async () => {
    try {
      const response = await getCityDetails(trip?.userSelection?.location);
      setCityDets(response);
      setPhotos(response.photos[0].photo_reference);
      setUrl(PHOTO_URL + response.photos[0].photo_reference);
    } catch (error) {
      console.error("Error fetching city details:", error);
    }
  };

  useEffect(() => {
    if (trip?.userSelection?.location) {
      getCityInfo();
    }
  }, [trip]);

  return (
    <div ref={locationInfoRef} className="location-info">
      <div className="location flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
          {trip?.userSelection?.location}
        </h1>
        <div className="carousel w-full max-w-xs">
          <Carousel className="w-full">
            <CarouselContent>
              {cityDets?.photos?.map((photo, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img
                          src={PHOTO_URL + photo.photo_reference}
                          alt={trip?.userSelection?.location}
                          className="w-full h-full object-cover"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Locationinfo;
