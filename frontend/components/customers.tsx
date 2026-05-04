import React from 'react';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

const galleryData: GalleryItem[] = [
	{
		common: 'Oliver Smith',
		binomial: 'Verified Buyer',
		photo: {
			url: 'https://img.businessoffashion.com/resizer/v2/4I5Y57LWTBD4TK6XQRKXAZYQBA.jpg?auth=d83dff84e43d286c35bd510c4eb303246d9f47f097181efd389f8c4af0270496&width=1440',
			text: 'Absolutely love my Air Max 270. Most comfortable shoes I\'ve ever owned. Perfect for all day wear!',
			pos: '47% 35%',
			by: 'Nike Air Max 270'
		}
	},
	{
		common: 'Marcus Williams',
		binomial: 'Professional Athlete',
		photo: {
			url: 'https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwd6130b2c/nk/eab/e/8/3/a/f/eabe83af_7cfa_4604_b770_93c8d0fc9f9c.jpg?sw=2000&sh=2000&sm=fit',
			text: 'Training in Nike React has transformed my workouts. Responsive cushioning and incredible durability.',
			pos: '75% 65%',
			by: 'Nike React Infinity'
		}
	},
	{
		common: 'David Kim',
		binomial: 'Sneaker Collector',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HJ3792-010_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Customer service was exceptional. Fast shipping, authentic products. My go-to for all Nike gear.',
			pos: '53% 43%',
			by: 'Air Force 1'
		}
	},
	{
		common: 'Emily Chen',
		binomial: 'Fitness Enthusiast',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/8/c/8ceba2eNike-IQ3747-070_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Best running shoes I\'ve purchased. Zoom technology gives me that extra push during morning runs.',
			pos: '65% 65%',
			by: 'Nike Zoom Pegasus'
		}
	},
	{
		common: 'Mei Lin',
		binomial: 'Daily Commuter',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-DX7907-010_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Wore these Dunks for 12 hours straight. No foot pain at all. Quality craftsmanship at its finest.',
			pos: '50% 25%',
			by: 'Nike Dunk Low'
		}
	},
	{
		common: 'James Rodriguez',
		binomial: 'Basketball Player',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-FV8963-010_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Jordan 1s never disappoint. Classic style meets modern comfort. Worth every single penny.',
			pos: '47%',
			by: 'Air Jordan 1 Retro'
		}
	},
	{
		common: 'Luca Romano',
		binomial: 'Yoga Instructor',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-HV0425-010_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Flyknit technology is game changing. Lightweight, breathable, fits like a second skin.',
			pos: '65% 35%',
			by: 'Nike Flyknit Racer'
		}
	},
	{
		common: 'Alex Thompson',
		binomial: 'Marathon Runner',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-IH1128-100_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'Completed my first marathon in Vaporflys. Unbelievable energy return. Changed my performance entirely.',
			by: 'Nike Vaporfly Next%'
		}
	},
	{
		common: 'Lisa Ann',
		binomial: 'Street Style Icon',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/1/c/1c9034cNike-IO8723-010_1.jpg?rnd=20200526195200&tr=w-1080',
			text: 'The packaging, the quality, the attention to detail. Nike never misses when it comes to delivery.',
			pos: '35%',
			by: 'Nike Blazer Mid'
		}
	},
	{
		common: 'Grace Thompson',
		binomial: 'Gym Trainer',
		photo: {
			url: 'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/5/3/5324c8eNike-BV6176-100_1.jpg?rnd=20200526195200&tr=w-1080',
			text: '10+ years training in Nike shoes. Consistent quality, innovative designs. Always my first choice.',
			by: 'Nike Metcon'
		}
	},
];

const CircularGalleryDemo = () => {
  return (
    <div className="w-full bg-black text-white py-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Customer Gallery</h1>
          <p className="text-gray-400">Use arrows to rotate the gallery</p>
        </div>
        <div className="w-full h-[600px]">
          <CircularGallery items={galleryData} />
        </div>
      </div>
    </div>
  );
};

export default CircularGalleryDemo;
