import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

// Custom styles for Modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function AllTicketDash() {
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage] = useState(7);
  const [filteredTrips, setFilteredTrips] = useState([]);

  // Filters
  const [flightNumFilter, setFlightNumFilter] = useState("");
  const [arrivalTimeFilter, setArrivalTimeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [availableSeatsFilter, setAvailableSeatsFilter] = useState("");

  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editTrip, setEditTrip] = useState({});

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips.json');
      if (response.data) {
        const fetchedTrips = Object.keys(response.data).map(key => ({
          id: key,
          ...response.data[key]
        }));
        setTrips(fetchedTrips);

      }
    };
    fetchTrips();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = trips.filter((trip) => {
        return (
          (!flightNumFilter ||
            (trip.flightNum &&
              trip.flightNum
                .toLowerCase()
                .includes(flightNumFilter.toLowerCase()))) &&
          (!arrivalTimeFilter ||
            (trip.arrivalTime &&
              trip.arrivalTime
                .toLowerCase()
                .includes(arrivalTimeFilter.toLowerCase()))) &&
          (!priceFilter ||
            (trip.price &&
              trip.price.toString().includes(priceFilter.toString()))) &&
          (!destinationFilter ||
            (trip.destination &&
              trip.destination
                .toLowerCase()
                .includes(destinationFilter.toLowerCase()))) &&
          (!availableSeatsFilter ||
            (trip.Availableseats &&
              trip.Availableseats.toString().includes(
                availableSeatsFilter.toString()
              )))
        );
      });
      setFilteredTrips(filtered);
    };
    applyFilters();
  }, [
    trips,
    flightNumFilter,
    arrivalTimeFilter,
    priceFilter,
    destinationFilter,
    availableSeatsFilter,
  ]);

  const handleremove = async (id) => {
    await axios.delete(`https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips/${id}.json`);
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  const handleupdate = (id) => {
    const ticketToUpdate = trips.find(trip => trip.id === id);
    setEditTrip(ticketToUpdate);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setEditTrip({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditTrip(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/Trips/${editTrip.id}.json`, editTrip);
      setTrips(prevTrips => prevTrips.map(trip => trip.id === editTrip.id ? editTrip : trip));
      setModalIsOpen(false);

    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 lg:p-20 mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Filter Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Flight Number"
            value={flightNumFilter}
            onChange={(e) => setFlightNumFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl"

          />
          <input
            type="text"
            placeholder="Arrival Time"
            value={arrivalTimeFilter}
            onChange={(e) => setArrivalTimeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl w-full"
          />
          <input
            type="text"
            placeholder="Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl w-full"
          />
          <input
            type="text"
            placeholder="Destination"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl w-full"
          />
          <input
            type="text"
            placeholder="Available Seats"
            value={availableSeatsFilter}
            onChange={(e) => setAvailableSeatsFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto shadow-xl rounded-3xl">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-2 sm:px-4 text-left">Flight Number</th>
              <th className="py-3 px-2 sm:px-4 text-left">Arrival Time</th>
              <th className="py-3 px-2 sm:px-4 text-left">Price</th>
              <th className="py-3 px-2 sm:px-4 text-left">Destination</th>
              <th className="py-3 px-2 sm:px-4 text-left">Available Seats</th>
              <th className="py-3 px-2 sm:px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentTrips.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-2 sm:px-4 text-left">
                  {ticket.flightNum}
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  {ticket.arrivalTime}
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">{ticket.price}</td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  {ticket.destination}
                </td>
                <td className="py-3 px-2 sm:px-4 text-left">
                  {ticket.Availableseats}
                </td>
                <td className="py-3 px-2 sm:px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-4 h-4 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
                      onClick={() => handleupdate(ticket.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12h2m4 0h-4m0 0V8m0 4v4M8 4h.01M8 20h.01M4 8h.01M4 16h.01M4 12h.01M12 12v4m0-8v4m4-4H8M4 4h16v16H4V4z"
                        />
                      </svg>
                    </div>
                    <div
                      className="w-4 h-4 transform hover:text-red-500 hover:scale-110 cursor-pointer"
                      onClick={() => handleremove(ticket.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
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
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-blue-900 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-900' : 'bg-blue-900'} text-white rounded`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-blue-900 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>

      </div>

      {/* Modal for editing trip */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
        contentLabel="Edit Trip"
      >
        <h2>Edit Trip</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Flight Number</label>
            <input
              type="text"
              name="flightNum"
              value={editTrip.flightNum || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-xl w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Arrival Time</label>
            <input
              type="text"
              name="arrivalTime"
              value={editTrip.arrivalTime || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-xl w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              value={editTrip.price || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-xl w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Destination</label>
            <input
              type="text"
              name="destination"
              value={editTrip.destination || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-xl w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Available Seats</label>
            <input
              type="text"
              name="Availableseats"
              value={editTrip.Availableseats || ''}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-xl w-full"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={handleModalClose} className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-xl">Cancel</button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-900 text-white rounded-xl">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AllTicketDash;
