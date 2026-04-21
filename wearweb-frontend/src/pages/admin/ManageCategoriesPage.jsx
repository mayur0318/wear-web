import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';
import api from '../../services/api';

export const ManageCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await api.get('/category/categories');
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        
        try {
            await api.post('/category/category', { categoryName: categoryName.trim() });
            toast.success("Category added successfully");
            setCategoryName('');
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category");
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        
        try {
            await api.delete(`/category/category/${categoryId}`);
            toast.success("Category deleted");
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
                
                <div className="mb-8 border-b border-slate-100 pb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manage Categories</h1>
                    <p className="text-slate-500 font-medium mt-1">Add, view, and remove product categories for your store catalog.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Add Form */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Category
                            </h2>
                            <form onSubmit={handleAddCategory}>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name</label>
                                    <input 
                                        type="text" 
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="e.g. Footwear" 
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-base outline-none transition-all duration-200 shadow-sm"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                                    Save Category
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Data Table */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto w-full p-1">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b-2 border-slate-200">
                                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">ID</th>
                                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Category Name</th>
                                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="py-4 px-6 text-sm text-slate-500 font-mono font-medium tracking-wide">#{cat._id.slice(-6).toUpperCase()}</td>
                                                    <td className="py-4 px-6 text-base text-slate-800 font-bold">{cat.categoryName}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button 
                                                            onClick={() => handleDelete(cat._id)}
                                                            className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors shadow-sm border border-red-100 flex items-center gap-1 ml-auto"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-50/50">
                                                    No categories created yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};
