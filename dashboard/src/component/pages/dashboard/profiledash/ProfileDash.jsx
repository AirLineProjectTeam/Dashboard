import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Profile() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3; // Number of users to display per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://airline-tickets-46241-default-rtdb.firebaseio.com/Users.json"
        );
        if (response.data) {
          const fetchedUsers = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
            coupon: response.data[key].coupon || {}, 
            status: response.data[key].status || 'active'

          }));
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEditCoupon = (userId) => {
    setEditingUserId(userId);
  };

  const handleSaveCoupon = async () => {
    try {
      const updatedCoupon = { code: newCouponCode, discount: newDiscount };
      await axios.patch(
        `https://airline-tickets-46241-default-rtdb.firebaseio.com/Users/${editingUserId}/coupon.json`,
        updatedCoupon
      );
      setUsers(
        users.map((user) =>
          user.id === editingUserId ? { ...user, coupon: updatedCoupon } : user
        )
      );
      setEditingUserId(null);
      setNewCouponCode("");
      setNewDiscount("");
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const handleDeactivateAccount = async (userId) => {
    try {
      await axios.patch(
        `https://airline-tickets-46241-default-rtdb.firebaseio.com/Users/${userId}.json`,
        { status: "deactivated" }
      );
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "deactivated" } : user
        )
      );
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const activeUsers = users.filter((user) => user.status === "active").length;
  const deactivatedUsers = users.filter(
    (user) => user.status === "deactivated"
  ).length;

  const data = {
    labels: ["Active Users", "Deactivated Users"],
    datasets: [
      {
        label: "# of Users",
        data: [activeUsers, deactivatedUsers],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  // Calculate current users to display based on pagination

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="relative overflow-x-auto sm:rounded-lg ml-20 w-[70%] mt-10 flex flex-wrap">
      <div className="w-full sm:w-1/2 pr-4">
        <p className="text-1xl font-semibold text-gray-700">
          Number of Active users on Air Travel website: ({users.length})
        </p>
        <br />
        <br />
        <p className="text-sm font-semibold text-gray-700">
          Manage and view details of users, including their names, positions, and online status. Easily edit user profiles as needed
        </p>
        <br />
        <p className="text-1xl font-semibold text-gray-500">
          Activate user accounts to enable access and functionality:
        </p>
        <br />
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Coupon Code
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${user.status === 'deactivated' ? 'opacity-50' : ''}`}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input id={`checkbox-table-search-${user.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor={`checkbox-table-search-${user.id}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <img className="w-10 h-10 rounded-full" src={user.photo} alt="User image" />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{user.firstName}</div>
                    <div className="font-normal text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="input input-bordered"
                    />
                  ) : (
                    user.coupon.code || 'No coupon'
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      className="input input-bordered"
                    />
                  ) : (
                    user.coupon.discount || 'No discount'
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                    {user.status === 'active' ? 'Online' : 'Deactivated'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingUserId === user.id ? (
                    <button onClick={handleSaveCoupon} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleEditCoupon(user.id)} className="font-medium text-blue-900 dark:text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDeactivateAccount(user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline ml-2">Deactivate</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
      <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
        <div className="chart-container">
          <Bar data={data} options={options} />

        </div>
      </div>
    </div>
  );
}

export default Profile;
