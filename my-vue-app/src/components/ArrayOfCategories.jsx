
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
import WHIRLPOOL_AKZ9_6240_NB from "../assets/ovens/WHIRLPOOL_AKZ9_6240_NB.jpg"
import ELECTROLUX_EOF5H40BX from "../assets/ovens/ELECTROLUX_EOF5H40BX.jpg"
import Gorenje_G400_BOP6737E02BK from "../assets/ovens/Gorenje_G400_BOP6737E02BK.jpg"
import Hansa_BOES68121 from "../assets/ovens/Hansa_BOES68121.jpg"
import WHIRLPOOL_OMSK58CU1SB from "../assets/ovens/WHIRLPOOL_OMSK58CU1SB.jpg"
import ELECTROLUX_EOF5C50BZ from "../assets/ovens/ELECTROLUX_EOF5C50BZ.jpg"

import Acer_Extensa_15 from "../assets/laptops/Acer_Extensa_15.jpg"
import ASUS_Vivobook_15 from "../assets/laptops/ASUS_Vivobook_15.jpg"
import Dell_Vostro_3530 from "../assets/laptops/Dell_Vostro_3530.jpg"
import Lenovo_V14 from "../assets/laptops/Lenovo_V14.jpg"
import Acer_Extensa from "../assets/laptops/Acer_Extensa.jpg"
import Lenovo_IdeaPad_3 from "../assets/laptops/Lenovo_IdeaPad_3.jpg"
import ASUS_TUF from "../assets/laptops/ASUS_TUF.jpg"


import Sony_65_LED from "../assets/TV/Sony_65_LED.jpg"
import Samsung_UE32T4500A from "../assets/TV/Samsung_UE32T4500A.jpg"
import xiomiTV from "../assets/TV/xiomi.jpg"; 
import LG_55 from "../assets/TV/LG_55.jpg"





