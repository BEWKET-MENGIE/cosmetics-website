// src/lib/dictionary.ts

export const translations = {
  en: {
    // Navbar & Layout
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    search: 'Search products...',
    cart: 'Shopping Bag',
    wishlist: 'Wishlist',
    account: 'My Account',

    // Shop & Products
    shopAll: 'Shop All',
    categories: 'Categories',
    featuredProducts: 'Featured Products',
    addToBag: 'Add to Bag',
    outOfStock: 'Out of Stock',
    freeShipping: 'Free Shipping',

    // Checkout & Orders
    checkout: 'Checkout',
    fullName: 'Full name',
    phone: 'Phone number',
    email: 'Email',
    city: 'City',
    selectCity: 'Select your city',
    address: 'Address',
    deliveryNotes: 'Delivery notes (optional)',
    paymentMethod: 'Payment method',
    cashOnDelivery: 'Cash on delivery',
    payOnline: 'Pay online (Telebirr, CBE Birr, card)',
    placeOrder: 'Place Order',
    placingOrder: 'Placing order...',
    thankYou: 'Thank you for your order!',
    orderAgain: 'Order again',
    payNow: 'Pay now',
  },
  am: {
    // Navbar & Layout
    home: 'መነሻ',
    shop: 'ሱቅ',
    about: 'ስለ እኛ',
    blog: 'ብሎግ',
    contact: 'አግኙን',
    search: 'ምርቶችን ፈልግ...',
    cart: 'የግብይት ቦርሳ',
    wishlist: 'የተመረጡ',
    account: 'መግቢያ/እኔ',

    // Shop & Products
    shopAll: 'ሁሉንም ሱቅ ይመልከቱ',
    categories: 'ምድቦች',
    featuredProducts: 'ልዩ ምርቶች',
    addToBag: 'ወደ ቦርሳ ጨምር',
    outOfStock: 'አልቋል',
    freeShipping: 'ነጻ መላኪያ',

    // Checkout & Orders
    checkout: 'ክፍያ መፈጸሚያ',
    fullName: 'ሙሉ ስም',
    phone: 'ስልክ ቁጥር',
    email: 'ኢሜይል',
    city: 'ከተማ',
    selectCity: 'ከተማዎን ይምረጡ',
    address: 'አድራሻ',
    deliveryNotes: 'የማድረሻ ማስታወሻ (አማራጭ)',
    paymentMethod: 'የክፍያ ዓይነት',
    cashOnDelivery: 'እቃው ሲደርስ በጥሬ ገንዘብ ክፍያ',
    payOnline: 'በኦንላይን ይክፈሉ (ቴሌብር፣ ሲቢኢ ብር፣ ካርድ)',
    placeOrder: 'ትዕዛዝ ይላኩ',
    placingOrder: 'ትዕዛዝ በመላክ ላይ...',
    thankYou: 'ለማዘዝዎ እናመሰግናለን!',
    orderAgain: 'እንደገና ይዘዙ',
    payNow: 'አሁን ይክፈሉ',
  },
};

export type Language = 'en' | 'am';
export type TranslationKey = keyof typeof translations.en;