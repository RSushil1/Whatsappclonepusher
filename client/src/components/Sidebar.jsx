import { UseAuth } from "../context/Auth"
import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { NavLink } from "react-router-dom"
import AddContactModal from './form/AddContactModal';
import ProfileButton from './microComponets/ProfileButton';
import axios from "axios";
import ThreeDotView from "./microComponets/ThreedotView";
import { toast } from "react-toastify";
import Pusher from 'pusher-js'; // Import the Pusher library

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ handleChatWith, viewProfile }) {
    const [auth, setAuth] = UseAuth();
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(true);
    const [calls, setCalls] = useState([]);
    const [chats, setChats] = useState([]);
    const [chatsLoading, setChatsLoading] = useState(true);
    const [isUserOnline, setIsUserOnline] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([{ contactId: { _id: auth?.user?._id, email: auth?.user?.email } }]);
    const Host = "http://localhost:8000"

    useEffect(() => {
        setContactsLoading(true);
        setChatsLoading(true);

        axios.get(`${Host}/api/auth/contacts`)
            .then((res) => {
                setContacts(res.data)
            })
            .catch((error) => {
                console.error("Error fetching contacts", error);
            })
            .finally(() => {
                setContactsLoading(false);
            });

        axios.get(`${Host}/api/auth/chats`)
            .then((res) => {
                setChats(res.data.chats);
            })
            .catch((error) => {
                console.error("Error fetching chats", error);
            })
            .finally(() => {
                setChatsLoading(false);
            });

    }, [auth])

    useEffect(()=>{
        const pusher = new Pusher('8c00edbe6c29c7691cf8', {
            cluster: 'ap2',
            channelAuthorization: {
                endpoint: `${Host}/pusher/auth`
            },
        });

        const channel = pusher.subscribe("user-status");
        channel.bind('status-updated', function (data) {
        if(data.status){
            console.log(data)
            setIsUserOnline((prevUser) => [...prevUser, data.user]);
        }else{
            isUserOnline.slice(data.user)
        }
        });
        
        return () => {
            pusher.unsubscribe("user-status");
            //   pusher.disconnect();
        };
    },[])
    console.log(isUserOnline)

    const handleCheckboxChange = (contactId) => {
        setSelectedContacts((prevSelected) => {
            const alreadyExists = prevSelected.some(
                (contact) => contact.contactId._id === contactId._id
            );

            if (alreadyExists) {
                return prevSelected.filter(
                    (contact) => !(contact.contactId._id === contactId._id)
                );
            } else {
                return [...prevSelected, { contactId }];
            }
        });
    };

    const [showAddToChatButton, setShowAddToChatButton] = useState(false);
    const [showMakeGroupButton, setShowMakeGroupButton] = useState(false);

    useEffect(() => {
        if (selectedContacts.length === 2) {
            setShowAddToChatButton(true);
            setShowMakeGroupButton(false);
        } else if (selectedContacts.length > 2) {
            setShowAddToChatButton(false);
            setShowMakeGroupButton(true);
        } else {
            setShowAddToChatButton(false);
            setShowMakeGroupButton(false);
        }
    }, [selectedContacts]);


    const openChatWith = (chat) => {
        const dataToSend = chat;
        handleChatWith(dataToSend); // Call the function passed as prop with the data
    };
    const openProfile = (data) => {
        viewProfile(data);
    };

    const handleAddToChat = async () => {
        // Create a new chat object with selected contacts
        const withUsers = selectedContacts;

        const res = await axios.post(`${Host}/api/auth/chats`, withUsers)
        if (res.data.success) {
            toast.success(res.data.message);
            setAuth({
                ...auth,
                user: {
                    ...auth.user,
                    chats: res.data.savedChat
                }
            });
            setSelectedContacts([{ contactId: { _id: auth?.user?._id, email: auth?.user?.email } }]);
        } else {
            toast.error(res.data.message);
        }
    };

    const handleMakeGroup = async () => {
        // Create a new chat object with selected contacts
        const withUsers = selectedContacts;

        // Update the chats state with the new chat
        setChats((prevChats) => [...prevChats, withUsers]);

        const res = await axios.post(`${Host}/api/auth/chats`, withUsers)
        if (res.data.success) {
            toast.success(res.data.message);
            setAuth({
                ...auth,
                user: {
                    ...auth.user,
                    chats: res.data.savedChat
                }
            });
            setSelectedContacts([{ contactId: { _id: auth?.user?._id, email: auth?.user?.email } }]);
        } else {
            toast.error(res.data.message);
        }
    };

    return (
        <div className=" h-screen">
            <div className="w-full h-[90vh] max-w-md px-2 py-1 sm:px-0 overflow-y-auto relative scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-100">
                <div className="fixed w-full translate-y-[80vh] z-20">{showAddToChatButton && (
                    <button className="text-white bg-blue-600 rounded-md shadow-xl p-2 ms-auto w-auto" onClick={handleAddToChat}>Add to Chat</button>
                )}
                    {showMakeGroupButton && (
                        <button className="text-white bg-green-600 rounded-md shadow-xl p-2" onClick={handleMakeGroup}>Make Group with {selectedContacts.length - 1}</button>
                    )}</div>
                <Tab.Group>
                    <Tab.List className=" flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab
                            key="chats"
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            Chats
                        </Tab>
                        <Tab
                            key="contacts"
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            Contacts
                        </Tab>
                        <Tab
                            key="calls"
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            Calls
                        </Tab>

                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel
                            key="chats"
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                            {chatsLoading ? (
                                // Show spinner while loading
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <ul>
                                    {chats.map((chat) => (
                                        <li
                                            key={chat.chatId}
                                            className="relative rounded-md p-3 hover:bg-gray-300"
                                        >
                                            <div className=" flex flex-row">
                                                <div className="flex flex-row">
                                                    <div className="w-12 h-12 relative">
                                                        {chat.user ? (
                                                            <div className="relative inline-block">
                                                                <img
                                                                    className={`w-12 h-12 rounded-full`}
                                                                    src={`${Host}/api/auth/profile-photo/${chat.user.find(user => user.contactId._id !== auth?.user._id).contactId._id}`}
                                                                    alt="person"
                                                                />
                                                                {isUserOnline && (
                                                                    <span class="absolute -top-1 -right-1">
                                                                        <span class="animate-ping inline-block h-3 w-3 rounded-full bg-green-400 opacity-75 translate-x-5"></span>
                                                                        <span class="relative inline-block rounded-full h-3 w-3 bg-green-500"></span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (

                                                            <svg className="w-12 h-12 rounded-full stroke-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 27" id="group"><g filter="url(#filter0_d)"><path fill="#000553" d="M9.99881 16.5974H4.73687C4.52273 11.5316 8.96815 11.4346 11.2176 12.0194C10.4566 12.8042 10.088 15.3984 9.99881 16.5974Z"></path><path stroke="#000553" stroke-width=".257" d="M9.99881 16.5974H4.73687C4.52273 11.5316 8.96815 11.4346 11.2176 12.0194C10.4566 12.8042 10.088 15.3984 9.99881 16.5974Z"></path></g><circle cx="16.842" cy="4.543" r="4.495" fill="#FF6B51" filter="url(#filter1_d)"></circle><circle cx="9.136" cy="7.753" r="3.211" fill="#FF6B51" filter="url(#filter2_d)"></circle><circle cx="24.738" cy="7.753" r="3.211" fill="#FF6B51" filter="url(#filter3_d)"></circle><g filter="url(#filter4_d)"><path fill="#000553" d="M22.663 18.1729H10.8611C10.8611 16.5793 11.1772 15.6333 11.6334 14.1792C12.7866 10.943 15.1221 10.0081 15.8256 10.0873H18.1444C22.4014 11.2527 22.9306 15.9632 22.663 18.1729Z"></path><path stroke="#000553" stroke-width=".257" d="M22.663 18.1729H10.8611C10.8611 16.5793 11.1772 15.6333 11.6334 14.1792C12.7866 10.943 15.1221 10.0081 15.8256 10.0873H18.1444C22.4014 11.2527 22.9306 15.9632 22.663 18.1729Z"></path></g><g filter="url(#filter5_d)"><path fill="#000553" d="M24.1902 11.7107C23.4483 11.6544 22.4132 12.0908 22.5022 12.1319C23.0769 12.5393 23.6144 15.669 23.7417 17.2744H29.0362C29.0761 16.8463 28.8564 15.6245 28.6765 14.2858C28.5327 13.2149 28.9574 12.1228 29.1877 11.7107C29.7686 10.6713 30.618 8.66162 30.618 7.27569L30.6844 4.13628C30.2061 3.1663 29.8096 3.73213 29.6712 4.13628C29.6602 4.67894 29.5815 6.06654 29.3557 7.27569C29.0733 8.78713 27.8442 10.365 27.0968 11.0294C26.3494 11.6938 25.3312 11.7972 24.1902 11.7107Z"></path><path stroke="#000553" stroke-width=".257" d="M24.1902 11.7107C23.4483 11.6544 22.4132 12.0908 22.5022 12.1319C23.0769 12.5393 23.6144 15.669 23.7417 17.2744H29.0362C29.0761 16.8463 28.8564 15.6245 28.6765 14.2858C28.5327 13.2149 28.9574 12.1228 29.1877 11.7107C29.7686 10.6713 30.618 8.66162 30.618 7.27569L30.6844 4.13628C30.2061 3.1663 29.8096 3.73213 29.6712 4.13628C29.6602 4.67894 29.5815 6.06654 29.3557 7.27569C29.0733 8.78713 27.8442 10.365 27.0968 11.0294C26.3494 11.6938 25.3312 11.7972 24.1902 11.7107Z"></path></g><defs><filter id="filter0_d" width="14.862" height="13.079" x=".601" y="11.647" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter1_d" width="16.99" height="16.99" x="8.347" y=".048" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter2_d" width="14.421" height="14.421" x="1.925" y="4.543" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter3_d" width="14.421" height="14.421" x="17.527" y="4.543" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter4_d" width="20.116" height="16.347" x="6.733" y="9.954" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter><filter id="filter5_d" width="16.445" height="21.93" x="18.368" y="3.472" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs></svg>

                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ms-2">
                                                    {chat.user && (
                                                        <h3 className="text-sm font-medium leading-5">
                                                            {chat.user
                                                                .filter(user => user.contactId._id !== auth?.user._id) // Filter out my own id
                                                                .map(user => (
                                                                    contacts.find(contact => contact._id === user.contactId._id)?.name || 'Unknown'
                                                                ))
                                                                .join(', ')}
                                                        </h3>
                                                    )}
                                                    {chat.group && (
                                                        <h3 className="text-sm font-medium leading-5">
                                                            {chat.group.map(groupObj => (
                                                                groupObj.contactId._id === auth?.user._id
                                                                    ? "Me"
                                                                    : contacts.find(contact => contact._id === groupObj.contactId._id)?.name || "Unknown"
                                                            )).join(', ')}
                                                        </h3>
                                                    )}



                                                    <ul className="mt-1 flex flex-row text-xs font-normal leading-4 text-gray-500">
                                                        <li className="flex-grow">
                                                            {chat.user && (
                                                                <p className="text-xm leading-3">
                                                                    {chat.user
                                                                        .filter(user => user.contactId._id !== auth?.user._id) // Filter out my own id
                                                                        .map(user => user.contactId.email)
                                                                        .join(', ')}
                                                                </p>
                                                            )}

                                                            {chat.group && (
                                                                <p className="text-xm leading-3">
                                                                    {chat.group
                                                                        .filter(user => user.contactId._id !== auth?.user._id) // Filter out my own id
                                                                        .map(user => user.contactId.email)
                                                                        .join(', ')}
                                                                </p>
                                                            )}
                                                        </li>
                                                        <li className=" text-right ms-3">last seen </li>
                                                    </ul>
                                                </div>

                                                <NavLink
                                                    onClick={() => openChatWith(chat)}
                                                    className={classNames(
                                                        'absolute inset-0 rounded-md',
                                                        'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                                    )}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>)}
                        </Tab.Panel>
                        <Tab.Panel
                            key="contacts"
                            className={classNames(
                                'rounded-xl bg-white p-3 mb-20 ',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                            {contactsLoading ? (
                                // Show spinner while loading
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <ul className="relative">
                                    {contacts.map((contact) => (
                                        <div className="flex flex-row">
                                            <li
                                                key={contact._id}
                                                className="relative rounded-md p-3 hover:bg-gray-300 w-[90%]"
                                                onClick={() => handleCheckboxChange({ _id: contact._id, email: contact.email })}
                                            >
                                                <div className=" flex flex-row">
                                                    <div className="w-[25%] h-12">
                                                        <img className="w-12 h-12 rounded-full" src={`${Host}/api/auth/profile-photo/${contact._id}`} alt="person" />
                                                    </div>
                                                    <div className="ms-2 w-[55%]">
                                                        <h3 className="text-sm font-medium leading-5">
                                                            {contact.name}
                                                        </h3>

                                                        <ul className="mt-1 flex text-xs font-normal leading-4 text-gray-500 justify-between">
                                                            <li>{contact.email}</li>

                                                        </ul>
                                                    </div>
                                                    <div className="ms-2 w-[10%]">
                                                        <input
                                                            id={`addToChat-${contact._id}`}
                                                            key={`addToChat-${contact._id}`}
                                                            name={`addToChat-${contact._id}`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                            checked={selectedContacts.some((selectedContact) => selectedContact.contactId._id === contact._id)}
                                                            onChange={() => handleCheckboxChange({ _id: contact._id, email: contact.email })}
                                                        />

                                                    </div>
                                                    <NavLink

                                                        className={classNames(
                                                            'absolute inset-0 rounded-md',
                                                            'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                                        )}
                                                    />
                                                </div>
                                            </li>
                                            <div className="w-[10%] z-10">
                                                <ThreeDotView key={contact._id} id={contact._id} openProfile={openProfile} />
                                            </div>
                                        </div>
                                    ))}
                                </ul>)}
                        </Tab.Panel>
                        <Tab.Panel
                            key="calls"
                            className={classNames(
                                'rounded-xl bg-white p-3',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                            <ul>
                                {calls.map((call) => (
                                    <li
                                        key={call._id}
                                        className="relative rounded-md p-3 hover:bg-gray-300"
                                    >
                                        <div className=" flex flex-row">
                                            <div className="w-12 h-12">
                                                <img className=" rounded-full" src={call.photo} alt="person" />
                                            </div>
                                            <div className="ms-2">
                                                <h3 className="text-sm font-medium leading-5">
                                                    {call.name}
                                                </h3>

                                                <ul className="mt-1 flex text-xs font-normal leading-4 text-gray-500 justify-between">
                                                    <li>{call.email}</li>
                                                    <li className=" justify-between ms-3">last seen </li>
                                                </ul>
                                            </div>

                                            <NavLink
                                                onClick={() => openChatWith(call)}
                                                className={classNames(
                                                    'absolute inset-0 rounded-md',
                                                    'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                                                )}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className='flex flex-row justify-between text-white font-semibold p-1 bg-blue-900 z-10 h-[10vh]'>
                <ProfileButton name={auth?.user?.name} email={auth?.user?.email} id={auth?.user?._id} openProfile={openProfile} />
                <div>
                    <AddContactModal />
                </div>
            </div>
        </div>
    )
}


