const selectedAmounts = new Set();

// Toggle selected class and manage selected amounts
document.querySelectorAll(".option button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");
    const isCustom = button.getAttribute("data-amount") === "custom";

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
        selectedAmounts.add(customAmount);
      }
    } else {
      const amount = parseInt(button.getAttribute("data-amount"), 10);
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
    if (button.classList.contains("selected")) {
      let customAmount = parseInt(input.value, 10);

      // Remove old custom amount
      selectedAmounts.forEach((amt) => {
        if (isNaN(amt) || amt < 100) selectedAmounts.delete(amt);
      });

      if (customAmount >= 100) selectedAmounts.add(customAmount);
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

  // UPI Payment details (Your UPI ID is used here)
  const upiId = "7898494061@ybl";
  const payeeName = "Namaskaram";
  const transactionNote = "Donation to Namaskaram";

  // Create UPI payment URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${totalAmount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;

  // Open UPI payment in a new window/tab
  window.open(upiUrl, "_blank");
});
