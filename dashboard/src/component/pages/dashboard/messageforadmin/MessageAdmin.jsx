import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

function MessageAdmin() {
  const [Msg, setMsg] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    fetchMsg();
  }, []);

  const fetchMsg = () => {
    console.log("Fetching Msg..");
    axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/messages.json')
      .then(res => {
        console.log("Msgs fetched:", res.data);

        const MsgObject = res.data;
        if (MsgObject) {
          const MsgArray = Object.keys(MsgObject).map(key => ({ id: key, ...res.data[key] }));
          setMsg(MsgArray);
          console.log("Msg array:", MsgArray);
        } else {
          console.log("No Msg found.");
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const addMsg = async () => {
    const newMsg = {
      email: prompt("Enter email"),
      name: prompt("Enter name"),
      message: prompt("Enter message"),
    };

    try {
      console.log('Adding new Msg with data:', newMsg);
      const res = await axios.post('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/messages.json', newMsg);
      console.log("messages added successfully:", res.data);
      fetchMsg();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const userEmail = Msg.find(user => user.id === selectedUser)?.email;

    const templateParams = {
      to: userEmail,
      message: emailMessage,
    };

    emailjs
      .send('service_920k6ej', 'template_xrkks0r', templateParams, '1re8sc7hxYtfnqCax')
      .then(() => {
        console.log('SUCCESS!');
        alert("Congrats, your Email has been sent!");
      }, (error) => {
        console.log('FAILED...', error.text);
      });
  }

  return (
    <>
      <div className='container mx-auto p-4'>
        <div className='overflow-x-auto'>
          <table className='table-auto bg-white w-full'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-4 py-2'>Message</th>
                <th className='px-4 py-2'>Username</th>
                <th className='px-4 py-2'>Email</th>
              </tr>
            </thead>
            <tbody>
              {Msg.map(e => (
                <tr key={e.id}>
                  <td className='border px-4 py-2'>{e.message}</td>
                  <td className='border px-4 py-2'>{e.name}</td>
                  <td className='border px-4 py-2'>{e.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-8'>
          <form ref={form} onSubmit={sendEmail} className='flex flex-col items-center'>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className='bg-gray-100 p-2 mb-2 rounded border border-gray-300'
            >
              <option value="" disabled>Select a user</option>
              {Msg.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="message"
              placeholder='Message'
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className='bg-gray-100 p-2 mb-2 rounded border border-gray-300'
            />
            <input
              type="submit"
              value="Send"
              className='bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-600'
            />
          </form>
        </div>

        <div className='flex justify-center mt-8'>
          <div className='w-48'>
            <button onClick={addMsg} className='bg-green-500 text-white w-full p-2 rounded cursor-pointer hover:bg-green-600'>
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageAdmin;



// import React, { useRef, useEffect, useState } from 'react';
// import axios from 'axios';
// import emailjs from '@emailjs/browser';

// function MessageAdmin() {
//   const [Msg, setMsg] = useState([]);

//   useEffect(() => {
//     fetchMsg();
//   }, []);

//   const fetchMsg = () => {
//     console.log("Fetching Msg..");
//     axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/messages.json')
//       .then(res => {
//         console.log("Msgs fetched:", res.data);

//         const MsgObject = res.data;
//         if (MsgObject) {
//           const MsgArray = Object.keys(MsgObject).map(key => ({ id: key, ...res.data[key] }));
//           setMsg(MsgArray);
//           console.log("Msg array:", MsgArray);
//         } else {
//           console.log("No Msg found.");
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   };

//   const addMsg = async () => {
//     const newMsg = {
//       email: prompt("Enter email"),
//       name: prompt("Enter name"),
//       message: prompt("Enter message"),
//     };

//     try {
//       console.log('Adding new Msg with data:', newMsg);
//       const res = await axios.post('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/messages.json', newMsg);
//       console.log("messages added successfully:", res.data);
//       fetchMsg();
//     } catch (error) {
//       console.error('Error adding book:', error);
//     }
//   };

//   const form = useRef();

//   const sendEmail = (e) => {
//     e.preventDefault();

//     emailjs
//       .sendForm('service_920k6ej', 'template_xrkks0r', form.current, '1re8sc7hxYtfnqCax')
//       .then(() => {
//         console.log('SUCCESS!');
//         alert("Congrats, your Email has been sent!");
//       }, (error) => {
//         console.log('FAILED...', error.text);
//       });
//   }

//   return (
//     <>
//       <div className='container mx-auto p-4'>
//         <div className='overflow-x-auto'>
//           <table className='table-auto bg-white w-full'>
//             <thead className='bg-gray-200'>
//               <tr>
//                 <th className='px-4 py-2'>Message</th>
//                 <th className='px-4 py-2'>Username</th>
//                 <th className='px-4 py-2'>Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Msg.map(e => (
//                 <tr key={e.id}>
//                   <td className='border px-4 py-2'>{e.message}</td>
//                   <td className='border px-4 py-2'>{e.name}</td>
//                   <td className='border px-4 py-2'>{e.email}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className='mt-8'>
//           <form ref={form} onSubmit={sendEmail} className='flex flex-col items-center'>
//             <input
//               type="email"
//               name="to"
//               placeholder='To'
//               className='bg-gray-100 p-2 mb-2 rounded border border-gray-300'
//             />
//             <input
//               type="text"
//               name="message"
//               placeholder='Message'
//               className='bg-gray-100 p-2 mb-2 rounded border border-gray-300'
//             />
//             <input
//               type="submit"
//               value="Send"
//               className='bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-600'
//             />
//           </form>
//         </div>

//         <div className='flex justify-center mt-8'>
//           <div className='w-48'>
//             <button onClick={addMsg} className='bg-green-500 text-white w-full p-2 rounded cursor-pointer hover:bg-green-600'>
//               Add
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default MessageAdmin;

