import { NextResponse } from "next/server"

const products = [
     {
      "id": "nk-001",
      "name": "Nike Air Max 270",
      "category": "Shoes",
      "price": 160.00,
      "status": "active",
      "currency": "$",
      "rating": 4.8,
      "reviews_count": 1240,
      "colors": [
         {"name":"White",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/gorfwjchoasrrzr1fggt/AIR+MAX+270.png"
        }
        , 
        {"name":"Multi-Color",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/c79654db-d568-4e5e-b0d7-90b6df387d7e/AIR+MAX+270.png"
        }
      ],
      "description": "Nike's first lifestyle Air Max brings you style, comfort and big attitude. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/da58f543-363c-4a2e-8a27-3ffc3cf7357b/AIR+MAX+270.png",
      "in_stock": true,
      "sizes": [7, 8, 9, 10, 11],
      
    },
    {
      "id": "nk-002",
      "name": "Nike Air Max Plus",
      "category": "Shoes",
      "status": "active",
      "price": 115.00,
      "currency": "$",
      "rating": 4.9,
      "reviews_count": 5600,
      "colors": [
        {"name":"White",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/lx0owmisj943sr59emb8/AIR+MAX+PLUS.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/877d30e7-4880-46f8-aa71-6704eb7d944d/AIR+MAX+PLUS.png"
        }
        , 
        {"name":"Reflect Silver/Hyper Jade",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/da2fdf87-5fe3-4292-9def-3433f99116ea/AIR+MAX+PLUS.png"
        }
      ],
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fea9fd17-a50b-4d72-9eba-60a632b756cc/AIR+MAX+PLUS.png",
      "description": "The radiance lives on in the Nike Air Force 1 '07, the b-ball OG that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
      "in_stock": true,
      "sizes": [8, 9, 10, 11]
    },
    {
      "id": "nk-003",
      "name": "Nike Pegasus 41",
      "category": "Shoes",
      "status": "active",
      "price": 130.00,
      "currency": "$",
      "rating": 4.5,
      "reviews_count": 890,
      "colors": [
         {"name":"White",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/9bcb6197-54bd-47e6-9e61-9be30ce32a35/W+AIR+ZOOM+PEGASUS+41.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4c211688-6234-426c-b847-e1b6e7d14b06/W+AIR+ZOOM+PEGASUS+41.png"
        }
        , 
        {"name":"Twist/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/68e34988-93aa-4f41-9254-29c6a477a2e5/W+AIR+ZOOM+PEGASUS+41.png"
        }
         , 
        {"name":"Gray/Diffused Blue",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/34c4b85a-ae5b-42b4-9201-57623bfeb685/W+AIR+ZOOM+PEGASUS+41.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://www.nike.sa/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw51c9c38a/nk/39b/c/2/d/9/2/39bc2d92_446a_4c28_a3d4_a75726ee8499.jpg?sw=520&sh=520&sm=fit",
      "in_stock": false,
      "sizes": [8, 9, 10]
    },
    {
      "id": "nk-004",
      "name": "Nike Blazer",
      "category": "Shoes",
      "status": "active",
      "price": 150.00,
      "currency": "$",
      "rating": 4.7,
      "reviews_count": 890,
      "colors": [
        {"name":"White/Sail/Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fca59736-ff84-4797-9e64-0978d3b43731/BLAZER+LOW+%2777+VNTG.png"
        }, 
        {"name":"Black/Sail/Black/White",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/3dbd02fc-6c4d-419f-b706-8293ed200d14/BLAZER+LOW+%2777+VNTG.png"
        }
        , 
        {"name":"Black/Anthracite/White/University Red",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/22d00deb-2a88-4c8b-9569-a911667e31da/BLAZER+LOW+%2777+VNTG.png"
        }
         , 
        {"name":"White/Sail/Black/Pine Green",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/f450b123-2c17-48d5-9329-cc4c87dd604c/BLAZER+LOW+%2777+VNTG.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/8371a7ff-046d-4d7c-a89c-4d84434b2d42/BLAZER+LOW+%2777+VNTG.png",
      "in_stock": false,
      "sizes": [8, 9, 10]
    },
     {
      "id": "nk-005",
      "name": "Nike Huarache",
      "category": "Shoes",
      "status": "active",
      "price": 100.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
        {"name":"White",
          "image_url":"https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/844d1e27-a857-4172-b42c-0a60468620c8/custom-huarache-run-by-you.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/4d07f78c-ffa7-4623-944d-9e2da4a7a0ae/custom-huarache-run-by-you.png"
        }
        , 
        {"name":"Red",
          "image_url": "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/7d4782da-3e47-43a8-8ecf-680a28bdac8b/custom-huarache-run-by-you.png"
        }
         , 
        {"name":"Multi-Color",
          "image_url": "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/81bd9565-e138-47d0-8d33-93598e01df05/custom-huarache-run-by-you.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/c4a57a05-4dc0-4126-b457-9aac551787bb/custom-huarache-run-by-you.png",
      "in_stock": true,
      "sizes": [8, 9, 10]
    },
     {
      "id": "nk-006",
      "name": "Nike Run Defy",
      "category": "Shoes",
      "status": "active",
      "price": 200.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
        {"name":"White/Mint Foam",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d91b0036-8a9d-4ca2-a16e-180d93a2ad9c/NIKE+RUN+DEFY.png"
        }, 
        {"name":"Black/White",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/503220d8-e123-48a6-be64-3dc019e5bdc1/NIKE+RUN+DEFY.png"
        }
        , 
        {"name":"Orange/White/Bright Crimson",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/3b02011b-c120-4035-a279-4a7cecd7525b/NIKE+RUN+DEFY.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/9de5f0c3-b628-40fa-b322-20ae0d0e7794/NIKE+RUN+DEFY.png",
      "in_stock": false,
      "sizes": [8, 10, 12]
    },
     {
      "id": "nk-007",
      "name": "Jordan Spizike Low",
      "category": "Shoes",
      "status": "active",
      "price": 250.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
        {"name":"Black/Anthracite",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/baa198e9-f145-47cd-9ada-f0ae7848b349/JORDAN+SPIZIKE+LOW.png"
        }, 
        {"name":"Black/Wolf Grey",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b5563ef0-5697-4046-8158-6e3412128060/JORDAN+SPIZIKE+LOW.png"
        }
        , 
        {"name":"Black/Gamma Blue",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/be7e610a-909a-4f66-8dc6-5d9cccbe8109/JORDAN+SPIZIKE+LOW.png"
        }
         , 
        {"name":"Sail/Oil Grey",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/ef21e1a2-7bab-4068-96ae-f47b7f2ddd7c/JORDAN+SPIZIKE+LOW.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/25b161c1-f857-4d59-8439-ac8406eab533/JORDAN+SPIZIKE+LOW.png",
      "in_stock": false,
      "sizes": [9, 10, 11]
    },
     {
      "id": "nk-008",
      "name": "Nike Metcon 10",
      "category": "Shoes",
      "status": "active",
      "price": 180.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
         {"name":"Black/Anthracite/White",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d5392fe6-e83d-4950-81bc-260b68a665bf/M+NIKE+METCON+10.png"
        }, 
        {"name":"Black/Safety Orange",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1e1de28e-b679-49dc-81ec-a2102de1c565/M+NIKE+METCON+10.png"
        }
        , 
        {"name":"Vast Grey/Blue Hero",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1a98c69e-da24-429d-bb1e-977e623dbf39/M+NIKE+METCON+10.png"
        }
         , 
        {"name":" Green Strike/Light Liquid Lime",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/c47b7cdc-6e2b-4675-857c-97a7839e98ac/M+NIKE+METCON+10.png"
        }
      ],
      "description": "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a69130cc-790a-485d-a04e-103d9915558f/M+NIKE+METCON+10.png",
      "in_stock": true,
      "sizes": [10, 11, 13]
    },
     {
      "id": "nk-009",
      "name": "Nike Gym Bag",
      "category": "Bags",
      "status": "active",
      "price": 180.00,
      "currency": "$",
      "rating": 4.4,
      "reviews_count": 890,
      "colors": [
         {"name":"Desert Khaki/Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/12031da9-3d10-4576-bf59-5b71f57906f5/NK+BRSLA+M+DUFF+-+9.5+%2860L%29.png"
        }, 
        {"name":"Iron Grey/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a30b33c5-1e09-4059-9eab-dbc991681fa6/NK+BRSLA+M+DUFF+-+9.5+%2860L%29.png"
        }
        , 
        {"name":"Laser Fuchsia/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4e06d435-4e84-4955-953d-7a5834280a44/NK+BRSLA+M+DUFF+-+9.5+%2860L%29.png"
        }
         , 
        {"name":"Burnt Sunrise/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/eadc6a23-c191-4f55-846e-d1ba4ef0d3f2/NK+BRSLA+M+DUFF+-+9.5+%2860L%29.png"
        }
      ],
      "description": "Simple and sleek design — the perfect compact companion for your fitness goals. It holds all essentials (shoes, clothes, gear) without unnecessary bulk, featuring a double-zip main compartment and handy front pocket for organization.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/45dc46c4-e3ad-4924-8ec7-b1638a869864/NK+BRSLA+M+DUFF+-+9.5+%2860L%29.png",
      "in_stock": true,
      "sizes": ['One Size']
    },
     {
      "id": "nk-010",
      "name": "Nike Academy",
      "category": "Bags",
      "status": "active",
      "price": 144.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
         {"name":"Limelight/Hyper Crimson",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a8c0581a-ee7b-464e-9381-ee033f7675b1/NK+ACDMY+SHOEBAG+-+SP21.png"
        }, 
        {"name":"Black/Sunset Pulse",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/f722ff77-70b2-4f77-a157-1f41dacf33cd/NK+ACDMY+SHOEBAG+-+SP21.png"
        }
        , 
        {"name":"Black/White",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a0934678-44c6-4205-8e82-bd37b12f05d6/NK+ACDMY+SHOEBAG+-+SP21.png"
        }
         , 
        {"name":"Black/Ember Glow",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/c0600bdc-8fa6-4fc5-a369-c932cd49a6ed/NK+ACDMY+SHOEBAG+-+SP21.png"
        }
      ],
      "description": "Reliable and spacious — the go-to choice for travel, gym, or weekend trips. Features a large main compartment, ventilated shoe pocket, multiple zip pockets for organization, and tough, water-resistant material.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/79ce240a-355a-4776-b37a-399bcd875097/NK+ACDMY+SHOEBAG+-+SP21.png",
      "in_stock": true,
      "sizes": ['One Size']
    },
     {
      "id": "nk-011",
      "name": "Nike Heritage",
      "category": "Bags",
      "status": "active",
      "price": 130.00,
      "currency": "$",
      "rating": 4.4,
      "reviews_count": 890,
      "colors": [
        {"name":"Light Bone",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/32cbe6df-ae22-48b0-a872-f1f4ceb8fc44/NK+HERITAGE+EUGENE+WNTRZD+BKPK.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2ac1e621-4204-42c2-b6aa-c87348f1856f/NK+HERITAGE+EUGENE+WNTRZD+BKPK.png"
        }
        , 
        {"name":"Desert Khaki",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/3de12f74-5cde-4e7c-a96a-f204500b57dd/NK+HERITAGE+EUGENE+WNTRZD+BKPK.png"
        }
      ],
      "description": "Durable and stylish, this backpack is designed for athletes on the go. It features multiple compartments for gear organization, padded straps for comfort, and a sleek design that fits both sports and casual settings.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a6c1994f-c854-4dcd-97f9-ffbe2cf919e5/NK+HERITAGE+EUGENE+WNTRZD+BKPK.png",
      "in_stock": true,
      "sizes": ['One Size']
    },
     {
      "id": "nk-012",
      "name": "Nike Varsity Elite",
      "category": "Bags",
      "status": "active",
      "price": 110.00,
      "currency": "$",
      "rating": 4.2,
      "reviews_count": 890,
      "colors": [
         {"name":"Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d36703c7-26c0-414b-933d-98153045f904/NK+VARSITY+ELITE+BKPK.png"
        }, 
        {"name":"Midnight Navy/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/048faeb9-6f45-4edb-996a-9daf47a28087/NK+VARSITY+ELITE+BKPK.png"
        }
        , 
        {"name":"Iron Grey/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/80ee1ef4-e12a-4240-b471-584c26b80f0d/NK+VARSITY+ELITE+BKPK.png"
        }
      ],
      "description": "Spacious and functional, this basketball backpack is perfect for carrying all your gear. It includes a dedicated ball compartment, multiple pockets for organization, and padded straps for comfortable carrying.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/80ee1ef4-e12a-4240-b471-584c26b80f0d/NK+VARSITY+ELITE+BKPK.png",
      "in_stock": false,
      "sizes": ['One Size']
    },
     {
      "id": "nk-013",
      "name": "Nike Tech",
      "category": "Hoodies",
      "status": "active",
      "price": 97.00,
      "currency": "$",
      "rating": 4.0,
      "reviews_count": 890,
      "colors": [
         {"name":"Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/dbcb43d1-d508-4275-b239-f988667d5001/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png"
        }, 
        {"name":"Dark Grey Heather",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/7deb0efc-4a47-4ac3-8abf-ae49b4f33b50/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png"
        }
        , 
        {"name":"Deep Night/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1ea84444-c13c-4a3b-b59d-fbaa19113ec8/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png"
        }
        , 
        {"name":"Black Heather",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2ae58a64-0016-4cc2-9da4-f2a244224a73/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png"
        }
      ],
      "description": "Comfort meets style in this classic pullover hoodie. Made from soft, durable fabric, it features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs and hem for a snug fit. Perfect for layering or wearing on its own.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1e2ee5a9-ba27-45ef-89c2-9323685d1ea1/AS+M+NK+TCH+FLC+FZ+WR+HOODIE.png",
      "in_stock": true,
      "sizes": ['S', 'M', 'L', 'XL']
    },
     {
      "id": "nk-014",
      "name": "Nike Club Fleece",
      "category": "Hoodies",
      "status": "active",
      "price": 100.00,
      "currency": "$",
      "rating": 4.3,
      "reviews_count": 890,
      "colors": [
         {"name":"Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/57541f92-d8f8-4129-a75e-03fe16f51225/AS+M+NK+CLUB+FT+OVERSIZED+CREW.png"
        }, 
        {"name":"Dark-Gray",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/977c9f76-b7d5-484a-bf0c-4fed5f42da8c/AS+M+NK+CLUB+FT+OVERSIZED+CREW.png"
        }
        , 
        {"name":"Birch Heather/White",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4f3aba9d-5aff-4d0e-8a0c-4b7073c71e51/AS+M+NK+CLUB+FT+OVERSIZED+CREW.png"
        }
        , 
        {"name":"Sail/Sail/Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b48fe91b-1e3f-4bc4-9673-dbc65c1172c5/AS+M+NK+CLUB+FT+OVERSIZED+CREW.png"
        }
      ],
      "description": "A cozy, standard-fit fleece sweatshirt with a soft interior, ideal for training or casual wear, featuring an adjustable drawcord hood, front pocket (kangaroo or zip), ribbed cuffs, and made from a cotton-polyester blend for warmth and comfort",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/6e44a98b-7f8b-4774-8325-f5a0b53ec4e0/AS+M+NK+CLUB+FT+OVERSIZED+CREW.png",
      "in_stock": true,
      "sizes": ['S', 'M', 'L', 'XL']
    },
     {
      "id": "nk-015",
      "name": "Nike 24.7 ImpossiblySoft-Women",
      "category": "Hoodies",
      "price": 87.00,
      "status": "active",
      "currency": "$",
      "rating": 4.6,
      "reviews_count": 890,
      "colors": [
         {"name":"Black",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/99392088-76e5-4482-a045-d9bec81035fe/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png"
        }, 
        {"name":"Light Orewood Brown",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0c205681-e97c-4412-bd82-0f0805b64009/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png"
        }
        , 
        {"name":"Sail/Light Bone",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/592fb214-1a68-4ea2-8c96-8eb28fbad579/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png"
        }
        , 
        {"name":"Midnight Navy/Dark Obsidian",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/6b381b34-816c-4dd0-9ee4-679952b2f0a2/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png"
        }
      ],
      "description": "Soft and warm, this fleece hoodie is perfect for cooler days. It features a brushed interior for added comfort, a front kangaroo pocket, and an adjustable drawstring hood. Made from a cotton-polyester blend, it's designed to keep you cozy during workouts or casual outings.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/07f6d541-4f83-4fca-b99d-8df9455ab8cd/AS+W+NK+24.7+DF+HZ+TOP+SOFT.png",
      "in_stock": true,
      "sizes": ['S', 'M', 'L', 'XL']
    },
     {
      "id": "nk-016",
      "name": "Fleece Full-Zip Hoodie",
      "category": "Hoodies",
      "status": "active",
      "price": 95.00,
      "currency": "$",
      "rating": 4.7,
      "reviews_count": 890,
      "colors": [
         {"name":"White",
          "image_url":"https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/8af54c4e-418f-4c66-969a-745fb3155211/AS+M+NK+TECH+FLC+PRO+WR+FZ+JKT.png"
        }, 
        {"name":"Black",
          "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b55eb304-d2d5-4a8c-aa14-51742b729bab/AS+M+NK+TECH+FLC+PRO+WR+FZ+JKT.png"
        }
      ],
      "description": "A versatile full-zip hoodie made from soft fleece fabric, perfect for layering. It features a full-length zipper, adjustable drawstring hood, and front pockets for convenience. The ribbed cuffs and hem provide a snug fit, making it ideal for workouts or casual wear.",
      "image_url": "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/590c1fd6-0af1-4312-862a-530b9c3b10a0/AS+M+NK+TECH+FLC+PRO+WR+FZ+JKT.png",
      "in_stock": true,
      "sizes": ['S', 'M', 'L', 'XL']
    }
  ];

  export async function GET() {
      return NextResponse.json(products)
    }