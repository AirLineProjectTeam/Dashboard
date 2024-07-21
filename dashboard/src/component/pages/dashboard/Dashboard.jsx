import { Link } from 'react-router-dom'; 
import React, {useEffect} from 'react';
import instance from "../../firebase/instance";
import AddTicket from './formDashboard/AddTicket';
import SideBar from './SideBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainDashboard from './MainpageDashoard/MainDashboard';
import MessageAdmin from './messageforadmin/MessageAdmin';
import AllTicketDash from './alltickets/AllTicketsDash';
import Profile from './profiledash/ProfileDash'; 


  

    function Dashboard() {
        

        return(
            <Router>
      <div className="flex bg-gray-100">
        <SideBar />
        <Routes>
          <Route path="/MainDashboard" element={<MainDashboard />} />
          <Route path="/AddTicket" element={<AddTicket />} />
          <Route path="/MessageAdmin" element={<MessageAdmin />} />
          <Route path="/AllTicketDash" element={<AllTicketDash />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
        
      </div>
    </Router>

        );

      }
      
      export default Dashboard;


      