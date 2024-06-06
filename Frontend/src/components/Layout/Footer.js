import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    // <div className="footer">
    //   <h1 className="text-center">All Right Reserved &copy; Sujal Mirani</h1>
    //   <p className="text-center mt-3">
    //     <Link to='/about'>About</Link>
    //     |
    //     <Link to='/contact'>Contact</Link>
    //     |
    //     <Link to='/policy'>Privacy Policy</Link>
    //   </p>
    // </div>

    <>
      {/* Footer */}
      <footer
        className="text-center text-lg-start text-white"
        style={{ backgroundColor: "#1c2331" }}
      >
        {/* Section: Social media */}
        <section
          className="d-flex justify-content-between p-4"
          style={{ backgroundColor: "#6351ce" }}
        >
          <div className="me-5">
            <span>Get connected with us on social networks:</span>
          </div>
          <div>
            <a href="" className="text-white me-4">
              <FaFacebookF />
            </a>
            <a href="" className="text-white me-4">
              <FaTwitter />
            </a>
            <a href="" className="text-white me-4">
              <FaGoogle />
            </a>
            <a href="" className="text-white me-4">
              <FaInstagram />
            </a>
            <a href="" className="text-white me-4">
              <FaLinkedin />
            </a>
            <a href="" className="text-white me-4">
              <FaGithub />
            </a>
          </div>
        </section>
        <section className="">
          <div className="container text-center text-md-start mt-5">
            {/* Grid row */}
            <div className="row mt-3">
              {/* Grid column */}
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                {/* Content */}
                <h6 className="text-uppercase fw-bold">Titan</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
                />
                <p>
                  Here you can use rows and columns to organize your footer
                  content. Lorem ipsum dolor sit amet, consectetur adipisicing
                  elit.
                </p>
              </div>
              {/* Grid column */}
              {/* Grid column */}

              {/* Grid column */}
              {/* Grid column */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                {/* Links */}
                <h6 className="text-uppercase fw-bold">Useful links</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
                />
                <p>
                  <Link to="/" className="text-white">
                    Home
                  </Link>
                </p>
                <p>
                  <Link to="/about" className="text-white">
                    About Us
                  </Link>
                </p>
                <p>
                  <Link to="/contact" className="text-white">
                    Contact
                  </Link>
                </p>
                <p>
                  <Link to="/policy" className="text-white">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              {/* Grid column */}
              {/* Grid column */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                {/* Links */}
                <h6 className="text-uppercase fw-bold">Contact</h6>
                <hr
                  className="mb-4 mt-0 d-inline-block mx-auto"
                  style={{ width: 60, backgroundColor: "#7c4dff", height: 2 }}
                />
                <p>
                  <i className="fas fa-home mr-3" /> New York, NY 10012, US
                </p>
                <p>
                  <i className="fas fa-envelope mr-3" />{" "}
                  www.help@ecommerceapp.com
                </p>
                <p>
                  <i className="fas fa-phone mr-3" /> 012-3456789
                </p>
                <p>
                  <i className="fas fa-print mr-3" /> 1800-0000-0000 (toll free)
                </p>
              </div>
              {/* Grid column */}
            </div>
            {/* Grid row */}
          </div>
        </section>
        {/* Section: Links  */}
        {/* Copyright */}
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          {/* © 2024 Copyright: */}
          <a className="text-white">All Right Reserved &copy; Sujal Mirani</a>
        </div>
        {/* Copyright */}
      </footer>
      {/* End of .container */}
    </>
  );
};

export default Footer;
