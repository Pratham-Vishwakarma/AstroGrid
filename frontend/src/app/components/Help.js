"use client";
import React, { useState, useEffect } from "react";

function Help({setBack}) {
    const [formData, setFormData] = useState({
        name: "",
        useremail: "",
        message: "",
        rating: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
  
    useEffect(() => {
      let timeout;
      if (responseMessage) {
        timeout = setTimeout(() => setResponseMessage(""), 3000); // Hide after 3 seconds
      }
      return () => clearTimeout(timeout);
    }, [responseMessage]);
  
    const setChange = (event) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        setIsDisabled(true);
        const response = await fetch("../api/help", {
            method: "POST",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        setResponseMessage(data?.message || "Form submitted successfully!");
      } catch (error) {
        setResponseMessage(error.message || "Something went wrong!");
      } finally {
        setIsDisabled(false);
      }
    };  

  return (
    <div className='z-30 absolute h-full w-full bg-gray-950 bg-opacity-80 flex items-center justify-center'>
        <div className='bg-gray-800 p-8 rounded-xl shadow-lg max-w-4xl w-full'>
            <div onClick={setBack} className='cursor-pointer absolute p-2 bg-gray-700 rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-200 mb-4 text-center'>Help & Feedback</h2>
            <p className='text-gray-400 mb-6 text-center'>
                We’d love to hear from you! Fill out the form below to get help or share your feedback.
            </p>

            <form className='space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6' onSubmit={handleSubmit}>
                {/* Left Column: User Info */}
                <div className='space-y-4'>
                    {/* Name Field */}
                    <div>
                        <label htmlFor='name' className='block text-sm font-semibold text-gray-300 mb-2'>
                            Your Name
                        </label>
                        <input
                            type='text'
                            name='name'
                            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            placeholder='Enter your name'                
                            value={formData.name}
                            onChange={setChange}
                            required
                        />
                    </div>
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="useremail" className='block text-sm font-semibold text-gray-300 mb-2'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            name="useremail"
                            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            placeholder='Enter your email'
                            value={formData.useremail}
                            onChange={setChange}
                            required
                        />
                    </div>                    
                </div>

                {/* Right Column: Message and Rating */}
                <div className='space-y-4'>
                    {/* Message Field */}
                    <div>
                        <label htmlFor='message' className='block text-sm font-semibold text-gray-300 mb-2'>
                            Message
                        </label>
                        <textarea
                            name='message'
                            rows='6'
                            className='w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            placeholder='Please describe your issue or feedback here...'
                            value={formData.message}
                            onChange={setChange}
                            required
                        ></textarea>
                    </div>
                    
                    {/* Rating Field */}
                    <div>
                        <label htmlFor='rating' className='block text-sm font-semibold text-gray-300 mb-2'>
                            How satisfied are you with our service?
                        </label>
                        <div className='flex space-x-4'>
                            <label className='text-gray-400'>
                                <input type='radio' name='rating' value='1' className='mr-2' onChange={setChange} /> 1
                            </label>
                            <label className='text-gray-400'>
                                <input type='radio' name='rating' value='2' className='mr-2' onChange={setChange} /> 2
                            </label>
                            <label className='text-gray-400'>
                                <input type='radio' name='rating' value='3' className='mr-2' onChange={setChange} /> 3
                            </label>
                            <label className='text-gray-400'>
                                <input type='radio' name='rating' value='4' className='mr-2' onChange={setChange} /> 4
                            </label>
                            <label className='text-gray-400'>
                                <input type='radio' name='rating' value='5' className='mr-2' onChange={setChange} /> 5
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className='col-span-2 flex justify-center'>
                    {!isDisabled && (
                        <input
                            className="bg-blue-500 text-white w-full rounded-xl p-2 hover:bg-gray-300 hover:text-blue-500 hover:border-black hover:font-bold font-bold drop-shadow-2xl"
                            type="submit"
                            value="Send Email"
                            disabled={isDisabled}
                        />
                        )}
                        {isDisabled && (
                        <div role="status" className="flex justify-center">
                            <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM50 9C26.8046 9 9 26.8046 9 50C9 73.1954 26.8046 91 50 91C73.1954 91 91 73.1954 91 50C91 26.8046 73.1954 9 50 9Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5531C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.723 75.2124 7.41289C69.5422 4.10274 63.2754 1.94025 56.7688 1.05125C51.7669 0.367373 46.6976 0.446778 41.7345 1.27834C39.2603 1.69453 37.8331 4.19808 38.4702 6.62354C39.1074 9.049 41.6012 10.4718 44.0979 10.1077C47.8753 9.55664 51.7139 9.55664 55.4913 10.1077C60.9023 10.9091 66.0891 12.9855 70.7896 16.1991C75.4902 19.4126 79.6341 23.7131 82.9424 28.841C85.4553 32.641 87.3929 36.847 88.6919 41.3176C89.4267 43.8036 91.5422 45.2421 93.9676 44.6049Z"
                                fill="currentFill"
                            />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}

                    {/* Full-Screen Alert */}
                    {responseMessage && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
                        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center w-[90%]">
                            <p>{responseMessage}</p>
                            <button
                            onClick={() => setResponseMessage("")}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            >
                            Close
                            </button>
                        </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    </div>
  )
}

export default Help