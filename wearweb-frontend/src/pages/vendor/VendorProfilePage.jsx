import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchVendorProfile, updateVendorProfile } from "../../services/api";
import { VendorLayout } from "../../components/vendor/VendorLayout";
import { toast } from "react-toastify";

export const VendorProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchVendorProfile().then(res => {
      const vendorInfo = res.data.data;
      if (vendorInfo) {
        setValue("shopName", vendorInfo.shopName || "");
        setValue("address", vendorInfo.address || "");
        setValue("name", vendorInfo.userId?.name || "");
        setValue("phoneNo", vendorInfo.userId?.phoneNo || "");
      }
      setLoading(false);
    }).catch(err => {
      toast.error("Failed to load profile");
      setLoading(false);
    });
  }, [setValue]);

  const submitHandler = async (data) => {
    setSaving(true);
    try {
      await updateVendorProfile(data);
      toast.success("Profile updated successfully");
    } catch(err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-[800px] mx-auto">
         <div className="mb-[20px]">
            <h1 className="text-[20px] font-bold text-[#0f172a]">My Store Profile</h1>
            <p className="text-[13px] text-[#64748b] mt-[3px]">Manage your shop's identity and personal details</p>
         </div>

         {loading ? (
             <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1d4ed8]"></div></div>
         ) : (
            <div className="bg-[#ffffff] rounded-[10px] border border-solid border-[#e2e5ea] overflow-hidden">
               
               <div className="p-[20px] border-b border-solid border-[#e2e5ea] bg-[#f8f9fb] flex items-center gap-[16px]">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center font-bold text-[24px]">
                     S
                  </div>
                  <div>
                     <h2 className="text-[15px] font-bold text-[#0f172a]">Store Settings</h2>
                     <p className="text-[13px] text-[#64748b] font-medium mt-[2px]">Keep your contact and address up to date for customers</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit(submitHandler)} className="p-[24px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                     <div className="md:col-span-2">
                       <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Shop Name</label>
                       <input type="text" {...register("shopName", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="Your brand name" />
                     </div>

                     <div>
                       <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Owner Name</label>
                       <input type="text" {...register("name", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="Full name" />
                     </div>

                     <div>
                       <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Phone Number</label>
                       <input type="text" {...register("phoneNo", { required: true })} className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" placeholder="+91 9876543210" />
                     </div>

                     <div className="md:col-span-2">
                       <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">Business Address</label>
                       <textarea {...register("address", { required: true })} rows="3" className="w-full p-[9px_12px] border border-solid border-[#e2e5ea] rounded-[7px] text-[14px] text-[#0f172a] focus:outline-none focus:border-[#3b82f6] shadow-[0_0_0_3px_rgba(59,130,246,0)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all resize-y" placeholder="Full street address..."></textarea>
                     </div>
                  </div>

                  <div className="pt-[20px] mt-[20px] border-t border-solid border-[#e2e5ea] flex justify-end">
                     <button type="submit" disabled={saving} className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-none rounded-[7px] px-[24px] py-[8px] text-[13px] font-medium cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-[8px]">
                       {saving && <div className="w-[14px] h-[14px] rounded-full border-2 border-solid border-[#ffffff] border-t-transparent animate-spin"></div>}
                       Save Changes
                     </button>
                  </div>
               </form>
            </div>
         )}
      </div>
    </VendorLayout>
  );
};
