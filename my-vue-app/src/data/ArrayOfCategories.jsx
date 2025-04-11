import iphone_15_pro_natural_titanium_pdp_image_position from "../assets/Smartfone/iPhone_15_pro.jpg"
import Samsung_S23 from "../assets/Smartfone/Samsung_S23.jpg"
import Xiaomi_11T from "../assets/Smartfone/Xiaomi_11T.jpg"
import Google_Pixel_8_Pro from "../assets/Smartfone/Google_P_8.jpg"
import Hiawei_30_Pro from "../assets/Smartfone/Hiawei_30_Pro.jpg"
import OnePlus_9_Pro from "../assets/Smartfone/OnePlus_9_Pro.jpg"
import Nokia_8 from "../assets/Smartfone/Nokia_8.jpg"
import Sony_Z5 from "../assets/Smartfone/Sony_Z5.jpg"
import LG_G8 from "../assets/Smartfone/LG_G8.jpg"

import iPan_Air from "../assets/tablets/iPan_Air.jpg"
import Samsung_Galaxy_Tab_S8 from "../assets/tablets/Samsung_Tab_S8.jpg"
import Xiaomi_Pad_5 from "../assets/tablets/Xiaomi_Pad_5.jpg"
import Lenovo_Tab_Plus_8 from "../assets/tablets/Lenovo_Tab_Plus.jpg"
import Lenovo_Tab_K10 from "../assets/tablets/Lenovo_Tab_K10.jpg"

import Bosh_10 from "../assets/washingMachines/Bosh_10.jpg"
import LG_10 from "../assets/washingMachines/LG_10.jpg"
import Miele_13 from "../assets/washingMachines/Miele_13.jpg"
import Bosh_15 from "../assets/washingMachines/Bocsh_15.jpg"
import LG_15 from "../assets/washingMachines/LG_15.jpg"
import Bosh_20 from "../assets/washingMachines/Bocsh_20.jpg"

import Bosch_HBJ558YB3Q from "../assets/ovens/Bosch_HBJ.jpg"
import Whirppool_Akz9_6240_Nb from "../assets/ovens/Whirppool_Akz9_6240_Nb.jpg"
import Electolux_E0f5h40bx from "../assets/ovens/Electolux_E0f5h40bx.jpg"
import Gorenje_G400_BOP6737E02BK from "../assets/ovens/Gorenje_G400_BOP6737E02BK.jpg"
import Hansa_BOES68121 from "../assets/ovens/Hansa_BOES68121.jpg"
import Whirppool_OMSK58CU1SB from "../assets/ovens/Whirppool_OMSK58CU1SB.jpg"
import Electrolux_E0f5c50bz from "../assets/ovens/Electrolux_E0f5c50bz.jpg"

import Acer_Extensa_15 from "../assets/laptops/Acer_Extensa_15.jpg"
import Asus_Vivobook_15 from "../assets/laptops/Asus_Vivobook_15.jpg"
import Dell_Vostro_3530 from "../assets/laptops/Dell_Vostro_3530.jpg"
import Lenovo_V14 from "../assets/laptops/Lenovo_V14.jpg"
import Acer_Extensa from "../assets/laptops/Acer_Extensa.jpg"
import Lenovo_IdeaPad_3 from "../assets/laptops/Lenovo_IdeaPad_3.jpg"
import Asus_Tuf from "../assets/laptops/Asus_Tuf.jpg"

import Sony_65_LED from "../assets/TV/Sony_65_LED.jpg"
import Samsung_UE32T4500A from "../assets/TV/Samsung_UE32T4500A.jpg"
import xiomiTV from "../assets/TV/xiomi.jpg";
import LG_55 from "../assets/TV/LG_55.jpg"