const categoryData = {
        phones: [
        { id: 1, name: 'iPhone 15 Pro', price: 42999, brand: 'Apple', image: iphone_15_pro_natural_titanium_pdp_image_position },
        { id: 2, name: 'Samsung Galaxy S23', price: 31999, brand: 'Samsung', image: Samsung_S23 },
        { id: 3, name: 'Xiaomi Mi 11', price: 21999, brand: 'Xiaomi', image: Xiaomi_11T },
        { id: 4, name: 'Google Pixel 8 Pro', price: 38999, brand: 'Google', image: Google_Pixel_8_Pro },
        { id: 5, name: 'Huawei Mate 30 Pro', price: 29999, brand: 'Huawei', image: Hiawei_30_Pro },
        { id: 6, name: 'OnePlus 9 Pro', price: 32999, brand: 'OnePlus', image: OnePlus_9_Pro },
        { id: 7, name: 'Nokia 8.1', price: 17999, brand: 'Nokia', image: Nokia_8 },
        { id: 8, name: 'Sony Xperia Z5', price: 23999, brand: 'Sony', image: Sony_Z5 },
        { id: 9, name: 'LG G8', price: 19999, brand: 'LG', image: LG_G8 },
        ],
        tablets: [
            { id: 1, name: 'iPad Air', price: 28999, brand: 'Apple', image: iPan_Air },
            { id: 2, name: 'Samsung Galaxy Tab S8', price: 23999, brand: 'Samsung', image: Samsung_Galaxy_Tab_S8 },
            { id: 3, name: 'Xiaomi Pad 5', price: 17999, brand: 'Xiaomi', image: Xiaomi_Pad_5 },
            { id: 3, name: 'Lenovo Tab Plus 8/256 WiFi Luna Grey', price: 12999, brand: 'Lenovo', image: Lenovo_Tab_Plus_8 },
            { id: 4, name: 'Lenovo Tab 10 4/128 WiFi Black', price: 16999, brand: 'Lenovo', image: Lenovo_Tab_K10 },
        ],
        washingMachines: [
            { id: 1, name: 'Bosch 10 kg', price: 31999, brand: 'Bosch', image: Bosh_10 },
            { id: 2, name: 'LG 10 kg', price: 29999, brand: 'LG', image: LG_10 },
            { id: 3, name: 'Miele 13 kg', price: 34999, brand: 'Miele', image: Miele_13 },
            { id: 4, name: 'Bosch 15 kg', price: 39999, brand: 'Bosch', image: Bosh_15 },
            { id: 6, name: 'Miele 20 kg', price: 42999, brand: 'Miele', image: LG_15 },
            { id: 7, name: 'Bosch 20 kg', price: 45999, brand: 'Bosch', image: Bosh_20 },
            
        ],
        ovens: [
            { id: 1, name: 'Bosch HBJ558YB3Q ', price: 17499, brand: 'Bosch', image: Bosch_HBJ558YB3Q },
            { id: 2, name: 'WHIRLPOOL AKZ9 6240 NB', price: 15999, brand: 'WHIRLPOOL', image: WHIRLPOOL_AKZ9_6240_NB },
            { id: 3, name: 'ELECTROLUX EOF5H40BX', price: 10999, brand: 'ELECTROLUX', image: ELECTROLUX_EOF5H40BX },
            { id: 4, name: 'Gorenje G400 BOP6737E02BK ', price: 15999, brand: 'Gorenje', image: Gorenje_G400_BOP6737E02BK },
            { id: 5, name: 'Hansa BOES68121 ', price: 9899, brand: 'Hansa', image: Hansa_BOES68121 },
            { id: 6, name: 'WHIRLPOOL OMSK58CU1SB ', price: 15555, brand: 'WHIRLPOOL', image: WHIRLPOOL_OMSK58CU1SB },
            { id: 7, name: 'ELECTROLUX EOF5C50BZ ', price: 13999, brand: 'ELECTROLUX', image: ELECTROLUX_EOF5C50BZ },
    ],
        laptops: [
            { id: 1, name: 'Acer Extensa 15 EX215-23-R5LT (NX.EH3EU.01D)', price: 18499, brand: 'Acer', image: Acer_Extensa_15 },
            { id: 2, name: 'ASUS Vivobook 15 X1500KA-EJ276 (90NB0VI5-M00E10)', price: 16499, brand: 'ASUS', image: ASUS_Vivobook_15 },
            { id: 3, name: 'Dell Vostro 3530 Aluminium (N1804QMVNB3530UA_UBU)', price: 30299, brand: 'Dell', image: Dell_Vostro_3530 },
            { id: 4, name: 'Lenovo V14 G4 IRU (83A000E0RA)', price: 15999, brand: 'Lenovo ', image: Lenovo_V14 },
            { id: 5, name: 'Acer Extensa 15 EX215-55-54PU (NX.EGYEU.031)', price: 19999, brand: 'Acer', image: Acer_Extensa },
            { id: 6, name: 'Lenovo IdeaPad 3', price: 16999, brand: 'Lenovo', image: Lenovo_IdeaPad_3 },
            { id: 7, name: 'ASUS TUF Gaming F17 FX707ZC4-HX028 (90NR0GX2)', price: 37999, brand: 'ASUS', image: ASUS_TUF },  
    ],
        tvs: [
            { id: 1, name: 'Sony 65 LED', price: 23999, brand: 'Sony', image: Sony_65_LED },
            { id: 2, name: 'Samsung UE32T4500A (UE32T4500AUXUA)', price: 8999, brand: 'Samsung', image: Samsung_UE32T4500A },
            { id: 3, name: 'Xiaomi TV A Pro 32', price: 6999, brand: 'Xiaomi', image: xiomiTV },
            { id: 4, name: 'LG 55 OLED', price: 23999, brand: 'LG', image: LG_55 },
        ]
};
    
export default categoryData;