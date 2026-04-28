import React from "react";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy">

      <h1>Privacy Policy</h1>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Yummix. We value your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we collect,
          use, and safeguard your data.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Personal details (name, email, phone number)</li>
          <li>Delivery address</li>
          <li>Order history</li>
          <li>Payment details (secured via third-party providers)</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To improve our services</li>
          <li>To send order updates and notifications</li>
          <li>To provide customer support</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>
          We implement strong security measures to protect your data. However,
          no online platform is 100% secure, and we encourage users to keep their
          credentials safe.
        </p>
      </section>

      <section>
        <h2>5. Third-Party Services</h2>
        <p>
          We may use third-party services (like payment gateways) that have their
          own privacy policies. We are not responsible for their practices.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data.
          Contact us if you need assistance.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page.
        </p>
      </section>

      <section>
        <h2>8. Contact Us</h2>
        <p>Email: support@yummix.com</p>
        <p>Phone: +91-XXXXXXXXXX</p>
      </section>

    </div>
  );
};

export default Privacy;