import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, addToCart } from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { toast } from "react-toastify";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProductById(id);
        setProduct(response.data.product || response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        toast.error("Please login to add to cart");
        return;
      }
      await addToCart({ customerId, productId: product._id, quantity: qty });
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <div><Navbar/><div className="text-center p-5">Loading...</div><Footer/></div>;
  if (!product) return <div><Navbar/><div className="text-center p-5">Product not found</div><Footer/></div>;

  return (
    <>
      <Navbar />
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner">
            <ul className="list-inline list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li className="active">{product.name}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="body-content outer-top-xs">
        <div className="container">
          <div className="row single-product">
            <div className="detail-block">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 gallery-holder">
                  <div className="product-item-holder size-big single-product-gallery small-gallery">
                    <img className="img-responsive" src={product.image || "/assets/images/products/p1.jpg"} alt={product.name} />
                  </div>
                </div>

                <div className="col-sm-12 col-md-8 col-lg-8 product-info-block">
                  <div className="product-info">
                    <h1 className="name">{product.name}</h1>
                    <div className="rating-reviews m-t-20">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="rating rateit-small"></div>
                        </div>
                      </div>
                    </div>
                    <div className="stock-container info-container m-t-10">
                      <div className="row">
                        <div className="col-sm-2"><div className="stock-box"><span className="label">Availability :</span></div></div>
                        <div className="col-sm-9"><div className="stock-box"><span className="value">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></div></div>
                      </div>
                    </div>
                    <div className="description-container m-t-20">{product.description}</div>
                    <div className="price-container info-container m-t-30">
                      <div className="row">
                        <div className="col-sm-6 col-xs-12">
                          <div className="price-box">
                            <span className="price">${product.price}</span>
                            {product.oldPrice && <span className="price-strike">${product.oldPrice}</span>}
                          </div>
                        </div>
                        <div className="col-sm-6 col-xs-12">
                          <div className="favorite-button m-t-5">
                            <a className="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Wishlist" href="#">
                               <i className="fa fa-heart"></i>
                            </a>
                            <a className="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Add to Compare" href="#">
                               <i className="fa fa-signal"></i>
                            </a>
                            <a className="btn btn-primary" data-toggle="tooltip" data-placement="right" title="E-mail" href="#">
                               <i className="fa fa-envelope"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="quantity-container info-container">
                      <div className="row">
                        <div className="col-sm-2"><span className="label">Qty :</span></div>
                        <div className="col-sm-2">
                          <div className="cart-quantity">
                            <div className="quant-input">
                              <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-7">
                          <button onClick={handleAddToCart} className="btn btn-primary"><i className="fa fa-shopping-cart inner-right-vs"></i> ADD TO CART</button>
                        </div>
                      </div>
                    </div>
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
