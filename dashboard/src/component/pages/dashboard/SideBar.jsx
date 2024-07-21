import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from 'react-router-dom';

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary clean-up actions, such as clearing user data or tokens
    // For example, if you're using localStorage to store a token:
    localStorage.removeItem('authToken');

    // Redirect the user to the login page
    navigate('/');
  };

  return (
    <>
      <Card className="h-[calc(100vh-0.1rem)] w-max max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 md:max-w-[16rem] lg:max-w-[18rem]">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Dashboard
          </Typography> <br />
          <img src="https://i.pinimg.com/564x/5a/83/19/5a8319142257cb937fbd91a16422e369.jpg" alt="" className="w-[20%] inline mr-2" />  <span>Tasneem Abuarqob</span>
        </div>
        <List>
          <ListItem className="hover:bg-red-200">
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Link to="/MainDashboard" className="text-black hover:text-red-500">Dashboard</Link>
          </ListItem>
          <ListItem className="hover:bg-red-200">
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Link to="/AddTicket" className="text-black hover:text-red-500">Add new Ticket</Link>
          </ListItem>
          <ListItem className="hover:bg-red-200">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Link to="/AllTicketDash" className="text-black hover:text-red-500">Tickets</Link>
          </ListItem>
          <ListItem className="hover:bg-red-200">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Link to="/Profile" className="text-black hover:text-red-500">User Profile</Link>
          </ListItem>
          <ListItem className="hover:bg-red-200">
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <Link to="/MessageAdmin" className="text-black hover:text-red-500">Inbox</Link>
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                color="blue-gray"
                className="rounded-full text-red-500 border-red-500"
              />
            </ListItemSuffix>
          </ListItem>
          <ListItem className="hover:bg-red-200 cursor-pointer" onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-red-500" />
            </ListItemPrefix>
            <span className="text-black hover:text-red-500">Log Out</span>
          </ListItem>
        </List>
      </Card>
    </>
  );
}

export default SideBar;
