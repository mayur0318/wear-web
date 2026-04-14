import React, { useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import api from "../../services/api";
import { toast } from "react-toastify";

export const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    image: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("productName", formData.name);
      data.append("productPrice", formData.price);
      data.append("productDescription", formData.description);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      //  IMAGE FILE
      data.append("image", formData.image);

      await api.post("/product/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully");

      setFormData({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        image: null,
      });
    } catch (err) {
      console.log("error...", err);
      toast.error("Failed to create product");
    }
  };

  return (
    <>
      <Navbar />
      <div className="body-content">
        <div className="container">
          <div className="sign-in-page">
            <h4 className="checkout-subtitle">Add New Product</h4>
            <form
              className="register-form outer-top-xs"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label className="info-title">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control text-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="info-title">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control text-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="info-title">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control text-input"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="info-title">Image URL</label>
                <input
                  type="file"
                  className="form-control text-input"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
