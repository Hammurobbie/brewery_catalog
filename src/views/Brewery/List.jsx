import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Toggle from 'react-toggle'

export default function BreweryList() {
  const [breweries, setBreweries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [reset, setReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(false);

  useEffect(()=>{
    axios.get(`https://api.openbrewerydb.org/breweries?page=${page}&sort=type,name:${order ? "asc" : "desc"}&per_page=10`)
    .then(res => {
      setBreweries(res?.data);
    })
    .catch(err=> console.log(err.message))
  },[reset, page, order]);

  const handleSearchChange = e => {
    setErrorMessage("");
    setSearchValue(e.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();
    if(!searchValue) {
      setErrorMessage("Please provide a search term");
      return;
    }
    setErrorMessage("");
    axios.get(`https://api.openbrewerydb.org/breweries/search?query=${searchValue}`)
    .then(res => {
      setBreweries(res?.data);
    })
    .catch(err=> console.log(err.message))
  };

  const handleReset = () => {
    setErrorMessage("");
    setSearchValue("");
    setPage(1);
    setReset(!reset);
  }

  const handleChangePage = (dir) => {
    if (dir === "+") {
      setPage(page + 1);
    } else if(page > 1) {
      setPage(page - 1);
    };
  };

  return (
    <main>
      <label>
        <Toggle
          defaultChecked={false}
          icons={false}
          onChange={()=>setOrder(!order)} />
        <span>{order ? "Ascending order" : "Descending order"}</span>
      </label>
      <h1>Brewgle</h1>
      <em>{errorMessage}</em>
      <form>
        <input type='text' name='search' placeholder='Find a brewery' onChange={handleSearchChange} />
        <div>
          <button type='submit' onClick={handleSearch}>Search</button>
          <button type='reset' onClick={handleReset}>Reset</button>
        </div>
      </form>
      <ul>
        {breweries.length === 0 ? <li><p>no results</p></li> : (breweries.map(brewery => (
          <li key={brewery.id}>
            <Link to={`/breweries/${brewery.id}`}>{brewery.name} - {brewery.city}, {brewery.state}</Link>
          </li>
        )))}
      </ul>
      <div className="nav_buttons">
        <button onClick={()=>handleChangePage("-")}>Previous</button>
        <p>Page {page}</p>
        <button onClick={()=>handleChangePage("+")}>Next</button>
      </div>
    </main>
  );
}
