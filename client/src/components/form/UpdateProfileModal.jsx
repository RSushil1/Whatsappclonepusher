import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'
import axios from 'axios';
import { UseAuth } from '../../context/Auth';

export default function UpdateProfileModal() {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [auth, setAuth] = UseAuth();
    let [isOpen, setIsOpen] = useState(false);
    const Host = "http://localhost:8000"

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    // form function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            formData.append("password", password);
            formData.append("photo", photo);
            formData.append("coverPhoto", coverPhoto);
            const res = await axios.put(`${Host}/api/auth/profile`, formData);

            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.updatedUser,
                  });
                  localStorage.setItem("whatsapp", JSON.stringify({
                    ...auth,
                    user: res.data.updatedUser,
                  }));
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Something Went Wrong!');
        }
    };
 


    return (
        <>
            <div className="inset-0 flex items-center justify-center">
               <button onClick={openModal}><svg className='w-10 h-12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" id="edit"><path fill="#A35BB4" d="M88 2H12C6.477 2 2 6.477 2 12v76c0 5.523 4.477 10 10 10h76c5.523 0 10-4.477 10-10V12c0-5.523-4.477-10-10-10z"></path><path fill="#76418F" d="M47.891 34.405c-.29-.29-.74-.37-1.12-.2l-11.7 5.24c-.28.13-.48.37-.56.66l-1.86 7.18-4.97-4.97a.987.987 0 0 0-.68-.27c-.55 0-1 .45-1 1l.01 28.16v1.29L51.508 98H88c5.523 0 10-4.477 10-10v-3.476l-32.359-32.36-17.75-17.76zM55.961 26.335c-.39-.39-1.03-.39-1.42 0l-6.08 6.08L98 81.954v-13.57l-24.289-24.29-17.75-17.76z"></path><path fill="#FFF" d="m73.709 44.096-17.75-17.76c-.39-.39-1.03-.39-1.42 0l-6.079 6.079c.31.146.6.334.843.577l17.75 17.76c.247.24.44.521.585.825l6.07-6.07a.996.996 0 0 0 0-1.41zM47.889 34.406c-.29-.29-.74-.37-1.12-.2l-11.7 5.24c-.28.13-.48.37-.56.66l-6.5 25.1-.01-22.16c0-.55-.45-1-1-1s-1 .45-1 1l.01 28.16v1.29h.11l1.89-1.89 12.17-12.16c-.64-.92-.99-2.01-.99-3.16a5.5 5.5 0 0 1 1.64-3.93 5.513 5.513 0 0 1 3.93-1.63c1.49 0 2.88.58 3.94 1.63a5.53 5.53 0 0 1 1.63 3.93c0 1.49-.58 2.89-1.63 3.94a5.554 5.554 0 0 1-3.94 1.63c-1.15 0-2.24-.35-3.16-1l-13.76 13.75-.27.27-.08.08 32.45-8.42c.29-.07.54-.28.66-.56l5.25-11.7c.17-.38.09-.82-.21-1.11l-17.75-17.76z"></path></svg></button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-30 w-5" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto scrollbar-none">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className=" h-[90vh] w-[70vw] transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                       Update Profile 
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <form onSubmit={handleUpdate}>
                                            <div className="space-y-12">
                                                <div className="border-b border-gray-900/10 pb-12">
                                                    <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                                                        <div className="sm:col-span-1">
                                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Username
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                id="name"
                                                                autoComplete="name"
                                                                className="border rounded-md bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                placeholder="janesmith"
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Password
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                id="password"
                                                                autoComplete="password"
                                                                className="border rounded-md bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                placeholder="janesmith"
                                                            />
                                                        </div>


                                                        <div className="col-span-full">
                                                            <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Bio
                                                            </label>
                                                            <div className="mt-2">
                                                                <textarea
                                                                    id="bio"
                                                                    name="bio"
                                                                    value={bio}
                                                                    onChange={(e) => setBio(e.target.value)}
                                                                    rows={3}
                                                                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    defaultValue={''}
                                                                />
                                                            </div>
                                                            <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                                                        </div>

                                                        <div className="col-span-full">
                                                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Photo
                                                            </label>
                                                            <div className="mt-2 flex items-center gap-x-3">
                                                                <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                                                {photo ? photo.name : "Upload Photo"}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => setPhoto(e.target.files[0])}
                                                                    name="photo"

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-full">
                                                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Cover photo
                                                            </label>
                                                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                                                <div className="text-center">
                                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                                        <label
                                                                            htmlFor="coverPhoto-upload"
                                                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                        >
                                                                            <span>{coverPhoto ? coverPhoto.name : "Upload cover photo"}</span>

                                                                            <input id="coverPhoto-upload"
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => setCoverPhoto(e.target.files[0])}
                                                                                name="coverPhoto"
                                                                                className="sr-only" />
                                                                        </label>
                                                                        <p className="pl-1">or drag and drop</p>
                                                                    </div>
                                                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG,JPEG up to 5MB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <button
                                                    onClick={closeModal}
                                                    type="submit"
                                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
