export const FAQ_CATEGORIES = [
  {
    id: 'luggage',
    name: 'Luggage',
    icon: '🧳',
    faqs: [
      {
        q: 'What are the regulations for carry-on luggage?',
        a: 'Each passenger is allowed 1 piece of carry-on luggage free of charge, maximum 20 kg, dimensions not exceeding 0.8 m × 0.5 m × 0.4 m (volume ≤ 0.16 m³). If exceeding this limit, passengers need to check in and may be charged fees.\nFor checked luggage:\n – Minimum 5 kg per piece\n – Fractions from 0.5 kg and above are rounded up to 1 kg\n – Bulky items calculated as 1 m³ = 300 kg\n – Bicycles and motorcycles are subject to separate fee schedules'
      },
      {
        q: 'Where can I store carry-on luggage in the train car?',
        a: 'Sleeping compartments:\n – Shelf above 3rd tier bed: fits 20–24″ suitcases\n – Under 1st tier bed (height about 28 cm): fits 24–26″ suitcases\nSeating compartments:\n – Has horizontal racks extending like on airplanes\n – No length limit, but height limit about 35 cm\n – Suitable for cabin suitcases, backpacks\n – Do not place large luggage under feet or in aisles\nIf the system detects oversized luggage compared to your chosen compartment, it will show a warning requiring compartment change or check-in.'
      },
      {
        q: 'What if I bring 3 28″ suitcases but book seating?',
        a: 'Seating does not have enough storage space for multiple large suitcases. During booking, the system will show a warning. You should switch to sleeping compartments or register for luggage check-in before the trip.'
      },
      {
        q: 'What items are prohibited on trains?',
        a: '– Weapons, explosives or flammable substances\n – Live animals (except registered pets according to regulations)\n – Items with unpleasant odors or prone to leakage'
      },
      {
        q: 'What luggage size is considered bulky?',
        a: 'Any luggage exceeding the carry-on luggage size limits or outside the specified carry-on luggage categories is considered bulky. Bulky items must be declared for paid check-in at https://duongsatthongnhat.com/bao-gia-van-dich-vu-chuyen-hang-hoa-bang-duong-sat/'
      }
    ]
  },
  {
    id: 'pets',
    name: 'Pets and Animals',
    icon: '🐶',
    faqs: [
      {
        q: 'Can I bring pets on the train?',
        a: 'Only small pets (cats, dogs under 10 kg) are allowed if booked in advance and regulations are followed.'
      },
      {
        q: 'What conditions do pets need to travel in?',
        a: 'Must be kept in clean, enclosed cages that do not cause odors or noise.'
      },
      {
        q: 'Do I need to pay extra fees for pets?',
        a: 'No. Small pets (cats/dogs under 10 kg) if registered in advance will not incur additional fees but must ensure cage conditions and documentation.'
      }
    ]
  },
  {
    id: 'time',
    name: 'Time & Procedures Before Departure',
    icon: '⏰',
    faqs: [
      {
        q: 'How early should I arrive at the station?',
        a: 'Should arrive at least 30 minutes early to check tickets and find your car.'
      },
      {
        q: 'Do I need to print paper tickets?',
        a: 'No need. QR code or booking code on your phone is sufficient to board the train.'
      },
      {
        q: 'Can I change or cancel tickets?',
        a: 'Yes, if within the specified time limit. Change/cancellation fees depend on ticket type and request timing.'
      }
    ]
  },
  {
    id: 'seat',
    name: 'Seating and Sleeping Compartments',
    icon: '🛏️',
    faqs: [
      {
        q: 'Can I choose bed tiers when booking tickets?',
        a: 'Yes. The system allows selecting bed tiers if compartments are available.'
      },
      {
        q: 'Are 1st, 2nd, 3rd tier beds different?',
        a: 'Yes. DSVN currently has two common sleeping compartment types: 4-bed compartments (2 tiers) and 6-bed compartments (3 tiers). Differences between tiers are shown in: ceiling height, climbing width, power outlet location, and overall comfort.\nBed dimensions:\n4-bed compartments (ANL): 80 × 190 cm\n6-bed compartments (BNL): 78 × 190 cm\nTier heights:\nTier 1 → Tier 2: ~72–75 cm\nTier 2 → Tier 3: ~65 cm\nTier 3 ceiling space: very low, only about 50–55 cm, must bend low when getting up/down and cannot sit straight for people taller than 1m60.\nTier 1 is the most spacious and easiest to move around, especially suitable for elderly people.\nTo visualize: 20L lavie water bottle is 58 cm tall, people can sit straight on tier 1, slightly hunched on tier 2, and must crawl when entering tier 3.'
      },
      {
        q: 'Which seats are suitable for elderly people?',
        a: 'Should choose tier 1 sleeping compartments or wide soft seats. Can notify staff for assistance in advance.'
      }
    ]
  },
  {
    id: 'service',
    name: 'Amenities & Services Onboard',
    icon: '🚆',
    faqs: [
      {
        q: 'Are there phone/laptop charging outlets on the train?',
        a: 'No personal power outlets at each bed. Outlets (usually single outlets) are placed at the end of the car, above the compartment entrance door. Tier 1 passengers need to climb up if they want to use them.\nFor newer trains like SE29, SE21/22, each bed is equipped with USB charging ports right at the head of the bed along with reading lights.'
      },
      {
        q: 'Does the train have wifi or phone signal?',
        a: 'No wifi. Phone signal depends on the area; some mountain or tunnel sections will lose signal.'
      },
      {
        q: 'Is food service available on the train?',
        a: 'Yes. Some long routes sell meals and drinks. You can also bring your own food.'
      }
    ]
  },
  {
    id: 'hygiene',
    name: 'Hygiene, Food and Safety',
    icon: '🧼',
    faqs: [
      {
        q: 'Are there toilets on the train?',
        a: 'Yes. Each car has basic toilets that are cleaned regularly.'
      },
      {
        q: 'Can I bring my own food on the train?',
        a: 'Yes. However, avoid bringing food with strong odors or that is easily spilled.'
      },
      {
        q: 'Are there any restrictions on fragile items?',
        a: 'Not prohibited, but you are responsible if items are dropped or broken during the journey.'
      }
    ]
  },
  {
    id: 'support',
    name: 'Special Assistance for Vulnerable Passengers',
    icon: '♿',
    faqs: [
      {
        q: 'What assistance is available for elderly people or children?',
        a: 'Can request staff assistance when boarding/disembarking if notified in advance at ticket counters or hotline.'
      },
      {
        q: 'Can I request help with luggage handling?',
        a: 'Only available at some major stations. Please ask in advance for specific guidance.'
      },
      {
        q: 'I am disabled, what should I do to get assistance?',
        a: 'Please contact the hotline or ticket counter staff at least 24 hours before departure time for appropriate arrangements.'
      }
    ]
  }
]; 