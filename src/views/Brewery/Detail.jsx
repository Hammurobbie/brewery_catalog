import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

export default function BreweryDetail() {
  const [isLoading, setIsloading] = useState(true);
  const [brewery, setBrewery] = useState(null);
  const { id } = useParams();

  useEffect(()=>{
    axios.get(`https://api.openbrewerydb.org/breweries/${id}`)
    .then(res=> {
      setBrewery(res?.data);
      setIsloading(false);
    })
  },[id])

  return (
    <main>
      {isLoading ? (
        <div>
          <ClipLoader color="white" loading={isLoading}  size={50} />
        </div>
      ) : (
        <div>
          <h1>{brewery?.name}</h1>
          <p><a target="_blank" rel="noopener" href={`https://www.google.com/maps/place/${brewery?.street ?? ""} ${brewery?.city}, ${brewery?.state} ${brewery?.postal_code}`}>{brewery?.city}, {brewery?.state} {brewery?.postal_code.split("-")?.[0]}</a></p>
          <p>{brewery?.country}</p>
          <p><a href={`tel:${brewery?.phone}`}>{brewery?.phone}</a></p>
          {brewery?.website_url ? (
          <p>
            <a target="_blank" rel="noopener" href={brewery?.website_url}>View Website</a>
          </p>
          ) : null}
          <Link to='/breweries'>Back to Breweries</Link>
        </div>
      )}
    </main>
  );
}
