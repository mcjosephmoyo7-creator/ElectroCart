'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
} from 'react-icons/hi';

const contactInfo = [
  { icon: HiOutlineLocationMarker, label: 'Visit Us', value: 'New Orleans, USA' },
  { icon: HiOutlinePhone, label: 'Call Us', value: '+12 958 648 597' },
  { icon: HiOutlineMail, label: 'Email Us', value: 'electrocart@gmail.com' },
  { icon: HiOutlineClock, label: 'Working Hours', value: 'Mon – Sat: 10:00 AM – 7:00 PM' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      <div className="bg-navy dark:bg-navy-900 text-white">
        <div className="container-custom py-12 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / Contact Us</p>
          <h1 className="text-3xl lg:text-5xl font-bold">Get in Touch</h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            Have a question, feedback or need help with an order? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slateText dark:text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">Message *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Write your message here..." className="input-field resize-none" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary w-full py-3.5">Send Message</button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl p-5 flex items-center gap-4 shadow-card">
                <span className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-accent" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted mb-0.5">{label}</p>
                  <p className="font-semibold text-slateText dark:text-white">{value}</p>
                </div>
              </div>
            ))}

            <div className="bg-navy dark:bg-navy-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Need help fast?</h3>
              <p className="text-sm text-white/70 mb-4">
                Check out our FAQ or browse the shop while you wait — most questions are answered there.
              </p>
              <a href="mailto:electrocart@gmail.com" className="w-full text-center block bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Email Support
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}