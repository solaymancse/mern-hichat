import React, { useContext, useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar';
import { Logo } from './Logo';
import { UserContext } from './UserContext';
import {uniqBy} from 'lodash';
import axios from 'axios';

export const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { username, id } = useContext(UserContext);
  const divUnderMessages = useRef();


  useEffect(() => {
    connectToWs();
  }, []);


  // re-connect
  function connectToWs(){
    const ws = new WebSocket('ws://localhost:4040');
    setWs(ws);

    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', ()=> connectToWs())
  }
  // show online user
  function showOnlinePeople(peopleArray) {
    const people = {};

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    })

    setOnlinePeople(people);
    console.log(onlinePeople)
  }

  // handleMessage
  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    }else{
      setMessages(prev => ([...prev, {...messageData}]))
    }
  }

  // send message 
  function sendMessage(e) {
    e.preventDefault();

    ws.send(JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
    }));

    setNewMessageText('');
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender:id,
      recipient: selectedUserId,
      _id: Date.now(),
    }]))


  }

  useEffect(()=> {
    const div = divUnderMessages.current;
    if(div){
      div.scrollIntoView({behavior:'smooth',block:'end'})
    }

  },[messages])

  // show offline user
  useEffect(()=> {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
      .filter(p => p._id !== id)
      .filter(p => !Object.keys(onlinePeople).includes(p._id))

      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });

      setOfflinePeople(offlinePeople);
    })
  },[onlinePeople]);

  // fetch both user messages
  useEffect(()=>{
    if(selectedUserId){
      axios.get(`/messages/${selectedUserId}`).then(res => {
        setMessages(res.data);
      });
    }
  },[selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id]

  // delete duplicate msg by using Lodash libaray
  const messagesWithoutDups = uniqBy(messages, '_id');
  return (
    <div className='flex h-screen'>
      <div className="bg-white-100 w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <div key={userId} onClick={() => setSelectedUserId(userId)}
            className={`border-b  border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-50' : ''}`}>
            {userId === selectedUserId && (
              <div className='w-1 h-12 bg-blue-500 rounded-r-md'> </div>
            )}
            <div className='flex gap-2 items-center p-2 pl-4'>
              <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
              <span className='text-purple-800 bold'> {onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex  flex-col bg-blue-100 w-2/3 p-2">
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex h-full justify-center items-center'>
              <span className='font-bold text-xl text-gray-400'>No Conversation</span>
            </div>
          )}

          {!!selectedUserId && (
        <div className='relative h-full'>
              <div className='overflow-y-scroll absolute inset-0'>
              {messagesWithoutDups.map(message => (
                <div key={message._id} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
                  <div className={`text-left inline-block p-2 my-2 rounded-md text-sm ${message.sender === id ? 'bg-blue-500 text-white': 'bg-purple-400 text-white'}`}>
                  {message.text}
                  </div>
                </div>
              ))}
              <div ref={divUnderMessages}></div>
            </div>
        </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder='Type your message here'
              className='bg-white flex-grow border rounded-sm p-2 ' />

            <button className='bg-blue-500  text-white p-2 border rounded-sm' type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>

            </button>
          </form>
        )}

      </div>

    </div>
  )
}
