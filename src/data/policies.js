// Storefront legal / policy pages. Plain content — <PolicyPage> renders it.
// A body entry that is a string renders as a paragraph; { list: [...] } renders
// as a bulleted list.

export const POLICY_CONTACT = {
  brand: 'Samaha Natural Oils',
  email: 'hello@samaha.in',
  phone: '+91 99430 97030',
  address: 'Sulur, Coimbatore, Tamil Nadu 641402, India',
}

const P = POLICY_CONTACT
const UPDATED = '4 September 2026'

export const POLICIES = {
  'privacy-policy': {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    updated: UPDATED,
    intro: `This Privacy Policy explains how ${P.brand} (“Samaha”, “we”, “us”) collects, uses and protects your personal information when you visit samaha.in or place an order with us. By using our website, you agree to the practices described here.`,
    sections: [
      {
        h: 'Information we collect',
        body: [
          'When you create an account or place an order, we collect the details you give us: your name, email address, phone number and one or more delivery addresses.',
          'When you pay, your card / UPI / net-banking details are entered on our payment partner Razorpay’s secure gateway. We never see or store your full card number, CVV or UPI PIN — we only receive confirmation that a payment succeeded, along with a payment reference ID.',
          'If you sign in with Google, we receive your name, email address and profile photo from Google.',
          'We also collect basic technical information automatically — device type, browser and the pages you view — through cookies and similar technologies, so the site works properly and we can improve it.',
        ],
      },
      {
        h: 'How we use your information',
        body: [
          { list: [
            'To process, pack, ship and confirm your orders.',
            'To send order updates and respond to your questions or support requests.',
            'To manage your account, saved addresses and order history.',
            'To detect and prevent fraud and keep the website secure.',
            'To send offers or news — only if you have opted in. You can unsubscribe at any time.',
            'To meet our legal, tax and accounting obligations.',
          ] },
        ],
      },
      {
        h: 'Who we share it with',
        body: [
          'We do not sell your personal information. We share it only with parties that help us run the business:',
          { list: [
            'Courier and logistics partners, to deliver your order.',
            'Razorpay, to process payments and refunds.',
            'Service providers for hosting, email and analytics, who are bound to keep it confidential.',
            'Government authorities or law enforcement, where required by law.',
          ] },
        ],
      },
      {
        h: 'Cookies',
        body: [
          'We use cookies to keep you signed in, remember your cart and understand how the site is used. You can block cookies in your browser settings, but some parts of the site may not work as expected.',
        ],
      },
      {
        h: 'Data security & retention',
        body: [
          'Your data is stored on secured servers and transmitted over encrypted (HTTPS) connections. We keep order and account records for as long as your account is active and for as long as the law requires (for tax and warranty purposes).',
        ],
      },
      {
        h: 'Your rights',
        body: [
          `You can ask us to show, correct or delete the personal information we hold about you, or to stop marketing emails, by writing to ${P.email}. We will respond within a reasonable time. Deleting your account does not remove records we are legally required to keep.`,
        ],
      },
      {
        h: 'Children',
        body: [
          'Our website is intended for users aged 18 and above. We do not knowingly collect information from children.',
        ],
      },
      {
        h: 'Changes to this policy',
        body: [
          'We may update this policy from time to time. The “last updated” date at the top shows the current version, and significant changes will be highlighted on this page.',
        ],
      },
      {
        h: 'Contact us',
        body: [
          `For any privacy question or request, contact us at ${P.email} or ${P.phone}. Postal address: ${P.brand}, ${P.address}.`,
        ],
      },
    ],
  },

  'terms-and-conditions': {
    key: 'terms-and-conditions',
    title: 'Terms & Conditions',
    updated: UPDATED,
    intro: `These Terms & Conditions govern your use of samaha.in and any purchase you make from ${P.brand}. Please read them before ordering — by using the site or placing an order, you accept these terms.`,
    sections: [
      {
        h: 'Who can order',
        body: [
          'You must be at least 18 years old and able to enter into a legally binding contract to buy from us. By ordering, you confirm that the information you provide is accurate and complete.',
        ],
      },
      {
        h: 'Products, descriptions & pricing',
        body: [
          'Samaha sells cold-pressed, unrefined edible oils. Because these are natural products, colour, aroma, cloudiness and sediment can vary slightly from batch to batch — this is normal and not a defect.',
          'All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We try to keep pricing and product information accurate, but errors can occur; if we find an error in the price of an item you have ordered, we will contact you before dispatch.',
          'We may change prices, products and offers at any time without notice.',
        ],
      },
      {
        h: 'Your order',
        body: [
          'After you place an order you will receive an email confirming we have received it. This confirmation is not acceptance of your order — a contract is formed only when we dispatch the goods.',
          'We may refuse or cancel an order for reasons including the item being out of stock, a pricing error, a failed payment, or suspected fraud or resale. If we cancel a paid order, you receive a full refund.',
        ],
      },
      {
        h: 'Payment',
        body: [
          'Payments are processed securely through Razorpay. You confirm that you are authorised to use the payment method you provide. Orders are processed only after payment is successfully received.',
        ],
      },
      {
        h: 'Shipping, returns & refunds',
        body: [
          'Delivery is covered by our Shipping & Delivery Policy. Cancellations, returns and refunds are covered by our Refund & Cancellation Policy. Both form part of these terms.',
        ],
      },
      {
        h: 'Using a food product',
        body: [
          'Our oils are food products. Store them in a cool, dark place, keep the cap closed, and use them before the “best before” date printed on the bottle.',
          'Information on this website about the qualities or traditional uses of an oil is provided for general interest only. It is not medical or nutritional advice. If you have a health condition or allergy, or are pregnant, consult a qualified doctor before changing your diet.',
        ],
      },
      {
        h: 'Intellectual property',
        body: [
          'All content on this site — text, photographs, graphics, logos and design — belongs to Samaha and may not be copied or used without our written permission.',
        ],
      },
      {
        h: 'Acceptable use',
        body: [
          { list: [
            'Do not use the site for any unlawful purpose or to place fraudulent orders.',
            'Do not attempt to disrupt, damage or gain unauthorised access to the site or its systems.',
            'Do not resell our products commercially without a wholesale agreement with us.',
          ] },
        ],
      },
      {
        h: 'Limitation of liability',
        body: [
          'To the extent permitted by law, Samaha is not liable for indirect or consequential losses. Our total liability for any order is limited to the amount you paid for that order. Nothing in these terms limits liability that cannot be limited under Indian law.',
        ],
      },
      {
        h: 'Governing law',
        body: [
          'These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts of Coimbatore, Tamil Nadu.',
        ],
      },
      {
        h: 'Contact',
        body: [
          `Questions about these terms? Email ${P.email} or call ${P.phone}.`,
        ],
      },
    ],
  },

  'refund-policy': {
    key: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    updated: UPDATED,
    intro: 'We want you to be happy with your order. Because our products are edible oils — perishable, consumable goods — this policy explains when an order can be cancelled, when it can be returned, and how refunds work.',
    sections: [
      {
        h: 'Cancelling an order',
        body: [
          'You can cancel an order at no cost any time before it is dispatched — email us with your order number as soon as possible and we will stop the shipment and refund you in full.',
          'Once an order has been handed to the courier it cannot be cancelled. You may still be able to return it under the conditions below.',
        ],
      },
      {
        h: 'When we accept a return',
        body: [
          'For food-safety reasons we can only accept a return or send a replacement if, when your parcel arrives:',
          { list: [
            'a bottle or tin is broken, leaking or damaged in transit;',
            'you received the wrong product or size;',
            'the product is expired, or the remaining shelf life is unreasonably short;',
            'the seal or packaging has been tampered with.',
          ] },
        ],
      },
      {
        h: 'How to raise a claim',
        body: [
          `Contact ${P.email} within 48 hours of delivery with your order number, a short description of the problem and clear photos of the product, the batch / expiry label and the outer packaging. This helps us resolve it quickly and improve our packing.`,
        ],
      },
      {
        h: 'What we cannot take back',
        body: [
          { list: [
            'Oil that has been opened or partly used, unless it was defective or spoiled on arrival.',
            'Returns requested more than 48 hours after delivery.',
            '“Changed my mind” returns after the product has been delivered and accepted.',
            'Orders that failed to deliver because of an incorrect or incomplete address provided by you.',
          ] },
        ],
      },
      {
        h: 'Refunds',
        body: [
          'Once we receive the returned item or approve your claim, your refund is issued to the original payment method through Razorpay. It normally reaches your account within 5–7 business days, depending on your bank.',
          'For a prepaid order we refund the full amount you paid. If a replacement is sent instead of a refund, no extra shipping is charged.',
        ],
      },
      {
        h: 'Contact',
        body: [
          `For anything about cancellations or refunds, email ${P.email} or call ${P.phone}.`,
        ],
      },
    ],
  },

  'shipping-policy': {
    key: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    updated: UPDATED,
    intro: 'Here is how and when your Samaha order reaches you.',
    sections: [
      {
        h: 'Where we ship',
        body: [
          'We currently ship anywhere in India. We do not offer international shipping yet.',
        ],
      },
      {
        h: 'Shipping charges',
        body: [
          'Shipping is free on every order — the price you see at checkout is the price you pay.',
        ],
      },
      {
        h: 'Processing time',
        body: [
          'Orders are packed and handed to the courier within 1–2 business days of payment. Orders placed on Sundays or public holidays are processed the next business day.',
        ],
      },
      {
        h: 'Delivery time',
        body: [
          'After dispatch, delivery usually takes 3–7 business days depending on your location — metro cities are quicker, remote pin codes take a little longer.',
        ],
      },
      {
        h: 'Tracking your order',
        body: [
          'When your order ships we email you a tracking link so you can follow it to your door. You can also see your orders any time under My account › My orders.',
        ],
      },
      {
        h: 'Packaging',
        body: [
          'Every bottle is sealed and wrapped, and orders are packed with cushioning in sturdy boxes to survive transit. If anything arrives damaged or leaking, our Refund & Cancellation Policy covers you — just contact us within 48 hours with photos.',
        ],
      },
      {
        h: 'Delays outside our control',
        body: [
          'Weather, courier backlogs, regional restrictions, strikes and other events beyond our control can delay delivery. We will help you track and follow up, but we cannot be held liable for such delays.',
        ],
      },
      {
        h: 'Wrong or incomplete address',
        body: [
          'Please check your delivery address and phone number carefully at checkout. If a parcel is returned to us because the address was wrong or nobody was reachable, we will contact you to arrange re-delivery; re-shipping may be chargeable.',
        ],
      },
      {
        h: 'Contact',
        body: [
          `Questions about a delivery? Email ${P.email} with your order number, or call ${P.phone}.`,
        ],
      },
    ],
  },
}

// Display order used by the footer and the "more policies" strip.
export const POLICY_ORDER = [
  'shipping-policy',
  'refund-policy',
  'terms-and-conditions',
  'privacy-policy',
]
