'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { ChevronRight, Play } from 'lucide-react'
import LandingNavbar from '@/components/LandingNavbar'
import ZoomParallel from '@/components/ZoomParallel'
import DemoOne from '@/components/FullScreenScroll'
import {BentoGridGalleryDemo} from '@/components/nikeImages'
import NikeTechBento from '@/components/nikeFeatures'
import CircularGalleryDemo from '@/components/customers'
import Demo from '@/components/LandingFooter'


export default function HeroSection() {
    return (
      
        <main className="overflow-x-hidden">
            <section className="relative min-h-screen flex items-center justify-center bg-black">

<LandingNavbar/>
    {/* NEW: Transparent Nike Image/Logo */}
  <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
            src="https://t4.ftcdn.net/jpg/03/89/92/27/360_F_389922799_AZFyYZguDeEMoUdoROgEiJqfDPih1S12.jpg" 
            alt="Nike Background"
            className="h-full w-full object-cover opacity-10 grayscale invert" 
        />
    </div>

    {/* Dark overlay for better text readability */}
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90"></div>


                {/* Main Content */}
                <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-12">
                    <div className="max-w-4xl mx-auto">
                      {/* Small pre-headline */}
<p className="text-xs md:text-sm tracking-[0.3em] text-white font-black uppercase mb-2">
    NEW ARRIVALS
</p>

{/* Main Headline */}
<h1 className="text-balance text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] leading-[0.85] font-black text-white italic tracking-tighter uppercase italic">
    WIN ON<br />YOUR TERMS.
</h1>

{/* Subheadline */}
<div className="mt-8 flex flex-col items-center">
    <p className="max-w-md text-base md:text-lg text-white/70 font-medium leading-relaxed">
        Push past your limits with the next generation of Air Max. 
        Engineered for the bold, designed for the relentless.
    </p>
    
    {/* Nike-style accent line */}
    <div className="mt-6 h-[2px] w-12 bg-red-600"></div>
</div>

                        {/* CTA Buttons */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="h-14 rounded-full bg-red-600 text-white hover:bg-red-700 text-base font-semibold px-10">
                                <Link href="./nike">
                                    Go To Homepage
                                    <ChevronRight className="ml-2" />
                                </Link>
                            </Button>

                          <Button
                                asChild
                                size="lg"
                                className="h-14 rounded-full bg-green-600 text-white hover:bg-green-700 text-base font-semibold px-10">
                                <Link href="./nike/explore">
                                    Watch the video
                                    <ChevronRight className="ml-2" />
                                </Link>
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-white/60 text-xs tracking-widest">
                    SCROLL TO EXPLORE
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent mt-2"></div>
                </div>
            </section>

            {/* Trusted By / Logos Bar */}
            <section className="bg-background py-8 border-b">
                <div className="group relative m-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="md:max-w-52 md:border-r md:pr-8 text-center md:text-right">
                            <p className="text-sm font-medium text-muted-foreground">
                                Trusted by athletes worldwide
                            </p>
                        </div>

                        <div className="relative py-6 md:w-[calc(100%-13rem)] bg-white">
                            <InfiniteSlider speedOnHover={25} speed={45} gap={100}>
                                 <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://media.wired.com/photos/63728604691ed08cc4b98976/3:2/w_2560%2Cc_limit/Nike-Swoosh-News-Gear.jpg"
        alt="Nike"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nike</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://aadimanepal.com/cdn/shop/files/Superstar_Shoes_Black_EG4959_01_00_standard.jpg?v=1744613461&width=1214"
        alt="Adidas"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Adidas Superstar</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://www.courir.com/dw/image/v2/BCCL_PRD/on/demandware.static/-/Sites-master-catalog-courir/default/dw38fb9a82/images/hi-res/001511226_101.jpg?sw=450&sh=450&sm=fit"
        alt="New Balance"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New Balance</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/309452/01/sv01/fnd/SEA/fmt/png/McLAREN-RACING-Speedcat-Sneakers-Unisex"
        alt="Puma"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Puma Speedcat</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://www.dunhamssports.com/media/bd/17/19/1747142306/0381396571333-129_UA-GS-LOCKDOWN-6-WHT-BLK_GC.jpg?ts=1747142306"
        alt="Under Armour"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Under Armour Lockdown</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://www.milk-store.com/cdn/shop/files/Asics-Gel-Nyc-Graphite-Grey-Black-1.jpg?v=1724707864"
        alt="Asics"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Asics Gel NYC</p>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <img
        className="h-15 w-fit dark:invert"
        src="https://www.reebok.co.za/cdn/shop/files/PR12860BI21562_100209363_Nano_X5_Training_Shoes_SZ4.webp?v=1750774610"
        alt="Reebok"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Reebok Nano X5</p>
    </div>
                            </InfiniteSlider>

                            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                            <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
                            <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
                        </div>
                    </div>
                </div>
            </section>
            <DemoOne />
            <BentoGridGalleryDemo />
            <NikeTechBento />
            <CircularGalleryDemo />
            <Demo />
        </main>
    )
}