import React, { useState } from 'react';

const faqs = [
  {
    question: "How can I place an order?",
    answer: "You can browse our products, add them to your cart, and checkout using our secure payment gateway. You will receive a confirmation email once your order is placed."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, mobile banking, and cash on delivery for certain areas."
  },
  {
    question: "Can I track my order?",
    answer: "Yes! Once your order is confirmed, you will receive a tracking link to monitor your delivery status in real-time."
  },
  {
    question: "Do you deliver nationwide?",
    answer: "We currently deliver to specific regions including Anwara, Banshkhali, Patiya, Cox's Bazar, Chandanish, Satkania, Rangamati, and more. Delivery availability will be shown during checkout."
  },
  {
    question: "What is your return/refund policy?",
    answer: "If you receive a damaged or incorrect product, please contact our support within 24 hours. We will arrange a replacement or refund as per our policy."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via phone at +880 1700-000000 or email at support@foodmart.com. Our support team is available 7 days a week."
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-lg border cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
              <span className="text-gray-600 text-2xl">{openIndex === index ? '-' : '+'}</span>
            </div>
            {openIndex === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
