'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { useLanguage } from '@/app/context/LanguageContext'

const navItems = [
    { labelKey: 'nav.men', link: '/men' },
    { labelKey: 'nav.women', link: '/women' },
    { labelKey: 'nav.kids', link: '/kids' },
    { labelKey: 'nav.running', link: '/running' },
    { labelKey: 'nav.lifestyle', link: '/lifestyle' },
    { labelKey: 'nav.jordan', link: '/jordan' },
    { labelKey: 'nav.sale', link: '/sale', sale: true },
]

export default function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const { language, setLanguage, t } = useLanguage()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed left-0 top-0 z-50 w-full">
            <div
                className={`py-2 text-xs transition-colors duration-200 ${
                    isScrolled
                        ? 'border-b border-zinc-200 bg-white text-zinc-950'
                        : 'bg-black text-white'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/stores" className="hover:underline">{t('nav.findStore')}</Link>
                        <Link href="/help" className="hover:underline">{t('nav.help')}</Link>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/register" className="hover:underline">{t('nav.join')}</Link>
                        <Link href="/login" className="hover:underline">{t('nav.signIn')}</Link>
                        <div className="flex items-center gap-1 font-black uppercase">
                            <button
                                type="button"
                                onClick={() => setLanguage('np')}
                                className={language === 'np' ? 'underline underline-offset-4' : 'opacity-70 hover:opacity-100'}
                                aria-pressed={language === 'np'}
                            >
                                NP
                            </button>
                            <span className="opacity-45">/</span>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={language === 'en' ? 'underline underline-offset-4' : 'opacity-70 hover:opacity-100'}
                                aria-pressed={language === 'en'}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <nav
                className={`border-b text-zinc-950 transition-colors duration-200 ${
                    isScrolled
                        ? 'border-zinc-200 bg-white shadow-sm'
                        : 'border-white/70 bg-white/92 backdrop-blur-md'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center" aria-label="Nike home">
                        <Image src="/nike1.png" alt="Nike Logo" width={112} height={64} priority />
                    </Link>

                    <div className="hidden items-center gap-8 text-sm font-black text-zinc-950 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.labelKey}
                                href={item.link}
                                className={`transition-colors ${
                                    item.sale
                                        ? 'text-red-600 hover:text-red-500'
                                        : 'text-zinc-950 hover:text-zinc-500'
                                }`}
                            >
                                {t(item.labelKey)}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => setSearchOpen((open) => !open)}
                            className="text-zinc-950 transition-colors hover:text-zinc-500"
                            aria-label={t('nav.searchLabel')}
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            className="text-zinc-950 md:hidden"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label={t('nav.menuLabel')}
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {searchOpen && (
                    <div className="border-t border-zinc-200 bg-white px-6 py-4 text-zinc-950">
                        <div className="mx-auto max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder={t('nav.searchPlaceholder')}
                                    className="w-full rounded-full bg-zinc-100 py-3 pl-11 pr-4 text-sm text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white pt-20 text-zinc-950 md:hidden">
                    <div className="flex flex-col px-6 text-lg font-black">
                        {navItems.map((item) => (
                            <Link
                                key={item.labelKey}
                                href={item.link}
                                className={`border-b border-zinc-200 py-5 ${
                                    item.sale ? 'text-red-600' : 'text-zinc-950'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t(item.labelKey)}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
