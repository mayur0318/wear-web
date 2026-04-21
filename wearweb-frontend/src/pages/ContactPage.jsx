import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { toast } from 'react-toastify';

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app we'd POST to /api/contact here
    toast.success("Thanks! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#f8f9fb] min-h-[calc(100vh-200px)] py-[60px]">
        <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px]">
           <div className="flex flex-col lg:flex-row gap-[40px]">
             
             {/* Left - Contact Form */}
             <div className="flex-1">
               <h1 className="text-[28px] font-[700] text-[#0f172a] mb-[8px]">Get in Touch</h1>
               <p className="text-[15px] text-[#64748b] mb-[32px]">Have a question? We'd love to hear from you.</p>
               
               <div className="bg-white rounded-[12px] border border-solid border-[#e2e5ea] p-[32px] shadow-sm tracking-wide">
                 <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
                   
                   <div>
                     <label className="block text-[13px] font-[600] text-[#0f172a] mb-[6px]">Full Name</label>
                     <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-solid border-[#e2e5ea] rounded-[8px] px-[16px] py-[10px] outline-none hover:border-[#cbd5e1] focus:border-[#1d6fd8] text-[14px]" placeholder="John Doe" />
                   </div>

                   <div>
                     <label className="block text-[13px] font-[600] text-[#0f172a] mb-[6px]">Email Address</label>
                     <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-solid border-[#e2e5ea] rounded-[8px] px-[16px] py-[10px] outline-none hover:border-[#cbd5e1] focus:border-[#1d6fd8] text-[14px]" placeholder="john@example.com" />
                   </div>

                   <div>
                     <label className="block text-[13px] font-[600] text-[#0f172a] mb-[6px]">Subject</label>
                     <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full border border-solid border-[#e2e5ea] rounded-[8px] px-[16px] py-[10px] outline-none hover:border-[#cbd5e1] focus:border-[#1d6fd8] text-[14px]" placeholder="How can we help?" />
                   </div>

                   <div>
                     <label className="block text-[13px] font-[600] text-[#0f172a] mb-[6px]">Message</label>
                     <textarea rows="5" name="message" value={formData.message} onChange={handleChange} required className="w-full border border-solid border-[#e2e5ea] rounded-[8px] px-[16px] py-[10px] outline-none hover:border-[#cbd5e1] focus:border-[#1d6fd8] text-[14px] resize-none" placeholder="Write your message here..."></textarea>
                   </div>

                   <button type="submit" className="w-full bg-[#1d6fd8] hover:bg-[#1e40af] text-white py-[12px] rounded-[7px] font-[600] text-[14px] transition-colors mt-[10px]">
                     Send Message
                   </button>
                 </form>
               </div>
             </div>

             {/* Right - Contact Information Sidebar */}
             <div className="lg:w-[350px]">
                <div className="bg-[#1a1a1a] rounded-[12px] p-[32px] text-white h-full">
                  <h3 className="text-[20px] font-[700] mb-[24px] text-[#FFD700]">Contact Information</h3>
                  
                  <div className="flex items-start gap-[16px] mb-[24px]">
                    <svg className="w-[24px] h-[24px] text-[#1d6fd8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <p className="text-[13px] text-gray-400 mb-[4px]">Email Us</p>
                      <p className="font-[500] text-[15px]">support@wearweb.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[16px] mb-[24px]">
                    <svg className="w-[24px] h-[24px] text-[#1d6fd8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <div>
                      <p className="text-[13px] text-gray-400 mb-[4px]">Call Us</p>
                      <p className="font-[500] text-[15px]">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-[16px]">
                    <svg className="w-[24px] h-[24px] text-[#1d6fd8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <div>
                      <p className="text-[13px] text-gray-400 mb-[4px]">Location</p>
                      <p className="font-[500] text-[15px]">Mumbai, Maharashtra<br/>India</p>
                    </div>
                  </div>

                </div>
             </div>
           </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
