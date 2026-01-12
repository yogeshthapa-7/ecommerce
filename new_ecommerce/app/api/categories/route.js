import { NextResponse } from "next/server"

const categories = [
  {
    id: "1",
    name: "Shoes",
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/47b7945e-a379-4c24-b9df-98f4eef178e5/NIKE+AIR+MAX+PLUS.png",
    products: 42,
    status: "Active",
  },
  {
    id: "2",
    name: "Hoodies",
    image: "https://cdn.media.amplience.net/i/frasersdev/53101203_o?fmt=auto&upscale=false&w=767&h=767&sm=scaleFit&$h-ttl$",
    products: 18,
    status: "Active",
  },
  {
    id: "3",
    name: "Bags",
    image: "https://i8.amplience.net/i/jpl/jd_ANZ0126710_a?qlt=92",
    products: 10,
    status: "Hidden",
  },
  {
    id: "4",
    name: "Shorts",
    image: "https://soccerpost.com/cdn/shop/products/nike_park_iii_shorts_apparel.jpg?v=1740753668&width=1047",
    products: 20,
    status: "Active",
  },
  {
    id: "5",
    name: "Jerseys",
    image: "https://thesoccerfactory.com/cdn/shop/files/NikeParkVIIMens-Black.jpg?v=1752063507&width=1000",
    products: 22,
    status: "Active",
  },
  {
    id: "6",
    name: "Tops",
    image: "https://cdn-images.farfetch-contents.com/23/02/90/79/23029079_53346247_1000.jpg",
    products: 26,
    status: "Active",
  },
  {
    id: "7",
    name: "Leggings",
    image: "https://www.goaliemonkey.com/media/catalog/product/cache/a848536da192a0c5bb969d0898e6ec13/n/i/nike-undergarmets-just-do-it-power-training-tights-wmn_1.jpg",
    products: 13,
    status: "Active",
  },
  {
    id: "8",
    name: "Gym-Bra",
    image: "https://www.nikys-sports.com/cdn/shop/files/AURORA_DJ8523-010_PHSFH001-2000.jpg?v=1686777182",
    products: 10,
    status: "Active",
  },
]

export async function GET() {
  return NextResponse.json(categories)
}