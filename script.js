const selectedAmounts = new Set();

// Toggle selected class and manage selected amounts
document.querySelectorAll(".option button").forEach((button) => {
  button.addEventListener("click", () => {
    const isCustom = button.getAttribute("data-amount") === "custom";
    button.classList.toggle("selected");

    if (isCustom) {
      const input = button.previousElementSibling;
      let customAmount = parseInt(input.value, 10);

      if (!customAmount || customAmount < 100) {
        alert("Please enter a valid amount (minimum ₹100)");
        button.classList.remove("selected");
        return;
      }

      // Remove any previously added custom amounts
      selectedAmounts.forEach((amt) => {
        if (isNaN(amt) || amt < 100) selectedAmounts.delete(amt);
      });

      if (button.classList.contains("selected")) {
        selectedAmounts.clear(); // Ensure only one custom amount exists
        selectedAmounts.add(customAmount);
      }
    } else {
      const amount = parseInt(button.getAttribute("data-amount"), 10);

      // Remove any existing custom amounts when selecting predefined amounts
      selectedAmounts.forEach((amt) => {
        if (isNaN(amt) || amt < 100) selectedAmounts.delete(amt);
      });

      if (button.classList.contains("selected")) {
        selectedAmounts.add(amount);
      } else {
        selectedAmounts.delete(amount);
      }
    }
  });
});

// Ensure only one valid custom amount is stored
document.querySelectorAll(".custom-amount-input").forEach((input) => {
  input.addEventListener("input", () => {
    const button = input.nextElementSibling;
    let customAmount = parseInt(input.value, 10);

    if (button.classList.contains("selected") && customAmount >= 100) {
      selectedAmounts.clear(); // Ensure only one custom amount
      selectedAmounts.add(customAmount);
    }
  });
});

// Handle UPI payment on Donate button click
document.getElementById("donate-btn").addEventListener("click", () => {
  if (selectedAmounts.size === 0) {
    alert("Please select at least one donation option.");
    return;
  }

  const totalAmount = Array.from(selectedAmounts).reduce(
    (sum, amt) => sum + amt,
    0
  );

  // UPI Payment details
  const upiId = "7898494061@ybl";
  const payeeName = "Namaskaram";
  const transactionNote = "Donation to Namaskaram";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${totalAmount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;

  // Check if user is on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = upiUrl;
  } else {
    // Create payment page content
    const paymentPageContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secure Payment - Namaskaram</title>
        <link rel="stylesheet" href="style.css">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      </head>
      <body>
        <header>
          <div class="logo">
            <img src="images/om_2448613.png" alt="Namaskaram Logo" class="logo-img">
            <span class="logo-text">Namaskaram</span>
          </div>
        </header>
        
        <main>
          <div class="donation-section payment-section">
            <div class="secure-badge">
              <i class="fas fa-lock"></i> Secure Payment
            </div>
            
            <h1>Complete Your Donation</h1>
            <div class="payment-content">
              <div class="payment-amount">
                <div class="amount-details">
                  <p>Your Contribution Amount</p>
                  <p class="amount">₹${totalAmount}</p>
                </div>
                <div class="donation-impact">
                  <i class="fas fa-heart"></i>
                  <p>Your donation will help provide meals to those in need</p>
                </div>
              </div>
              
              <div class="payment-methods">
                <div class="upi-section">
                  <h2><i class="fas fa-mobile-alt"></i> UPI Payment Details</h2>
                  <div class="upi-details">
                    <div class="upi-id-container">
                      <p>UPI ID:</p>
                      <span class="upi-id">${upiId}</span>
                      <button class="copy-btn" onclick="copyUpiId(this, '${upiId}')">
                        <i class="fas fa-copy"></i>
                      </button>
                    </div>
                    <div class="payment-steps">
                      <p class="steps-title">How to pay:</p>
                      <ol>
                        <li>Open your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                        <li>Select "Pay by UPI ID/VPA"</li>
                        <li>Enter the UPI ID shown above</li>
                        <li>Enter amount: ₹${totalAmount}</li>
                        <li>Verify name: "${payeeName}" and complete payment</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div class="qr-section">
                  <h2><i class="fas fa-qrcode"></i> Scan & Pay</h2>
                  <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      upiUrl
                    )}" 
                         alt="Payment QR Code">
                    <p class="scan-instruction">Scan with any UPI app</p>
                  </div>
                </div>
              </div>
              
              <div class="payment-footer">
                <div class="security-badges">
                  <div class="badge"><i class="fas fa-shield-alt"></i> Secure Payment</div>
                  <div class="badge"><i class="fas fa-check-circle"></i> Verified NGO</div>
                  <div class="badge"><i class="fas fa-clock"></i> 24/7 Support</div>
                </div>
                
                <div class="action-buttons">
                  <button class="back-btn" onclick="window.location.href='index.html'">
                    <i class="fas fa-arrow-left"></i> Back to Donation Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer class="payment-page-footer">
          <p>© 2024 Namaskaram. All rights reserved.</p>
          <p>For support, contact: sahayam.namaskaram@gmail.com</p>
        </footer>
      </body>
      </html>
    `;

    // Open new window with payment page
    const paymentWindow = window.open("", "_blank");
    paymentWindow.document.write(paymentPageContent);
    paymentWindow.document.close();
  }
});

// Add the copy function
const copyUpiId = (button, upiId) => {
  navigator.clipboard.writeText(upiId).then(() => {
    button.classList.add("copied");
    button.innerHTML = '<i class="fas fa-check"></i> कॉपी हो गया';

    setTimeout(() => {
      button.classList.remove("copied");
      button.innerHTML = '<i class="fas fa-copy"></i> कॉपी करें';
    }, 2000);
  });
};
