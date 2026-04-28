import React from "react";
import "./Terms.css";

const Terms = () => {
  return (
    <div className="terms">

      <h1>Terms & Conditions</h1>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Yummix, you agree to comply with these Terms & Conditions.
          If you do not agree, please do not use our services.
        </p>
      </section>

      <section>
        <h2>2. Use of Service</h2>
        <p>
          You agree to use Yummix only for lawful purposes. Any misuse,
          fraudulent activity, or violation of laws is strictly prohibited.
        </p>
      </section>

      <section>
        <h2>3. Orders & Payments</h2>
        <ul>
          <li>All orders are subject to availability.</li>
          <li>Prices may change without prior notice.</li>
          <li>Payments are processed securely via third-party providers.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cancellation & Refund</h2>
        <p>
          Orders can only be canceled within a limited time after placing.
          Refunds will be processed based on our refund policy.
        </p>
      </section>

      <section>
        <h2>5. Delivery Policy</h2>
        <p>
          Delivery times are estimates and may vary due to traffic,
          weather, or other conditions. We strive to deliver on time.
        </p>
      </section>

      <section>
        <h2>6. User Responsibilities</h2>
        <ul>
          <li>Provide accurate delivery details.</li>
          <li>Maintain account confidentiality.</li>
          <li>Do not misuse the platform.</li>
        </ul>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          Yummix is not responsible for delays, damages, or losses caused
          by third-party services or unforeseen circumstances.
        </p>
      </section>

      <section>
        <h2>8. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          platform means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2>9. Contact Information</h2>
        <p>Email: support@yummix.com</p>
        <p>Phone: +91-XXXXXXXXXX</p>
      </section>

    </div>
  );
};

export default Terms;