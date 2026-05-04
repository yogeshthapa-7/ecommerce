'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            {/* 1. Top Thin Bar */}
            <div className={`text-xs py-2 transition-colors duration-300 
                ${isScrolled ? 'bg-white border-b dark:bg-black' : 'bg-black text-white'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/stores" className="hover:underline">Find a Store</Link>
                        <Link href="/help" className="hover:underline">Help</Link>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/join" className="hover:underline">Join Us</Link>
                        <Link href="/login" className="hover:underline">Sign In</Link>
                        <div className="flex items-center gap-1 cursor-pointer hover:underline">
                            🇳🇵 EN
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Navbar */}
            <nav className={`border-b transition-all duration-300 
                ${isScrolled ? 'bg-white shadow-sm dark:bg-black' : 'bg-white/95 dark:bg-black/95 backdrop-blur-md'}`}>

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-bold tracking-[-2px]">
                        <Image src="/nike1.png" alt="Nike Logo" width={100} height={100} />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/men" className="hover:text-gray-500 transition-colors">Men</Link>
                        <Link href="/women" className="hover:text-gray-500 transition-colors">Women</Link>
                        <Link href="/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
                        <Link href="/running" className="hover:text-gray-500 transition-colors">Running</Link>
                        <Link href="/lifestyle" className="hover:text-gray-500 transition-colors">Lifestyle</Link>
                        <Link href="/jordan" className="hover:text-gray-500 transition-colors">Jordan</Link>
                        <Link href="/sale" className="text-red-600 hover:text-red-500 transition-colors">Sale</Link>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-5">
                        
                        {/* Search */}
                        <button 
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="hover:scale-110 transition-transform"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Expanded Search Bar */}
                {searchOpen && (
                    <div className="border-t bg-white dark:bg-black px-6 py-4">
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search shoes, collections, and more..."
                                    className="w-full bg-gray-100 dark:bg-zinc-900 pl-11 py-3 rounded-full text-sm focus:outline-none"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Full Screen Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-white dark:bg-black z-50 md:hidden pt-20">
                    <div className="flex flex-col px-6 text-lg font-medium">
                        {[
                            { name: 'Men', link: '/men' },
                            { name: 'Women', link: '/women' },
                            { name: 'Kids', link: '/kids' },
                            { name: 'Running', link: '/running' },
                            { name: 'Lifestyle', link: '/lifestyle' },
                            { name: 'Jordan', link: '/jordan' },
                            { name: 'Sale', link: '/sale' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.link}
                                className="py-5 border-b border-gray-200 dark:border-gray-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}