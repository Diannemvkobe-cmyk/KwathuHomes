/*
Purpose
- Payment processing page with Zambian payment options.
- User-friendly for elderly with clear, large buttons.

Where It Fits
- Shown when a user clicks "Pay for Property" from the property details.
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, CheckCircle, ArrowRight, Phone, CreditCard as CreditCardIcon, DollarSign, Smartphone, MapPin, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../utils/api';

const Payments = ({ onBack, property }) => {
  const { token } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData(prev => ({ ...prev, amount: property.price }));
    }
  }, [property]);

  const savePayment = async () => {
    if (!token || !property) return;
    setSavingPayment(true);
    try {
      const res = await fetch(apiUrl('/auth/payments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          property: property,
          amount: formData.amount || property.price,
          paymentMethod: selectedPayment,
          paymentDetails: formData
        })
      });
      if (res.ok) {
        setStep(3);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setSavingPayment(false);
    }
  };

  const paymentOptions = [
    {
      id: 'zamtel',
      name: 'Zamtel Money',
      description: 'Pay using Zamtel mobile money',
      color: 'bg-green-500',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white font-bold text-lg">
          Z
        </div>
      )
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Pay using Airtel mobile money',
      color: 'bg-red-500',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
      )
    },
    {
      id: 'mtn',
      name: 'MTN Money',
      description: 'Pay using MTN mobile money',
      color: 'bg-yellow-500',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
          M
        </div>
      )
    },
    {
      id: 'visa',
      name: 'Visa Card',
      description: 'Pay with your Visa card',
      color: 'bg-blue-600',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          V
        </div>
      )
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      description: 'Pay with your Mastercard',
      color: 'bg-orange-500',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
          MC
        </div>
      )
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay using PayPal',
      color: 'bg-blue-700',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
          P
        </div>
      )
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Pay using Bitcoin cryptocurrency',
      color: 'bg-orange-400',
      logo: (
        <div className="w-12 h-12 rounded-xl bg-orange-400 flex items-center justify-center text-white font-bold text-lg">
          ₿
        </div>
      )
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getPropertyImage = () => {
    if (!property) return null;
    if (property.images && property.images.length > 0) return property.images[0];
    if (property.image) return property.image;
    return null;
  };

  const renderPaymentForm = () => {
    const option = paymentOptions.find(o => o.id === selectedPayment);
    
    switch(selectedPayment) {
      case 'zamtel':
      case 'airtel':
      case 'mtn':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-20 h-20 ${option.color} rounded-[2rem] flex items-center justify-center mx-auto mb-6`}>
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{option.name}</h2>
              <p className="text-slate-500">Enter your mobile money details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 0971234567"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Amount to Pay
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'visa':
      case 'mastercard':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-20 h-20 ${option.color} rounded-[2rem] flex items-center justify-center mx-auto mb-6`}>
                <CreditCardIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{option.name}</h2>
              <p className="text-slate-500">Enter your card details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber || ''}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry || ''}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv || ''}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName || ''}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                />
              </div>
            </div>
          </div>
        );

      case 'paypal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">PayPal</h2>
              <p className="text-slate-500">Connect to your PayPal account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  PayPal Email
                </label>
                <input
                  type="email"
                  name="paypalEmail"
                  value={formData.paypalEmail || ''}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                />
              </div>
            </div>
          </div>
        );

      case 'bitcoin':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-white">₿</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Bitcoin</h2>
              <p className="text-slate-500">Send Bitcoin to our wallet address</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">
                  Wallet Address
                </label>
                <div className="bg-white rounded-xl p-4 border border-slate-200 font-mono text-sm break-all">
                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                  Transaction ID (after sending)
                </label>
                <input
                  type="text"
                  name="txId"
                  value={formData.txId || ''}
                  onChange={handleInputChange}
                  placeholder="Enter transaction hash"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 text-lg font-medium"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold text-lg transition-all group mb-8"
        >
          <span className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </span>
          Back to Listings
        </motion.button>

        {/* Property Summary Card */}
        {property && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100">
                {getPropertyImage() ? (
                  <img src={getPropertyImage()} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="bg-emerald-50 text-emerald-700 font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px] inline-block mb-2">
                      {property.tag}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {property.title}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-slate-500">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold">{property.location}</span>
                </div>
                <div className="mt-4 bg-emerald-600 rounded-2xl px-6 py-3 text-white">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Price</p>
                  <p className="text-3xl font-black">{property.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8"
        >
          {/* Progress Steps */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-lg md:text-xl ${
                  step >= s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6 md:w-7 md:h-7" /> : s}
                </div>
                <span className={`font-bold text-xs md:text-sm ${step >= s ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {s === 1 ? 'Select Payment' : s === 2 ? 'Enter Details' : 'Complete'}
                </span>
                {s < 3 && <div className={`hidden md:block w-12 md:w-20 h-1 rounded-full ${step > s ? 'bg-emerald-600' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Payment Method */}
          {step === 1 && (
            <div>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
                  Choose Payment Method
                </h1>
                <p className="text-slate-500 text-lg">
                  Select how you'd like to pay for this property
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {paymentOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(option.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedPayment === option.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {option.logo}
                      <div className="flex-1">
                        <h3 className={`font-black text-lg ${
                          selectedPayment === option.id ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {option.name}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">{option.description}</p>
                      </div>
                      {selectedPayment === option.id && (
                        <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!selectedPayment}
                  onClick={() => setStep(2)}
                  className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-lg transition-all ${
                    selectedPayment
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/25'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-5 h-5 inline-block ml-2" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Form */}
          {step === 2 && (
            <div>
              {renderPaymentForm()}

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 rounded-full border-2 border-slate-200 text-slate-700 font-black uppercase tracking-widest hover:border-slate-300 transition-all"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={savePayment}
                  disabled={savingPayment}
                  className="px-10 py-4 rounded-full bg-emerald-600 text-white font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {savingPayment ? 'Processing...' : 'Continue'} <ArrowRight className="w-5 h-5 inline-block ml-2" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="text-center py-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-black text-slate-900 mb-4"
              >
                Payment on Hold!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-500 text-lg mb-6 max-w-lg mx-auto"
              >
                Your payment has been received and is currently on hold.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 max-w-md mx-auto"
              >
                <p className="text-amber-800 font-semibold text-lg">
                  What happens next?
                </p>
                <ul className="text-left text-amber-700 mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-1">•</span>
                    <span>View the property in person</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-1">•</span>
                    <span>If satisfied, approve payment in your admin dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-1">•</span>
                    <span>Payment will be sent to the property owner upon approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-1">•</span>
                    <span>You can also reverse the payment if not satisfied</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-center gap-4"
              >
                <button
                  onClick={onBack}
                  className="px-8 py-4 rounded-full bg-emerald-600 text-white font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                  Back to Listings
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Payments;
