import React from 'react';
import { Twitter, Instagram, Music2 } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="text-4xl font-bold tracking-tighter">Retailen</div>

                        <div className="flex flex-col gap-4 max-w-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">subscribe for newsletter</span>
                            <div className="flex bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="flex-1 bg-transparent px-4 py-3 text-xs focus:outline-none"
                                />
                                <button className="bg-[#0c121e] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                    Submit
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-slate-900 hover:text-white transition-all">
                                <Twitter size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-slate-900 hover:text-white transition-all">
                                <Instagram size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-slate-900 hover:text-white transition-all">
                                <Music2 size={14} />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Company</h4>
                            <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                                <li><a href="#" className="hover:text-black transition-colors">About Retailen</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Blogs</a></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Product</h4>
                            <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                                <li><a href="#" className="hover:text-black transition-colors">Chairs</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Tables</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Beds</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Sofas</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Desks</a></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Help</h4>
                            <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                                <li><a href="#" className="hover:text-black transition-colors">Customer service</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Track Order</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Return & Refunds</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Shipping Information</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Warranty</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Career</a></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Contact</h4>
                            <ul className="flex flex-col gap-4 text-xs font-medium text-gray-500">
                                <li><a href="mailto:hello@retailen.com" className="hover:text-black transition-colors">hello@retailen.com</a></li>
                                <li><a href="tel:8773089873" className="hover:text-black transition-colors">877-308-9873 (TOLL FREE)</a></li>
                                <li className="leading-relaxed">7511 Elgin St. green dist</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-medium text-gray-400 flex gap-4">
                        <a href="#" className="hover:text-black">Privacy</a>
                        <span>|</span>
                        <a href="#" className="hover:text-black">Terms and Conditions</a>
                    </div>

                    <div className="text-[10px] font-medium text-gray-400">
                        © Retailen 2025 All rights reserved
                    </div>

                    <div className="flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-4 w-6 bg-slate-100 rounded flex items-center justify-center text-[5px] font-bold text-blue-800">VISA</div>
                        <div className="h-4 w-6 bg-slate-100 rounded flex items-center justify-center text-[5px] font-bold text-blue-600">stripe</div>
                        <div className="h-4 w-6 bg-slate-100 rounded flex items-center justify-center text-[5px] font-bold text-blue-900">PayPal</div>
                        <div className="h-4 w-6 bg-slate-100 rounded flex items-center justify-center text-[5px] font-bold text-black flex items-center gap-[1px]"><span>Pay</span></div>
                        <div className="h-4 w-6 bg-slate-100 rounded flex items-center justify-center text-[5px] font-bold text-gray-700 flex items-center gap-[1px]"><span className="text-blue-500">G</span><span>Pay</span></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;