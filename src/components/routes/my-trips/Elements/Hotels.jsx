import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Hotels({ trip }) {
  return (
    <div className="hotels my-10">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-5 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Recommended Hotels
      </h2>
      <div className="carousel w-full max-w-xs mx-auto">
        <Carousel className="w-full">
          <CarouselContent>
            {trip?.tripData?.hotels?.map((hotel, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground">{hotel.description}</p>
                        <p className="text-sm font-medium mt-2">Price: {hotel.price}</p>
                      </div>
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
  );
}

export default Hotels;
