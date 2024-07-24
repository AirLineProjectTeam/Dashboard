 
import React, { useRef,useEffect, useState } from 'react';
import axios from 'axios';
 
//  import emailjs from  "emailjs-com";

 import emailjs from '@emailjs/browser';;

function MessageAdmin(){
  const [Msg, setMsg] = useState([]);

  useEffect(() => {
    fetchMsg();
  }, []);

  const fetchMsg = () => {
    console.log("Fetching  Msg..");
    axios.get('https://airline-tickets-46241-default-rtdb.firebaseio.com/trips/messages.json')
      .then(res => {
        console.log("Msgs fetched:", res.data);

        const MsgObject = res.data;
        if (MsgObject) {
        //   const MsgArray = Object.entries(MsgObject).map(([id, Msg]) => ({ id, ...Msg })); // Convert object to array with id
          const MsgArray = Object.keys(MsgObject).map(key =>({id: key ,... res.data[key]})); // Convert object to array with id
          setMsg(MsgArray); // Update state
    

          console.log("Msg array:", MsgObject);
        } else {
          console.log("No Msg found.");
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Handle error
      });
  };
  const addMsg = async () => {
    const newMsg = {
      email: prompt("Enter email"),
     name: prompt("Enter name"),
     message: prompt("Enter message"),
     };

    // if (!newMsg.email || !newMsg.text || !newMsg.message) return;

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
  
      emailjs
        .sendForm('service_920k6ej', 'template_xrkks0r', form.current, {
          publicKey: '1re8sc7hxYtfnqCax',
     
        })
        .then(
          () => {

            
            console.log('SUCCESS!');
            alert("Congrats, your Email has been sent !")
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    }
    
    return(

        

      <>
      <div className=''>
      
      <div className='ml-10 mt-10 w-[100%]' >
      <table class="table-auto bg-white className=' ml-32 mr-32'">
          <thead className='bg-gray-200  '>
            <tr>
              <th class="px-4 py-2  ">Message</th>
              <th class="px-4 py-2 ">Username</th>
              <th class="px-4 py-2  ">Email</th>
            </tr>
          </thead>
          <tbody>
      {
        Msg
   
        .map(e => (

            <tr>
              <td class="border px-4 py-2 border-none">{e.message}</td>
              <td class="border px-4 py-2 border-none">{e.name}</td>
              <td class="border px-4 py-2 border-none">{e.email}</td>
            </tr>
           
        ))} </tbody></table>
      </div>

     
    <div >
               
            <form ref={form} onSubmit={sendEmail}  className='mt-8 ml-44  ' >
  
  {/* <input type="text" name="from"   placeholder='from'/>  */}
  
        <input type="email"  name="to" placeholder='to' className='bg-gray-100' />   <input className='bg-gray-100'  type="text" name="message" />  <input type="submit" value="Send"  className='bg-gray-100 pl-4 pr-4' />
</form> </div> <button onClick={addMsg} className='ml-96 mt-36' >Add </button>
</div>
    </>
    )

}
export default MessageAdmin ;