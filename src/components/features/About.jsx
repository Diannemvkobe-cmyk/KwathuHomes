import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Heart,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';

const About = ({ onBack }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Meet Our Vision</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-8 leading-[0.9]">
            REDESIGNING THE <br />
            <span className="text-emerald-600">HOME EXPERIENCE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium">
            At KwathuHomes, we believe that a home is more than just a place to stay. It's the foundation for your dreams, your comfort, and your community.
          </p>
        </motion.section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <motion.div
            variants={itemVariants}
            className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
              <Target className="text-white w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">Our Mission</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              To simplify the search for the perfect home in Zambia through innovative technology, transparent communication, and a user-centric approach that prioritizes trust and quality.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl shadow-slate-900/20"
          >
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
              <Users className="text-emerald-400 w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Our Community</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              We aim to foster a vibrant community of homeowners, buyers, and tenants where every transaction is seamless and every interaction is meaningful.
            </p>
          </motion.div>
        </div>

        {/* Founder Section */}
        <motion.section
          variants={itemVariants}
          className="mb-32 overflow-hidden bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 min-h-[500px] bg-slate-200 relative group overflow-hidden">
              <img
                src="/dianne-about-pic.jpeg"
                alt="Dianne Mvkobe"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on hover for subtle effect */}
              <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform">Creator & Founder</span>
              </div>
            </div>

            {/* Founder Info */}
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <div className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The Creator & Owner</div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-none">
                DIANNE <br />
                <span className="text-slate-400">MVKOBE</span>
              </h2>
              <div className="w-20 h-1.5 bg-emerald-600 mb-10 rounded-full"></div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                As the visionary behind KwathuHomes, Dianne Mvkobe is dedicated to transforming the real estate landscape in Zambia. With a passion for design and technology, she has built this platform to bridge the gap between dream homes and their future owners.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {[
                  "Passionate Visionary",
                  "Tech Innovator",
                  "Community Builder"
                ].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {skill}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <button className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl shadow-slate-900/10">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl shadow-slate-900/10">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl shadow-slate-900/10">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Trust",
              desc: "We build long-lasting relationships based on honesty and clarity.",
              icon: Heart
            },
            {
              title: "Innovation",
              desc: "Constantly evolving to provide the best tools for our users.",
              icon: Sparkles
            },
            {
              title: "Quality",
              desc: "Curating only the finest properties for our discerning clients.",
              icon: CheckCircle2
            }
          ].map((value, idx) => (
            <div key={idx} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                <value.icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-slate-900">{value.title}</h4>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.section variants={itemVariants} className="mt-40 text-center py-20 bg-emerald-600 rounded-[4rem] text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
            READY TO FIND <br /> YOUR NEXT HOME?
          </h2>
          <button
            onClick={onBack}
            className="bg-white text-emerald-600 px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-emerald-900/20"
          >
            Explore Properties
          </button>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;
