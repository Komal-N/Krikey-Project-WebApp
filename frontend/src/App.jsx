import React, { useEffect, useState } from "react";
import './App.css';

const IMAGE_URL = "https://ui-avatars.com/api/?name=";

const App = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    async function fetchAuthors() {
      const res = await fetch('http://localhost:8080/top-authors');
      const data = await res.json();
      setAuthors(data);
    }

    fetchAuthors();
  }, []);

  return <div className="container">
    <div className="card-container">
      <h2>Top 10 Authors by Gross Sales</h2>
      {
        authors.map(author => {
          return <div className="author" key={author.id}>
            <div>
              <img src={IMAGE_URL + author.name} />
              <div className="details">
                <p>{author.name}</p>
                <p>{author.email}</p>
              </div>
            </div>
            <div>{author.total_revenue}</div>
          </div>
        })
      }
    </div>
  </div>
};

export default App;