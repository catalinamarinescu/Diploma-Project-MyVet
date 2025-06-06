import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import "./terms.css";

const Terms = () => {
  return (
    <div className="terms-container">
      <Navbar />

      <section className="terms-hero">
        <div className="badge">Legal Info</div>
        <h1><span>Terms &</span> <span className="highlight">Conditions</span></h1>
        <p>Understand what it means to use MyVet. Learn about your rights and responsibilities as a user.</p>
        <p className="last-updated">Last updated: June 6, 2025</p>
      </section>

      <section className="terms-section">
        <h2>1. About MyVet</h2>
        <p>
          MyVet is an educational platform that helps users explore pet care locations, animal breed information, and suggested products. Products listed on the platform are not for purchase and are for informational purposes only.
        </p>
      </section>

      <section className="terms-section dark">
        <h2>2. Use of the Website</h2>
        <p>By using MyVet, you agree to:</p>
        <ul className="checklist">
          <li>✔ Use the website only for lawful purposes</li>
          <li>✔ Not disrupt or harm the platform or other users</li>
          <li>✔ Respect all site content and intellectual property</li>
        </ul>
      </section>

      <section className="terms-section light">
        <h2>3. User Accounts</h2>
        <p>
          You are responsible for keeping your account information safe. We may suspend or delete accounts that violate our terms or are inactive.
        </p>
      </section>

      <section className="terms-section">
        <h2>4. Disclaimer</h2>
        <p>
          MyVet provides general information. We do not guarantee the accuracy of locations, breed details, or suggested products. Always consult a veterinarian for pet health concerns.
        </p>
      </section>

      <section className="terms-section dark">
        <h2>5. Third-Party Tools</h2>
        <p>
          We integrate services like maps and breed APIs. We are not responsible for the functionality or content of these external tools.
        </p>
      </section>

      <section className="terms-section light">
        <h2>6. Updates</h2>
        <p>
          These terms may be updated at any time. Continued use of the platform means you accept any revised terms.
        </p>
      </section>

      <section className="terms-section contact">
        <h2>7. Contact</h2>
        <p>
          Questions? Reach us at <strong className="email">support@myvet.com</strong>
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
