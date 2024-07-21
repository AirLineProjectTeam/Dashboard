import React, { useEffect, useState } from "react";
import axios from "axios";

function AllTicketDash() {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage] = useState(10); 








  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips.json');
        if (response.data) {
          const fetchedTrips = Object.keys(response.data).map(key => ({
            id: key,
            ...response.data[key]
          }));
          setTrips(fetchedTrips);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);




  const handleremove = async (id) => {
    try {
      await axios.delete(`https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips/${id}.json`);
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };










  const handleupdate = async (id) => {
    try {
      const ticketToUpdate = trips.find(trip => trip.id === id);

      if (ticketToUpdate) {
        const newDestination = prompt("Enter new destination", ticketToUpdate.destination);

        if (newDestination !== null) { // Prompt returns null if cancelled
          const updatedTrip = { ...ticketToUpdate, destination: newDestination };

          await axios.put(`https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips/${id}.json`, updatedTrip);

          setTrips(prevTrips => prevTrips.map(trip =>
            trip.id === id ? updatedTrip : trip
          ));
        }
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };










  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);

  const paginate = pageNumber => setCurrentPage(pageNumber);










  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 lg:p-20 ml-20 mx-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Flight Number</th>
              <th className="py-3 px-6 text-left">Arrival Time</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Destination</th>
              <th className="py-3 px-6 text-left">Available Seats</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentTrips.map(ticket => (
              <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{ticket.flightNum}</td>
                <td className="py-3 px-6 text-left">{ticket.arrivalTime}</td>
                <td className="py-3 px-6 text-left">{ticket.price}</td>
                <td className="py-3 px-6 text-left">{ticket.destination}</td>
                <td className="py-3 px-6 text-left">{ticket.Availableseats}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
                         onClick={() => handleupdate(ticket.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h2m4 0h-4m0 0V8m0 4v4M8 4h.01M8 20h.01M4 8h.01M4 16h.01M4 12h.01M12 12v4m0-8v4m4-4H8M4 4h16v16H4V4z" />
                      </svg>
                    </div>
                    <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
                         onClick={() => handleremove(ticket.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: Math.ceil(trips.length / tripsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`py-2 px-4 mx-1 bg-white border border-gray-300 ${currentPage === i + 1 ? 'bg-gray-200' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AllTicketDash;
