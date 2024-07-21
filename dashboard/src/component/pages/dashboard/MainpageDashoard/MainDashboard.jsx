import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function MainDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/Users.json');
        if (response.data) {
          const fetchedUsers = Object.keys(response.data).map(key => ({
            id: key,
            ...response.data[key],
            coupon: response.data[key].coupon || {},
            status: response.data[key].status || 'active'
          }));
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const couponData = users.reduce((acc, user) => {
    const couponCode = user.coupon.code || 'No Coupon';
    acc[couponCode] = (acc[couponCode] || 0) + 1;
    return acc;
  }, {});

  const couponLabels = Object.keys(couponData);
  const couponCounts = Object.values(couponData);

  const statusData = users.reduce((acc, user) => {
    const status = user.status || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusLabels = Object.keys(statusData);
  const statusCounts = Object.values(statusData);

  const couponChartData = {
    labels: couponLabels,
    datasets: [
      {
        label: '# of Users with Coupon',
        data: couponCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue color for active users
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: '# of Users by Status',
        data: statusCounts,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)', // Blue color for active users
          'rgba(255, 99, 132, 0.7)', // Red color for deactivated users
        ],
        borderColor: [
          'rgba(54, 162, 235, 6)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div className="relative overflow-x-auto sm:rounded-lg ml-20 mt-10 flex w-[50%] ">
    <div className="chart-container w-1/2 m-20">
      <Bar data={couponChartData} />
    </div>
    <div className="chart-container w-1/2">
      <Pie data={statusChartData} />
    </div>
  </div>
  );
}

export default MainDashboard;