const categoryData = {
    phones: [
        {
            id: 'phone-1',
            name: 'iPhone 15 Pro',
            brand: 'Apple',
            image: iphone_15_pro_natural_titanium_pdp_image_position,
            variants: [
                { store: 'Rozetka', price: 42999, url: 'https://rozetka.com.ua/iphone-15-pro' },
                { store: 'Comfy', price: 43999, url: 'https://comfy.ua/iphone-15-pro' },
                { store: 'Allo', price: 41999, url: 'https://allo.ua/iphone-15-pro' }
            ]
        },
        {
            id: 'phone-2',
            name: 'Samsung Galaxy S23',
            brand: 'Samsung',
            image: Samsung_S23,
            variants: [
                { store: 'Rozetka', price: 31999, url: 'https://rozetka.com.ua/samsung-s23' },
                { store: 'Comfy', price: 32999, url: 'https://comfy.ua/samsung-s23' },
                { store: 'Foxtrot', price: 30999, url: 'https://foxtrot.com.ua/samsung-s23' }
            ]
        },
        {
            id: 'phone-3',
            name: 'Xiaomi Mi 11',
            brand: 'Xiaomi',
            image: Xiaomi_11T,
            variants: [
                { store: 'Rozetka', price: 21999, url: 'https://rozetka.com.ua/xiaomi-mi-11' },
                { store: 'Allo', price: 22999, url: 'https://allo.ua/xiaomi-mi-11' }
            ]
        },
        {
            id: 'phone-4',
            name: 'Google Pixel 8 Pro',
            brand: 'Google',
            image: Google_Pixel_8_Pro,
            variants: [
                { store: 'Rozetka', price: 38999, url: 'https://rozetka.com.ua/google-pixel-8-pro' },
                { store: 'Comfy', price: 39999, url: 'https://comfy.ua/google-pixel-8-pro' }
            ]
        },
        {
            id: 'phone-5',
            name: 'Huawei Mate 30 Pro',
            brand: 'Huawei',
            image: Hiawei_30_Pro,
            variants: [
                { store: 'Rozetka', price: 29999, url: 'https://rozetka.com.ua/huawei-mate-30-pro' },
                { store: 'Allo', price: 28999, url: 'https://allo.ua/huawei-mate-30-pro' }
            ]
        },
        {
            id: 'phone-6',
            name: 'OnePlus 9 Pro',
            brand: 'OnePlus',
            image: OnePlus_9_Pro,
            variants: [
                { store: 'Rozetka', price: 32999, url: 'https://rozetka.com.ua/oneplus-9-pro' },
                { store: 'Foxtrot', price: 33999, url: 'https://foxtrot.com.ua/oneplus-9-pro' }
            ]
        },
        {
            id: 'phone-7',
            name: 'Nokia 8.1',
            brand: 'Nokia',
            image: Nokia_8,
            variants: [
                { store: 'Rozetka', price: 17999, url: 'https://rozetka.com.ua/nokia-8-1' }
            ]
        },
        {
            id: 'phone-8',
            name: 'Sony Xperia Z5',
            brand: 'Sony',
            image: Sony_Z5,
            variants: [
                { store: 'Rozetka', price: 23999, url: 'https://rozetka.com.ua/sony-xperia-z5' },
                { store: 'Comfy', price: 24999, url: 'https://comfy.ua/sony-xperia-z5' }
            ]
        },
        {
            id: 'phone-9',
            name: 'LG G8',
            brand: 'LG',
            image: LG_G8,
            variants: [
                { store: 'Rozetka', price: 19999, url: 'https://rozetka.com.ua/lg-g8' },
                { store: 'Allo', price: 18999, url: 'https://allo.ua/lg-g8' }
            ]
        }
    ],
    tablets: [
        {
            id: 'tablet-1',
            name: 'iPad Air',
            brand: 'Apple',
            image: iPan_Air,
            variants: [
                { store: 'Rozetka', price: 28999, url: 'https://rozetka.com.ua/ipad-air' },
                { store: 'Comfy', price: 29999, url: 'https://comfy.ua/ipad-air' }
            ]
        },
        {
            id: 'tablet-2',
            name: 'Samsung Galaxy Tab S8',
            brand: 'Samsung',
            image: Samsung_Galaxy_Tab_S8,
            variants: [
                { store: 'Rozetka', price: 23999, url: 'https://rozetka.com.ua/samsung-tab-s8' },
                { store: 'Allo', price: 22999, url: 'https://allo.ua/samsung-tab-s8' }
            ]
        },
        {
            id: 'tablet-3',
            name: 'Xiaomi Pad 5',
            brand: 'Xiaomi',
            image: Xiaomi_Pad_5,
            variants: [
                { store: 'Rozetka', price: 17999, url: 'https://rozetka.com.ua/xiaomi-pad-5' },
                { store: 'Foxtrot', price: 16999, url: 'https://foxtrot.com.ua/xiaomi-pad-5' }
            ]
        },
        {
            id: 'tablet-4',
            name: 'Lenovo Tab Plus 8/256 WiFi Luna Grey',
            brand: 'Lenovo',
            image: Lenovo_Tab_Plus_8,
            variants: [
                { store: 'Rozetka', price: 12999, url: 'https://rozetka.com.ua/lenovo-tab-plus-8' }
            ]
        },
        {
            id: 'tablet-5',
            name: 'Lenovo Tab 10 4/128 WiFi Black',
            brand: 'Lenovo',
            image: Lenovo_Tab_K10,
            variants: [
                { store: 'Rozetka', price: 16999, url: 'https://rozetka.com.ua/lenovo-tab-10' },
                { store: 'Comfy', price: 15999, url: 'https://comfy.ua/lenovo-tab-10' }
            ]
        }
    ],
    washingMachines: [
        {
            id: 'wm-1',
            name: 'Bosch 10 kg',
            brand: 'Bosch',
            image: Bosh_10,
            variants: [
                { store: 'Rozetka', price: 31999, url: 'https://rozetka.com.ua/bosch-10kg' },
                { store: 'Comfy', price: 32999, url: 'https://comfy.ua/bosch-10kg' }
            ]
        },
        {
            id: 'wm-2',
            name: 'LG 10 kg',
            brand: 'LG',
            image: LG_10,
            variants: [
                { store: 'Rozetka', price: 29999, url: 'https://rozetka.com.ua/lg-10kg' },
                { store: 'Foxtrot', price: 28999, url: 'https://foxtrot.com.ua/lg-10kg' }
            ]
        },
        {
            id: 'wm-3',
            name: 'Miele 13 kg',
            brand: 'Miele',
            image: Miele_13,
            variants: [
                { store: 'Rozetka', price: 34999, url: 'https://rozetka.com.ua/miele-13kg' }
            ]
        },
        {
            id: 'wm-4',
            name: 'Bosch 15 kg',
            brand: 'Bosch',
            image: Bosh_15,
            variants: [
                { store: 'Rozetka', price: 39999, url: 'https://rozetka.com.ua/bosch-15kg' },
                { store: 'Comfy', price: 40999, url: 'https://comfy.ua/bosch-15kg' }
            ]
        },
        {
            id: 'wm-5',
            name: 'LG 15 kg',
            brand: 'LG',
            image: LG_15,
            variants: [
                { store: 'Rozetka', price: 37999, url: 'https://rozetka.com.ua/lg-15kg' }
            ]
        },
        {
            id: 'wm-6',
            name: 'Bosch 20 kg',
            brand: 'Bosch',
            image: Bosh_20,
            variants: [
                { store: 'Rozetka', price: 45999, url: 'https://rozetka.com.ua/bosch-20kg' },
                { store: 'Comfy', price: 44999, url: 'https://comfy.ua/bosch-20kg' }
            ]
        }
    ],
    ovens: [
        {
            id: 'oven-1',
            name: 'Bosch HBJ558YB3Q',
            brand: 'Bosch',
            image: Bosch_HBJ558YB3Q,
            variants: [
                { store: 'Rozetka', price: 17499, url: 'https://rozetka.com.ua/bosch-hbj558yb3q' }
            ]
        },
        {
            id: 'oven-2',
            name: 'WHIRLPOOL AKZ9 6240 NB',
            brand: 'WHIRLPOOL',
            image: Whirppool_Akz9_6240_Nb,
            variants: [
                { store: 'Rozetka', price: 15999, url: 'https://rozetka.com.ua/whirlpool-akz9-6240-nb' },
                { store: 'Comfy', price: 16999, url: 'https://comfy.ua/whirlpool-akz9-6240-nb' }
            ]
        },
        {
            id: 'oven-3',
            name: 'ELECTROLUX EOF5H40BX',
            brand: 'ELECTROLUX',
            image: Electolux_E0f5h40bx,
            variants: [
                { store: 'Rozetka', price: 10999, url: 'https://rozetka.com.ua/electrolux-eof5h40bx' }
            ]
        },
        {
            id: 'oven-4',
            name: 'Gorenje G400 BOP6737E02BK',
            brand: 'Gorenje',
            image: Gorenje_G400_BOP6737E02BK,
            variants: [
                { store: 'Rozetka', price: 15999, url: 'https://rozetka.com.ua/gorenje-g400-bop6737e02bk' },
                { store: 'Allo', price: 14999, url: 'https://allo.ua/gorenje-g400-bop6737e02bk' }
            ]
        },
        {
            id: 'oven-5',
            name: 'Hansa BOES68121',
            brand: 'Hansa',
            image: Hansa_BOES68121,
            variants: [
                { store: 'Rozetka', price: 9899, url: 'https://rozetka.com.ua/hansa-boes68121' }
            ]
        },
        {
            id: 'oven-6',
            name: 'WHIRLPOOL OMSK58CU1SB',
            brand: 'WHIRLPOOL',
            image: Whirppool_OMSK58CU1SB,
            variants: [
                { store: 'Rozetka', price: 15555, url: 'https://rozetka.com.ua/whirlpool-omsk58cu1sb' },
                { store: 'Comfy', price: 14999, url: 'https://comfy.ua/whirlpool-omsk58cu1sb' }
            ]
        },
        {
            id: 'oven-7',
            name: 'ELECTROLUX EOF5C50BZ',
            brand: 'ELECTROLUX',
            image: Electrolux_E0f5c50bz,
            variants: [
                { store: 'Rozetka', price: 13999, url: 'https://rozetka.com.ua/electrolux-eof5c50bz' },
                { store: 'Foxtrot', price: 12999, url: 'https://foxtrot.com.ua/electrolux-eof5c50bz' }
            ]
        }
    ],
    laptops: [
        {
            id: 'laptop-1',
            name: 'Acer Extensa 15 EX215-23-R5LT (NX.EH3EU.01D)',
            brand: 'Acer',
            image: Acer_Extensa_15,
            variants: [
                { store: 'Rozetka', price: 18499, url: 'https://rozetka.com.ua/acer-extensa-15-ex215-23-r5lt' }
            ]
        },
        {
            id: 'laptop-2',
            name: 'ASUS Vivobook 15 X1500KA-EJ276 (90NB0VI5-M00E10)',
            brand: 'ASUS',
            image: Asus_Vivobook_15,
            variants: [
                { store: 'Rozetka', price: 16499, url: 'https://rozetka.com.ua/asus-vivobook-15-x1500ka-ej276' },
                { store: 'Comfy', price: 16999, url: 'https://comfy.ua/asus-vivobook-15-x1500ka-ej276' }
            ]
        },
        {
            id: 'laptop-3',
            name: 'Dell Vostro 3530 Aluminium (N1804QMVNB3530UA_UBU)',
            brand: 'Dell',
            image: Dell_Vostro_3530,
            variants: [
                { store: 'Rozetka', price: 30299, url: 'https://rozetka.com.ua/dell-vostro-3530' },
                { store: 'Allo', price: 29999, url: 'https://allo.ua/dell-vostro-3530' }
            ]
        },
        {
            id: 'laptop-4',
            name: 'Lenovo V14 G4 IRU (83A000E0RA)',
            brand: 'Lenovo',
            image: Lenovo_V14,
            variants: [
                { store: 'Rozetka', price: 15999, url: 'https://rozetka.com.ua/lenovo-v14-g4-iru' }
            ]
        },
        {
            id: 'laptop-5',
            name: 'Acer Extensa 15 EX215-55-54PU (NX.EGYEU.031)',
            brand: 'Acer',
            image: Acer_Extensa,
            variants: [
                { store: 'Rozetka', price: 19999, url: 'https://rozetka.com.ua/acer-extensa-15-ex215-55-54pu' },
                { store: 'Foxtrot', price: 18999, url: 'https://foxtrot.com.ua/acer-extensa-15-ex215-55-54pu' }
            ]
        },
        {
            id: 'laptop-6',
            name: 'Lenovo IdeaPad 3',
            brand: 'Lenovo',
            image: Lenovo_IdeaPad_3,
            variants: [
                { store: 'Rozetka', price: 16999, url: 'https://rozetka.com.ua/lenovo-ideapad-3' },
                { store: 'Comfy', price: 15999, url: 'https://comfy.ua/lenovo-ideapad-3' }
            ]
        },
        {
            id: 'laptop-7',
            name: 'ASUS TUF Gaming F17 FX707ZC4-HX028 (90NR0GX2)',
            brand: 'ASUS',
            image: Asus_Tuf,
            variants: [
                { store: 'Rozetka', price: 37999, url: 'https://rozetka.com.ua/asus-tuf-gaming-f17-fx707zc4-hx028' },
                { store: 'Allo', price: 36999, url: 'https://allo.ua/asus-tuf-gaming-f17-fx707zc4-hx028' }
            ]
        }
    ],
    tvs: [
        {
            id: 'tv-1',
            name: 'Sony 65 LED',
            brand: 'Sony',
            image: Sony_65_LED,
            variants: [
                { store: 'Rozetka', price: 23999, url: 'https://rozetka.com.ua/sony-65-led' },
                { store: 'Comfy', price: 24999, url: 'https://comfy.ua/sony-65-led' }
            ]
        },
        {
            id: 'tv-2',
            name: 'Samsung UE32T4500A (UE32T4500AUXUA)',
            brand: 'Samsung',
            image: Samsung_UE32T4500A,
            variants: [
                { store: 'Rozetka', price: 8999, url: 'https://rozetka.com.ua/samsung-ue32t4500a' },
                { store: 'Foxtrot', price: 8799, url: 'https://foxtrot.com.ua/samsung-ue32t4500a' }
            ]
        },
        {
            id: 'tv-3',
            name: 'Xiaomi TV A Pro 32',
            brand: 'Xiaomi',
            image: xiomiTV,
            variants: [
                { store: 'Rozetka', price: 6999, url: 'https://rozetka.com.ua/xiaomi-tv-a-pro-32' }
            ]
        },
        {
            id: 'tv-4',
            name: 'LG 55 OLED',
            brand: 'LG',
            image: LG_55,
            variants: [
                { store: 'Rozetka', price: 23999, url: 'https://rozetka.com.ua/lg-55-oled' },
                { store: 'Allo', price: 22999, url: 'https://allo.ua/lg-55-oled' }
            ]
        }
    ]
};

export default categoryData;