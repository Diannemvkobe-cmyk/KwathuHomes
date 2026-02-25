import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const Contact = ({ onBack }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-20">
      {/* Navigation */}
      <nav className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-xl shadow-slate-200 border border-white hover:scale-105 transition-all text-xs font-black uppercase tracking-widest text-slate-600 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 pt-32"
      >
        {/* Header Section */}
        <motion.section variants={itemVariants} className="mb-20 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
          <div className="lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6 mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Contact Us</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-[0.9]">
              LET'S START A <br />
              <span className="text-emerald-600">CONVERSATION</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto lg:mx-0">
              Have a question about a property or want to work with us? Reach out and we'll get back to you as soon as possible.
            </p>
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                <Phone className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</h3>
              <a href="tel:+260974213517" className="text-2xl font-black text-slate-900 tracking-tight hover:text-emerald-600 transition-colors">
                +260 974213517
              </a>
              <p className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Available 08:00 - 18:00
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8">
                <Mail className="text-emerald-400 w-6 h-6" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</h3>
              <a href="mailto:diannemvkobe@icloud.com" className="text-xl md:text-2xl font-black text-slate-900 tracking-tight hover:text-emerald-600 transition-colors break-all">
                diannemvkobe@icloud.com
              </a>
              <p className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Quick response guaranteed
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="text-emerald-600 w-6 h-6" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Our Office</h3>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                Lusaka, Zambia
              </p>
              <p className="text-sm text-slate-500 font-medium mt-2">
                Central Business District
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="example@mail.com"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                <input
                  type="text"
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-full focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                <textarea
                  rows="5"
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSent}
                className={`w-full py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${isSent
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 text-white hover:bg-slate-900 hover:-translate-y-1 active:scale-95 shadow-emerald-900/20'
                  }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isSent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent Successfully
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Preview Section */}
        <motion.section variants={itemVariants} className="mt-32 py-20 bg-slate-900 rounded-[4rem] px-8 md:px-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:max-w-md">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none">
                PREFER TO CHAT <br /> IN PERSON?
              </h2>
              <p className="text-slate-400 font-medium">
                Our team is always ready to meet and discuss your requirements. Visit us at our main office in Lusaka for a cup of coffee and a consultation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
              <button className="bg-white text-slate-900 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl">
                Get Directions
              </button>
              <button className="bg-white/10 text-white border border-white/10 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Schedule Meeting
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Contact;
