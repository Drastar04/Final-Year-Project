import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/scholarships/')
      .then(res => {
        setScholarships(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">Available Scholarships</h1>
      {scholarships.length === 0 ? (
        <p>No scholarships found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map(scholarship => (
            <div key={scholarship.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{scholarship.title}</h2>
              <p className="text-sm text-gray-600">{scholarship.provider}</p>
              <p><strong>Amount:</strong> {scholarship.amount}</p>
              <p><strong>Deadline:</strong> {scholarship.deadline}</p>
              <a
                href={scholarship.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
