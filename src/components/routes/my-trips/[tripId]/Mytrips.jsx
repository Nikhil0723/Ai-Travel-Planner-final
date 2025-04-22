import { Button } from '@/components/ui/button';
import { db } from '@/Service/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'
import Locationinfo from '../Elements/Locationinfo';
import Hotels from '../Elements/Hotels';
import Places from '../Elements/Places';

function Mytrips() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  
  const getTripData = async () => {
    const docRef = doc(db, 'Trips', tripId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      toast.error('No Such Trip');
    }
  };

  useEffect(()=>{
    tripId && getTripData();
  }, [tripId]);
  
  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className='py-2'>
      <Locationinfo trip={trip} />
      <Hotels trip={trip} />
      <Places trip={trip} />
    </div>
  )
}

export default Mytrips;