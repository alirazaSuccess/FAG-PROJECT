import React from 'react'

const Contact = () => {
    return (
// <!-- Contact Section -->
<section class="contact-section">
  <div class="contact-container">
    <h2>Contact Us</h2>
    <p>We’d love to hear from you! Fill out the form below and we’ll get back to you shortly.</p>

    <form class="contact-form">
      <div class="form-group">
        <label>Your Name</label>
        <input type="text" placeholder="Enter your name" required />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label>Message</label>
        <textarea placeholder="Write your message..." required></textarea>
      </div>

      <button type="submit" class="btn-submit">Send Message</button>
    </form>
  </div>
</section>
    )
}

export default Contact
