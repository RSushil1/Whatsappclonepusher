import React, { useState, useEffect, useRef } from 'react';
import { FiVideo } from 'react-icons/fi';
import { FiPhoneCall } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import { UseAuth } from '../context/Auth';
import axios from 'axios';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Pusher from 'pusher-js'; // Import the Pusher library

const Chatroom = (props) => {
    const [messageByMe, setMessageByMe] = useState('');
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [showEmoji, setShowEmoji] = useState(false);
    const chat = props.chatWith;
    const [auth] = UseAuth();
    const chatDivRef = useRef();
    const Host = "https://echoapp.cyclic.cloud"


    // Function to scroll to the bottom of the chat div
    const scrollToBottom = () => {
        chatDivRef.current?.scrollTo(0, chatDivRef.current.scrollHeight);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getMessages = async (chatId) => {
        setLoadingMessages(true);
        try {
            await axios.get(`${Host}/api/auth/messages/${chatId}`)
            .then((res)=> setMessages(res.data.allMessages))
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };
    
    useEffect(() => {
        if (chat && chat.chatId) {
            getMessages(chat.chatId);
        }
    }, [chat]);
    

    const addEmoji = (e) => {
        const sym = e.unified.split("_");
        const codeArray = [];
        sym.forEach((el) => codeArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codeArray);
        setMessageByMe(messageByMe + emoji);
    }


    const handleSend = async (e) => {
        e.preventDefault();
        try {
            if (!messageByMe.trim()) {
                return; // Don't send empty messages
            }
    
            // Send message to server
            await axios.post(`${Host}/api/auth/messages/${chat.chatId}`, {
                sender: auth?.user._id,
                content: messageByMe,
            });
    
            setMessageByMe('');
            scrollToBottom();
            setShowEmoji(false);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            // Send message to Pusher
                await axios.post(`${Host}/messages/${chat.chatId}`, {
                    sender: auth?.user._id,
                    content: messageByMe,
                });
        }
    };
    


    // Initialize Pusher subscription and event listener
    useEffect(() => {

        const pusher = new Pusher('8c00edbe6c29c7691cf8', {
            cluster: 'ap2',
            channelAuthorization: {
                endpoint: `${Host}/pusher/auth`
            },
        });

        const channel = pusher.subscribe(`private-${chat.chatId}`);
        channel.bind('client-receive-message', function (data) {

            // Update messages state with the received message
            setMessages((prevMessages) => [...prevMessages, data]);
            scrollToBottom(); // Scroll to the bottom to show the new message
        });

        return () => {
            pusher.unsubscribe(`private-${chat.chatId}`);
            //   pusher.disconnect();
        };
    }, [chat.chatId]);

    return (
        <>
            {!chat ? (
                <div className=' place-items-center'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-[10vh]">
                        <div className="z-0 relative flex h-32 w-32 translate-x-[127px] translate-y-[95px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        </div>

                        <div className='z-10'><svg className="z-10 mx-auto h-20 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1219.547 1225.016" id="whatsapp"><path fill="#E0E0E0" d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"></path><linearGradient id="a" x1="609.77" x2="609.77" y1="1190.114" y2="21.084" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#20b038"></stop><stop offset="1" stop-color="#60d66a"></stop></linearGradient><path fill="url(#a)" d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z"></path><path fill="#FFF" fill-rule="evenodd" d="M462.273 349.294c-11.234-24.977-23.062-25.477-33.75-25.914-8.742-.375-18.75-.352-28.742-.352-10 0-26.25 3.758-39.992 18.766-13.75 15.008-52.5 51.289-52.5 125.078 0 73.797 53.75 145.102 61.242 155.117 7.5 10 103.758 166.266 256.203 226.383 126.695 49.961 152.477 40.023 179.977 37.523s88.734-36.273 101.234-71.297c12.5-35.016 12.5-65.031 8.75-71.305-3.75-6.25-13.75-10-28.75-17.5s-88.734-43.789-102.484-48.789-23.75-7.5-33.75 7.516c-10 15-38.727 48.773-47.477 58.773-8.75 10.023-17.5 11.273-32.5 3.773-15-7.523-63.305-23.344-120.609-74.438-44.586-39.75-74.688-88.844-83.438-103.859-8.75-15-.938-23.125 6.586-30.602 6.734-6.719 15-17.508 22.5-26.266 7.484-8.758 9.984-15.008 14.984-25.008 5-10.016 2.5-18.773-1.25-26.273s-32.898-81.67-46.234-111.326z" clip-rule="evenodd"></path><path fill="#FFF" d="M1036.898 176.091C923.562 62.677 772.859.185 612.297.114 281.43.114 12.172 269.286 12.039 600.137 12 705.896 39.633 809.13 92.156 900.13L7 1211.067l318.203-83.438c87.672 47.812 186.383 73.008 286.836 73.047h.255.003c330.812 0 600.109-269.219 600.25-600.055.055-160.343-62.328-311.108-175.649-424.53zm-424.601 923.242h-.195c-89.539-.047-177.344-24.086-253.93-69.531l-18.227-10.805-188.828 49.508 50.414-184.039-11.875-18.867c-49.945-79.414-76.312-171.188-76.273-265.422.109-274.992 223.906-498.711 499.102-498.711 133.266.055 258.516 52 352.719 146.266 94.195 94.266 146.031 219.578 145.992 352.852-.118 274.999-223.923 498.749-498.899 498.749z"></path></svg>
                        </div>
                        <p className="mt-10 text-center text-lg font-semibold leading-9 tracking-tight text-gray-900 font-serif">
                            For real time Chat with friends,<br />
                            add their email in contacts and then chat seamlessly,<br />
                            send text, photos,voicecall or vediocall and more!
                        </p>
                    </div>
                </div>
            ) : (
                <div className=' h-screen'>
                    <div className='flex flex-row justify-between text-white font-semibold p-2 bg-blue-900 z-10 h-[10vh]'>
                        <div className='ms-3'>
                            <div className="flex flex-row">
                                <div>
                                    {chat.user ?
                                        (<img className="w-12 h-12 ms-10 md:ms-1 rounded-full" src={`${Host}/api/auth/profile-photo/${chat.user.find(user => user.contactId._id !== auth?.user._id).contactId._id}`} alt="person" />) : (
                                            <svg className="w-12 h-12 ms-10 md:ms-1 rounded-full stroke-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 27" id="group"><g filter="url(#filter0_d)"><path fill="#000553" d="M9.99881 16.5974H4.73687C4.52273 11.5316 8.96815 11.4346 11.2176 12.0194C10.4566 12.8042 10.088 15.3984 9.99881 16.5974Z"></path><path stroke="#000553" stroke-width=".257" d="M9.99881 16.5974H4.73687C4.52273 11.5316 8.96815 11.4346 11.2176 12.0194C10.4566 12.8042 10.088 15.3984 9.99881 16.5974Z"></path></g><circle cx="16.842" cy="4.543" r="4.495" fill="#FF6B51" filter="url(#filter1_d)"></circle><circle cx="9.136" cy="7.753" r="3.211" fill="#FF6B51" filter="url(#filter2_d)"></circle><circle cx="24.738" cy="7.753" r="3.211" fill="#FF6B51" filter="url(#filter3_d)"></circle><g filter="url(#filter4_d)"><path fill="#000553" d="M22.663 18.1729H10.8611C10.8611 16.5793 11.1772 15.6333 11.6334 14.1792C12.7866 10.943 15.1221 10.0081 15.8256 10.0873H18.1444C22.4014 11.2527 22.9306 15.9632 22.663 18.1729Z"></path><path stroke="#000553" stroke-width=".257" d="M22.663 18.1729H10.8611C10.8611 16.5793 11.1772 15.6333 11.6334 14.1792C12.7866 10.943 15.1221 10.0081 15.8256 10.0873H18.1444C22.4014 11.2527 22.9306 15.9632 22.663 18.1729Z"></path></g><g filter="url(#filter5_d)"><path fill="#000553" d="M24.1902 11.7107C23.4483 11.6544 22.4132 12.0908 22.5022 12.1319C23.0769 12.5393 23.6144 15.669 23.7417 17.2744H29.0362C29.0761 16.8463 28.8564 15.6245 28.6765 14.2858C28.5327 13.2149 28.9574 12.1228 29.1877 11.7107C29.7686 10.6713 30.618 8.66162 30.618 7.27569L30.6844 4.13628C30.2061 3.1663 29.8096 3.73213 29.6712 4.13628C29.6602 4.67894 29.5815 6.06654 29.3557 7.27569C29.0733 8.78713 27.8442 10.365 27.0968 11.0294C26.3494 11.6938 25.3312 11.7972 24.1902 11.7107Z"></path><path stroke="#000553" stroke-width=".257" d="M24.1902 11.7107C23.4483 11.6544 22.4132 12.0908 22.5022 12.1319C23.0769 12.5393 23.6144 15.669 23.7417 17.2744H29.0362C29.0761 16.8463 28.8564 15.6245 28.6765 14.2858C28.5327 13.2149 28.9574 12.1228 29.1877 11.7107C29.7686 10.6713 30.618 8.66162 30.618 7.27569L30.6844 4.13628C30.2061 3.1663 29.8096 3.73213 29.6712 4.13628C29.6602 4.67894 29.5815 6.06654 29.3557 7.27569C29.0733 8.78713 27.8442 10.365 27.0968 11.0294C26.3494 11.6938 25.3312 11.7972 24.1902 11.7107Z"></path></g><defs><filter id="filter0_d" width="14.862" height="13.079" x=".601" y="11.647" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter1_d" width="16.99" height="16.99" x="8.347" y=".048" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter2_d" width="14.421" height="14.421" x="1.925" y="4.543" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter3_d" width="14.421" height="14.421" x="17.527" y="4.543" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter4_d" width="20.116" height="16.347" x="6.733" y="9.954" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter5_d" width="16.445" height="21.93" x="18.368" y="3.472" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs></svg>
                                        )

                                    }

                                </div >
                                <div className="ml-3 overflow-hidden">
                                    {chat.user ?
                                        (<p className="text-sm font-medium text-white">{chat.user
                                            .filter(user => user.contactId._id !== auth?.user._id) // Filter out my own id
                                            .map(user => user.contactId.email)
                                            .join(', ')}
                                        </p>) : (
                                            <p className="text-sm font-medium text-white">{chat.group
                                                .filter(user => user.contactId._id !== auth?.user._id) // Filter out my own id
                                                .map(user => user.contactId.email)
                                                .join(', ')}
                                            </p>
                                        )}
                                </div>
                            </div >

                        </div >
                        <div>
                            <button className='ms-5 h-10 w-10'><FiVideo className=' h-6 w-6' /></button>
                            <button className='ms-5 h-10 w-10'><FiPhoneCall className=' h-6 w-6' /></button>
                        </div>
                    </div >
                    <div className='h-[80vh] z-10 p-5 overflow-y-auto align-text-bottom scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-blue-100' ref={chatDivRef}>
                        {loadingMessages ? (
                            // Show spinner while loading
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === auth?.user._id ? 'flex-row-reverse' : 'flex-row'
                                        } items-start mb-3`}
                                >
                                    <div
                                        className={`${message.sender === auth?.user._id ? 'bg-red-300 ml-3' : ' bg-amber-200 mr-3'} ps-3 pt-1 rounded-lg shadow-md max-w-[70%] flex flex-row`}
                                    >
                                        <p className='text-sm break-words font-serif'>{message.content}</p>
                                        <p className='text-[10px] m-1 text-black'>{message.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className='flex flex-row text-white font-semibold p-3 bg-blue-900 z-10 h-[10vh]'>
                        <div className='ms-5 w-[5%] p-2'>
                            <button
                                onClick={() => setShowEmoji(!showEmoji)}
                                className='h-5 w-5'
                            >
                                <BsEmojiSmile className='h-5 w-5' />
                            </button>
                            {showEmoji && <div className=' -translate-y-[30rem]'>
                                <Picker data={data} emojiSize={20} emojiButtonSize={28} maxFrequentRows={0} onEmojiSelect={addEmoji} />
                            </div>}
                        </div>
                        <form className='ms-5 flex flex-row w-[95%]' onSubmit={handleSend}>
                            <input name="messageByMe"
                                value={messageByMe}
                                onChange={(e) => setMessageByMe(e.target.value)}
                                type="text" className=" w-[90%] px-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <button type='submit' className='w-[10%] md:ms-5 ms-1  p-1 flex flex-row rounded-md bg-blue-500'><span className='md:inline-block hidden'>Send</span><AiOutlineSend className='ms-1 h-full' /></button>
                        </form>
                    </div>
                </div >
            )


            }
        </>
    )
}

export default Chatroom
