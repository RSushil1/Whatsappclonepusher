import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios';
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { UseAuth } from '../../context/Auth';

export default function AddContactModal() {
  const [email, setEmail] = useState();
  const [auth, setAuth] = UseAuth();
  let [isOpen, setIsOpen] = useState(false);
  const Host = "http://localhost:8000"


  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Host}/api/auth/contacts`, {
        email
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedContacts = [res.data.contacts];
        setAuth({
          ...auth,
          contacts: updatedContacts
        })
        // localStorage.setItem("whatsapp", JSON.stringify(auth));
        setEmail("")
      }else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("server error");
    }
  };

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="text-[12px]"
        >
          <svg className="h-8 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" id="contacts"><rect width="48" height="48" x="8" y="8" fill="url(#paint0_linear)" rx="8"></rect><g filter="url(#filter0_if)"><rect width="48" height="48" x="8" y="8" fill="#fff" fill-opacity=".08" rx="8"></rect></g><g filter="url(#filter1_if)"><rect width="48" height="48" x="8" y="8" fill="#fff" fill-opacity=".08" rx="8"></rect></g><g filter="url(#filter2_i)"><path fill="#fff" d="M31.1498 35.7434C32.4916 34.8522 33.5107 33.5527 34.0565 32.0372C34.6022 30.5217 34.6455 28.8708 34.1801 27.3287C33.7146 25.7867 32.765 24.4355 31.4719 23.4751C30.1788 22.5147 28.6108 21.9961 27.0001 21.9961C25.3893 21.9961 23.8213 22.5147 22.5282 23.4751C21.2351 24.4355 20.2855 25.7867 19.8201 27.3287C19.3546 28.8708 19.3979 30.5217 19.9437 32.0372C20.4894 33.5527 21.5085 34.8522 22.8503 35.7434C20.563 36.5872 18.5862 38.1061 17.1818 40.0989C17.0764 40.2486 17.0141 40.4245 17.0018 40.6072C16.9895 40.79 17.0276 40.9726 17.1119 41.1352C17.1963 41.2978 17.3237 41.434 17.4802 41.5291C17.6368 41.6243 17.8164 41.6746 17.9996 41.6746L36.0001 41.6739C36.1833 41.6739 36.3629 41.6236 36.5195 41.5284C36.676 41.4333 36.8034 41.297 36.8877 41.1344C36.9721 40.9718 37.0102 40.7892 36.9978 40.6065C36.9855 40.4237 36.9232 40.2479 36.8177 40.0981C35.4134 38.1057 33.4368 36.5871 31.1498 35.7434Z"></path><path fill="#fff" d="M47.0079 40.0982C45.6036 38.1057 43.627 36.5871 41.34 35.7434C42.827 34.7536 43.9118 33.2657 44.3993 31.5473C44.8869 29.8289 44.7451 27.9929 43.9996 26.3697C43.254 24.7465 41.9536 23.4426 40.3324 22.6928C38.7112 21.943 36.8756 21.7964 35.1559 22.2794C34.9998 22.3233 34.8567 22.4046 34.7389 22.5161C34.6212 22.6276 34.5324 22.7661 34.4801 22.9196C34.4278 23.0731 34.4136 23.237 34.4388 23.3973C34.4639 23.5575 34.5277 23.7092 34.6245 23.8392C35.7549 25.3577 36.4048 27.1799 36.4904 29.0711C36.5759 30.9622 36.0933 32.8356 35.1046 34.45C34.9741 34.6629 34.9279 34.917 34.9752 35.1622C35.0225 35.4074 35.1598 35.6261 35.3602 35.7752C35.7394 36.0573 36.1042 36.3583 36.4532 36.677C36.4712 36.6966 36.4894 36.7161 36.5093 36.7345C37.844 37.9684 38.9258 39.4504 39.6942 41.0977C39.7747 41.2701 39.9027 41.4159 40.0632 41.5181C40.2237 41.6203 40.4101 41.6746 40.6003 41.6746L46.1904 41.6739C46.3736 41.6739 46.5532 41.6235 46.7097 41.5284C46.8662 41.4333 46.9936 41.297 47.0779 41.1344C47.1623 40.9718 47.2004 40.7892 47.188 40.6065C47.1757 40.4237 47.1134 40.2479 47.0079 40.0981L47.0079 40.0982Z"></path></g><defs><filter id="filter0_if" width="56" height="56" x="4" y="4" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feMorphology in="SourceAlpha" radius="1" result="effect1_innerShadow"></feMorphology><feOffset dx="4" dy="4"></feOffset><feGaussianBlur stdDeviation="4"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.32 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow"></feBlend><feGaussianBlur result="effect2_foregroundBlur" stdDeviation="2"></feGaussianBlur></filter><filter id="filter1_if" width="56" height="56" x="4" y="4" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feMorphology in="SourceAlpha" radius="1" result="effect1_innerShadow"></feMorphology><feOffset dx="-4" dy="-4"></feOffset><feGaussianBlur stdDeviation="4"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.32 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow"></feBlend><feGaussianBlur result="effect2_foregroundBlur" stdDeviation="2"></feGaussianBlur></filter><filter id="filter2_i" width="31.191" height="20.678" x="15.999" y="20.996" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-1" dy="-1"></feOffset><feGaussianBlur stdDeviation="1"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow"></feBlend></filter><linearGradient id="paint0_linear" x1="8" x2="56" y1="8" y2="56" gradientUnits="userSpaceOnUse"><stop stop-color="#FF00C7"></stop><stop offset="1" stop-color="red"></stop></linearGradient></defs></svg>
          Add Contacts
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Contacts To Chat
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                      E-mail
                    </label>
                    <div className="mt-2 flex flex-row">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="w-[80%] mx-2 px-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        onClick={closeModal}
                        type="submit"
                        className=" w-[20%] flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
