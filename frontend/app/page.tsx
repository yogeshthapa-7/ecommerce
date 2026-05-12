'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'
import CircularGalleryDemo from '@/components/customers'
import DemoOne from '@/components/FullScreenScroll'
import Demo from '@/components/LandingFooter'
import LandingNavbar from '@/components/LandingNavbar'
import NikeTechBento from '@/components/nikeFeatures'
import { BentoGridGalleryDemo } from '@/components/nikeImages'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { useLanguage } from '@/app/context/LanguageContext'

const featuredShoes = [
    {
        nameKey: 'featuredShoes.nikeSystem',
        labelKey: 'featuredShoes.flagship',
        src: 'https://media.wired.com/photos/63728604691ed08cc4b98976/3:2/w_2560%2Cc_limit/Nike-Swoosh-News-Gear.jpg',
    },
    {
        nameKey: 'featuredShoes.adidasSuperstar',
        labelKey: 'featuredShoes.street',
        src: 'https://aadimanepal.com/cdn/shop/files/Superstar_Shoes_Black_EG4959_01_00_standard.jpg?v=1744613461&width=1214',
    },
    {
        nameKey: 'featuredShoes.newBalance',
        labelKey: 'featuredShoes.daily',
        src: 'https://www.courir.com/dw/image/v2/BCCL_PRD/on/demandware.static/-/Sites-master-catalog-courir/default/dw38fb9a82/images/hi-res/001511226_101.jpg?sw=450&sh=450&sm=fit',
    },
    {
        nameKey: 'featuredShoes.pumaSpeedcat',
        labelKey: 'featuredShoes.track',
        src: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/309452/01/sv01/fnd/SEA/fmt/png/McLAREN-RACING-Speedcat-Sneakers-Unisex',
    },
    {
        nameKey: 'featuredShoes.uaLockdown',
        labelKey: 'featuredShoes.court',
        src: 'https://www.dunhamssports.com/media/bd/17/19/1747142306/0381396571333-129_UA-GS-LOCKDOWN-6-WHT-BLK_GC.jpg?ts=1747142306',
    },
    {
        nameKey: 'featuredShoes.asicsGel',
        labelKey: 'featuredShoes.soft',
        src: 'https://www.milk-store.com/cdn/shop/files/Asics-Gel-Nyc-Graphite-Grey-Black-1.jpg?v=1724707864',
    },
    {
        nameKey: 'featuredShoes.reebokNano',
        labelKey: 'featuredShoes.training',
        src: 'https://www.reebok.co.za/cdn/shop/files/PR12860BI21562_100209363_Nano_X5_Training_Shoes_SZ4.webp?v=1750774610',
    },
]

export default function HeroSection() {
    const { t } = useLanguage()

    return (
        <main className="overflow-x-hidden bg-[#050505] text-white">
            <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black">
                <LandingNavbar />

                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://t4.ftcdn.net/jpg/03/89/92/27/360_F_389922799_AZFyYZguDeEMoUdoROgEiJqfDPih1S12.jpg"
                        alt=""
                        loading="eager"
                        decoding="async"
                        className="h-full w-full scale-105 object-cover opacity-[0.16] grayscale invert"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.62)_54%,#050505_100%)]" />
                </div>

                <div className="mx-auto grid w-full max-w-7xl items-end gap-12 px-6 pb-16 pt-40 md:grid-cols-[1fr_300px] lg:px-12 lg:pb-20">
                    <div className="max-w-5xl">
                        <p className="mb-5 text-[0.72rem] font-black uppercase tracking-[0.34em] text-white/70">
                            {t('landing.eyebrow')}
                        </p>
                        <h1 className="max-w-5xl text-balance text-[4.7rem] font-black uppercase italic leading-[0.78] tracking-normal text-white sm:text-[6.5rem] lg:text-[8.6rem] xl:text-[10rem]">
                            {t('landing.titleLine1')}
                            <br />
                            {t('landing.titleLine2')}
                        </h1>

                        <div className="mt-8 flex max-w-3xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <p className="max-w-xl text-base font-medium leading-7 text-white/72 md:text-lg">
                                {t('landing.subtitle')}
                            </p>
                            <div className="h-[3px] w-20 shrink-0 bg-red-600" />
                        </div>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Button asChild variant="nike" size="hero">
                                <Link href="./nike">
                                    {t('landing.homeCta')}
                                    <ArrowUpRight className="size-5" />
                                </Link>
                            </Button>

                            <Button asChild variant="nikeOutline" size="hero">
                                <Link href="./nike/explore">
                                    <Play className="size-4 fill-current" />
                                    {t('landing.videoCta')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="hidden border-l border-white/16 pl-7 text-sm text-white/68 md:block">
                        <p className="font-black uppercase tracking-[0.24em] text-white">{t('landing.sideTitle')}</p>
                        <p className="mt-4 leading-6">
                            {t('landing.sideCopy')}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/48 md:flex">
                    {t('landing.scroll')}
                    <div className="mt-3 h-10 w-px bg-gradient-to-b from-white/0 via-white/45 to-white/0" />
                </div>
            </section>

            <section className="border-y border-zinc-200 bg-white py-6 text-zinc-950">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 md:flex-row md:items-center lg:px-12">
                    <div className="md:w-56 md:border-r md:border-zinc-200 md:pr-8">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-zinc-500">{t('landing.featuredEyebrow')}</p>
                        <p className="mt-2 text-sm font-semibold text-zinc-950">{t('landing.trusted')}</p>
                    </div>

                    <div className="relative min-w-0 flex-1 py-2">
                        <InfiniteSlider duration={36} durationOnHover={58} gap={24}>
                            {featuredShoes.map((shoe) => (
                                <article
                                    key={shoe.nameKey}
                                    className="flex h-28 w-[210px] shrink-0 items-center gap-4 rounded-none border border-zinc-200 bg-zinc-50 px-4"
                                >
                                    <img
                                        className="h-20 w-20 shrink-0 object-contain mix-blend-multiply"
                                        src={shoe.src}
                                        alt={t(shoe.nameKey)}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black uppercase tracking-normal text-zinc-950">{t(shoe.nameKey)}</p>
                                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{t(shoe.labelKey)}</p>
                                    </div>
                                </article>
                            ))}
                        </InfiniteSlider>

                        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
                        <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-14" direction="left" blurIntensity={0.35} blurLayers={3} />
                        <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-14" direction="right" blurIntensity={0.35} blurLayers={3} />
                    </div>
                </div>
            </section>

            <DemoOne />

            <div className="[&>*]:[content-visibility:auto] [&>*]:[contain-intrinsic-size:900px]">
                <BentoGridGalleryDemo />
                <NikeTechBento />
                <CircularGalleryDemo />
                <Demo />
            </div>
        </main>
    )
}
