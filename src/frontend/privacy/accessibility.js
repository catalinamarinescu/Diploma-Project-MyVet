import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import "./accessibility.css";

const Accessibility = () => {
  return (
    <div className="acc-container">
      <Navbar />

      <section className="acc-hero">
        <div className="badge">Web Accessibility</div>
        <h1><span>Accessibility</span> <span className="highlight">Matters</span></h1>
        <p>Ensuring that everyone — regardless of ability — can navigate and use MyVet.</p>
        <p className="last-updated">Last updated: June 6, 2025</p>
      </section>

      <section className="acc-section">
        <h2>Our Goal</h2>
        <p>
          We aim to make the MyVet platform easy to navigate and use for everyone — including people with disabilities.
          We believe accessibility is not a feature, but a core part of user experience.
        </p>
      </section>

      <section className="acc-section dark">
        <h2>Measures We’ve Taken</h2>
        <ul className="checklist">
          <li>✔ Semantic HTML for screen reader compatibility</li>
          <li>✔ Sufficient contrast between text and background</li>
          <li>✔ Descriptive alt text for important images</li>
          <li>✔ Full keyboard navigation support</li>
          <li>✔ Avoid relying solely on color to convey meaning</li>
        </ul>
      </section>

      <section className="acc-section light">
        <h2>Ongoing Improvements</h2>
        <p>
          This is an ongoing effort. As the platform evolves, we continue working to improve usability
          and ensure all users can benefit from what we offer.
        </p>
        <p>
          If you encounter an accessibility issue, please let us know. Your feedback helps us improve.
        </p>
      </section>

      <section className="acc-section contact">
        <h2>Need Help?</h2>
        <p>
          If you need assistance using our site or have suggestions on how we can improve accessibility, email us at:
        </p>
        <p className="email">support@myvet.com</p>
      </section>

      <Footer />
    </div>
  );
};

export default Accessibility;
