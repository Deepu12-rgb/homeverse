/**
 * Mortgage Calculator JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const mortgageForm = document.getElementById('mortgage-form');
  const homePrice = document.getElementById('home-price');
  const downPayment = document.getElementById('down-payment');
  const downPaymentPercentage = document.getElementById('down-payment-percentage');
  const loanTerm = document.getElementById('loan-term');
  const interestRate = document.getElementById('interest-rate');
  const propertyTax = document.getElementById('property-tax');
  const homeInsurance = document.getElementById('home-insurance');
  const hoa = document.getElementById('hoa');

  // Result elements
  const totalPayment = document.getElementById('total-payment');
  const principalInterest = document.getElementById('principal-interest');
  const monthlyTax = document.getElementById('monthly-tax');
  const monthlyInsurance = document.getElementById('monthly-insurance');
  const monthlyHoa = document.getElementById('monthly-hoa');
  const loanAmount = document.getElementById('loan-amount');
  const summaryDownPayment = document.getElementById('summary-down-payment');
  const totalInterest = document.getElementById('total-interest');
  const totalPayments = document.getElementById('total-payments');
  const propertyAddress = document.getElementById('property-address');

  // Action buttons
  const prequalifyBtn = document.getElementById('prequalify-btn');
  const contactLenderBtn = document.getElementById('contact-lender-btn');
  const shareResultsBtn = document.getElementById('share-results-btn');

  // Chart variables
  let paymentChart = null;

  // Get URL parameters to see if coming from home value estimator
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('homePrice')) {
    const urlHomePrice = urlParams.get('homePrice');
    if (!isNaN(urlHomePrice)) {
      homePrice.value = urlHomePrice;
      // Set down payment to 20% of home price
      downPayment.value = Math.round(urlHomePrice * 0.2);
      updateDownPaymentPercentage();
    }
  }

  if (urlParams.has('location')) {
    const location = decodeURIComponent(urlParams.get('location'));
    propertyAddress.textContent = location;
  }

  // Calculate mortgage when form loads
  calculateMortgage();

  // Event listeners
  if (mortgageForm) {
    mortgageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateMortgage();
    });
  }

  // Add input event listeners to update in real-time
  homePrice.addEventListener('input', function() {
    // Update down payment percentage when home price changes
    updateDownPaymentPercentage();
  });

  downPayment.addEventListener('input', function() {
    updateDownPaymentPercentage();
  });

  // Home price and down payment auto-formatting
  [homePrice, downPayment, propertyTax, homeInsurance, hoa].forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value) {
        const formattedValue = Math.round(parseFloat(this.value));
        this.value = formattedValue;
      }
    });
  });

  // Interest rate formatting
  interestRate.addEventListener('blur', function() {
    if (this.value) {
      const rate = parseFloat(this.value);
      if (rate > 0) {
        this.value = Math.min(rate, 20).toFixed(1);
      }
    }
  });

  // Button handlers
  if (prequalifyBtn) {
    prequalifyBtn.addEventListener('click', function() {
      // Redirect to pre-qualification form
      window.location.href = 'prequalify.html';
    });
  }

  if (contactLenderBtn) {
    contactLenderBtn.addEventListener('click', function() {
      // Redirect to lender contact page
      window.location.href = 'lenders.html';
    });
  }

  if (shareResultsBtn) {
    shareResultsBtn.addEventListener('click', function() {
      // In a real application, this would open a share dialog
      // For this example, we'll just copy the link to clipboard
      const calculatorUrl = new URL(window.location.href);
      calculatorUrl.search = new URLSearchParams({
        homePrice: homePrice.value,
        downPayment: downPayment.value,
        loanTerm: loanTerm.value,
        interestRate: interestRate.value,
        propertyTax: propertyTax.value,
        homeInsurance: homeInsurance.value,
        hoa: hoa.value
      }).toString();
      
      navigator.clipboard.writeText(calculatorUrl.toString())
        .then(() => {
          alert('Calculator link copied to clipboard!');
        })
        .catch(err => {
          console.error('Could not copy link: ', err);
        });
    });
  }

  // Function to update down payment percentage display
  function updateDownPaymentPercentage() {
    const price = parseFloat(homePrice.value) || 0;
    const payment = parseFloat(downPayment.value) || 0;
    
    if (price > 0) {
      const percentage = (payment / price) * 100;
      downPaymentPercentage.textContent = percentage.toFixed(1) + '%';
    } else {
      downPaymentPercentage.textContent = '0%';
    }
  }

  // Function to calculate mortgage
  function calculateMortgage() {
    // Get form values
    const price = parseFloat(homePrice.value) || 0;
    const payment = parseFloat(downPayment.value) || 0;
    const term = parseInt(loanTerm.value) || 30;
    const rate = parseFloat(interestRate.value) || 0;
    const tax = parseFloat(propertyTax.value) || 0;
    const insurance = parseFloat(homeInsurance.value) || 0;
    const hoaFee = parseFloat(hoa.value) || 0;
    
    // Calculate mortgage using the imported propertyData utility
    const mortgageData = window.propertyData.calculateMortgage(
      price, payment, rate, term, tax, insurance, hoaFee
    );
    
    // Update UI with calculation results
    updateMortgageUI(mortgageData);
    
    // Create or update chart
    createPaymentChart(mortgageData);
  }

  // Function to update mortgage UI
  function updateMortgageUI(mortgageData) {
    // Update payment breakdown
    totalPayment.textContent = mortgageData.formattedTotalMonthlyPayment;
    principalInterest.textContent = mortgageData.formattedPrincipalAndInterest;
    monthlyTax.textContent = window.propertyData.formatCurrency(mortgageData.propertyTax);
    monthlyInsurance.textContent = window.propertyData.formatCurrency(mortgageData.homeInsurance);
    monthlyHoa.textContent = window.propertyData.formatCurrency(mortgageData.hoa);
    
    // Update loan summary
    loanAmount.textContent = mortgageData.formattedLoanAmount;
    summaryDownPayment.textContent = `${window.propertyData.formatCurrency(parseFloat(downPayment.value))} (${downPaymentPercentage.textContent})`;
    
    // Calculate total interest paid over loan term
    const loanTermYears = parseInt(loanTerm.value);
    const totalInterestPaid = (mortgageData.principalAndInterest * 12 * loanTermYears) - mortgageData.loanAmount;
    totalInterest.textContent = window.propertyData.formatCurrency(totalInterestPaid);
    
    // Calculate total of all payments
    const totalOfAllPayments = mortgageData.totalMonthlyPayment * 12 * loanTermYears;
    totalPayments.textContent = window.propertyData.formatCurrency(totalOfAllPayments);
  }

  // Function to create payment breakdown chart
  function createPaymentChart(mortgageData) {
    // Destroy existing chart if it exists
    if (paymentChart) {
      paymentChart.destroy();
    }
    
    const ctx = document.getElementById('payment-chart').getContext('2d');
    
    // Data for chart
    const data = {
      labels: ['Principal & Interest', 'Property Tax', 'Home Insurance', 'HOA'],
      datasets: [{
        data: [
          mortgageData.principalAndInterest,
          mortgageData.propertyTax,
          mortgageData.homeInsurance,
          mortgageData.hoa
        ],
        backgroundColor: [
          '#F85A40',
          '#2D89EF',
          '#29CC87',
          '#FFCC00'
        ],
        borderWidth: 0
      }]
    };
    
    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              return window.propertyData.formatCurrency(value) + ' per month';
            }
          }
        }
      }
    };
    
    // Create new chart
    paymentChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
    });
  }
}); 