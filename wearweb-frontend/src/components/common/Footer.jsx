<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
<<<<<<< HEAD
    <footer className="w-full bg-[#1a1a1a] text-[#ffffff] py-[32px]">
      <div className="max-w-[1200px] mx-auto px-[20px] lg:px-[32px]">
         
         <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-[24px] border-b border-solid border-[#333333] pb-[32px] mb-[32px]">
            
            {/* Left Side: Brand */}
            <div className="text-center md:text-left">
              <Link to="/">
                <h2 className="text-[24px] font-[900] tracking-tight italic mb-[8px] text-[#ffffff]">
                  Wear<span className="text-[#FFD700]">Web</span>
                </h2>
              </Link>
              <p className="text-[14px] text-[#a1a1aa] max-w-[300px]">
                Your ultimate fashion marketplace. Shop top brands, latest styles, and exclusive deals.
              </p>
            </div>

            {/* Right Side: Links */}
            <div className="flex flex-wrap justify-center gap-[24px] text-[14px] font-[500]">
               <Link to="/" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Home</Link>
               <Link to="/products" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Categories</Link>
               <Link to="/contact" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">Contact</Link>
               <Link to="/about" className="text-[#e4e4e7] hover:text-[#FFD700] transition-colors">About</Link>
            </div>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-[#a1a1aa]">
            <p>&copy; 2025 Wear Web. All rights reserved.</p>
            <div className="flex gap-[16px] mt-[12px] md:mt-0">
               <span className="hover:text-white cursor-pointer">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
         </div>

=======
<footer id="footer" className="footer color-bg">
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="address-block">
                {/*  */}

                <div className="module-body">
                  <ul className="toggle-footer">
                    <li className="media">
                      <div className="pull-left">
                        <span className="icon fa-stack fa-lg">
                          <i
                            className="fa fa-map-marker fa-stack-1x fa-inverse"
                          ></i>
                        </span>
                      </div>
                      <div className="media-body">
                        <p>ThemesGround, 789 Main rd, Anytown, CA 12345 USA</p>
                      </div>
                    </li>
                    <li className="media">
                      <div className="pull-left">
                        <span className="icon fa-stack fa-lg">
                          <i className="fa fa-mobile fa-stack-1x fa-inverse"></i>
                        </span>
                      </div>
                      <div className="media-body">
                        <p>+ (888) 123-4567 / + (888) 456-7890</p>
                      </div>
                    </li>
                    <li className="media">
                      <div className="pull-left">
                        <span className="icon fa-stack fa-lg">
                          <i className="fa fa-envelope fa-stack-1x fa-inverse"></i>
                        </span>
                      </div>
                      <div className="media-body">
                        <span><a href="#">marazzo@themesground.com</a></span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {/*  */}
            </div>
            {/*  */}

            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Customer Service</h4>
              </div>
              {/*  */}

              <div className="module-body">
                <ul className="list-unstyled">
                  <li className="first">
                    <a href="#" title="Contact us">My Account</a>
                  </li>
                  <li><a href="#" title="About us">Order History</a></li>
                  <li><a href="#" title="faq">FAQ</a></li>
                  <li><a href="#" title="Popular Searches">Specials</a></li>
                  <li className="last">
                    <a href="#" title="Where is my order?">Help Center</a>
                  </li>
                </ul>
              </div>
              {/*  */}
            </div>
            {/*  */}

            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Corporation</h4>
              </div>
              {/*  */}

              <div className="module-body">
                <ul className="list-unstyled">
                  <li className="first">
                    <a title="Your Account" href="#">About us</a>
                  </li>
                  <li><a title="Information" href="#">Customer Service</a></li>
                  <li><a title="Addresses" href="#">Company</a></li>
                  <li><a title="Addresses" href="#">Investor Relations</a></li>
                  <li className="last">
                    <a title="Orders History" href="#">Advanced Search</a>
                  </li>
                </ul>
              </div>
              {/*  */}
            </div>
            {/*  */}

            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Why Choose Us</h4>
              </div>
              {/*  */}

              <div className="module-body">
                <ul className="list-unstyled">
                  <li className="first">
                    <a href="#" title="About us">Shopping Guide</a>
                  </li>
                  <li><a href="#" title="Blog">Blog</a></li>
                  <li><a href="#" title="Company">Company</a></li>
                  <li>
                    <a href="#" title="Investor Relations"
                      >Investor Relations</a
                    >
                  </li>
                  <li className="last">
                    <a href="contact-us.html" title="Suppliers">Contact Us</a>
                  </li>
                </ul>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-bar">
        <div className="container">
          <div className="col-xs-12 col-sm-4 no-padding social">
            <ul className="link">
              <li className="fb pull-left">
                <a target="_blank" rel="nofollow" href="#" title="Facebook"></a>
              </li>
              <li className="tw pull-left">
                <a target="_blank" rel="nofollow" href="#" title="Twitter"></a>
              </li>
              <li className="googleplus pull-left">
                <a
                  target="_blank"
                  rel="nofollow"
                  href="#"
                  title="GooglePlus"
                ></a>
              </li>
              <li className="rss pull-left">
                <a target="_blank" rel="nofollow" href="#" title="RSS"></a>
              </li>
              <li className="pintrest pull-left">
                <a
                  target="_blank"
                  rel="nofollow"
                  href="#"
                  title="PInterest"
                ></a>
              </li>
              <li className="linkedin pull-left">
                <a target="_blank" rel="nofollow" href="#" title="Linkedin"></a>
              </li>
              <li className="youtube pull-left">
                <a target="_blank" rel="nofollow" href="#" title="Youtube"></a>
              </li>
            </ul>
          </div>
          <div className="col-xs-12 col-sm-4 no-padding copyright">
            <a target="_blank" href="https://www.templateshub.net"
              >Templates Hub</a
            >
          </div>
          <div className="col-xs-12 col-sm-4 no-padding">
            <div className="clearfix payment-methods">
              <ul>
                <li><img src="assets/images/payments/1.png" alt="" /></li>
                <li><img src="assets/images/payments/2.png" alt="" /></li>
                <li><img src="assets/images/payments/3.png" alt="" /></li>
                <li><img src="assets/images/payments/4.png" alt="" /></li>
                <li><img src="assets/images/payments/5.png" alt="" /></li>
              </ul>
            </div>
            {/*  */}
          </div>
        </div>
>>>>>>> bb88c13d3fda24481acc557261a1bc5c8b68fee1
      </div>
    </footer>
  );
};
