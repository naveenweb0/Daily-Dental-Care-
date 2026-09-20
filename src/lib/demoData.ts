export interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  durationMinutes: number;
  shortDescription: string;
  description: string;
  price: string;
  benefits: string[];
  procedure: string[];
  suitableFor: string[];
  faqs: { q: string; a: string }[];
  sortOrder: number;
  active: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface DoctorItem {
  id: number;
  name: string;
  qualification: string;
  specialization: string;
  experience: string | null;
  bio: string | null;
  photo: string | null;
  active: boolean;
  serviceIds: number[];
}

const IMG = {
  implants: "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  aligners: "https://images.pexels.com/photos/6627716/pexels-photo-6627716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ortho: "https://images.pexels.com/photos/8260441/pexels-photo-8260441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  crown: "https://images.pexels.com/photos/6627721/pexels-photo-6627721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  rct: "https://images.pexels.com/photos/19976573/pexels-photo-19976573.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cleaning: "https://images.pexels.com/photos/19976607/pexels-photo-19976607.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  whitening: "https://images.pexels.com/photos/6627703/pexels-photo-6627703.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dentures: "https://images.pexels.com/photos/6627725/pexels-photo-6627725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cosmetic: "https://images.pexels.com/photos/6627826/pexels-photo-6627826.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  general: "https://images.pexels.com/photos/19879757/pexels-photo-19879757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export const DEMO_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: "Dental Implants",
    slug: "dental-implants",
    image: IMG.implants,
    durationMinutes: 60,
    shortDescription: "Permanent titanium tooth replacement that looks, feels, and functions like a natural tooth.",
    description: "Permanent titanium tooth replacement that looks, feels, and functions like a natural tooth. At Daily Dental Care Mohali, dental implants are executed using computerized 3D CBCT guided surgery for maximum precision, lifetime durability, and minimum discomfort.",
    price: "₹18,000 onwards",
    benefits: [
      "Permanent solution that prevents jawbone loss",
      "Look, chew, and smile with 100% natural feeling",
      "FDA-approved international titanium implants (Osstem & Straumann)",
      "0% Interest EMI options available",
    ],
    procedure: [
      "Digital 3D CBCT examination & virtual surgical planning",
      "Gentle implant fixture placement with local anaesthesia",
      "Healing period with temporary aesthetic crown",
      "Final custom zirconia crown attachment with warranty card",
    ],
    suitableFor: [
      "Single or multiple missing teeth",
      "Patients tired of loose or uncomfortable dentures",
      "Adults looking for permanent natural tooth replacement",
    ],
    faqs: [
      { q: "Is dental implant surgery painful?", a: "No. The procedure is performed under painless computerized local anaesthesia. Most patients report feeling only mild pressure during placement." },
      { q: "How long does an implant last?", a: "With regular brushing and 6-month check-ups, high-grade titanium dental implants last a lifetime." },
      { q: "Can I pay in EMIs?", a: "Yes! Daily Dental Care offers flexible 0% interest EMI options." },
    ],
    sortOrder: 1,
    active: true,
    seoTitle: "Dental Implants in Mohali | Daily Dental Care",
    seoDescription: "Permanent dental implants in Phase 7 Mohali. Painless 3D guided surgery with lifetime warranty.",
  },
  {
    id: 2,
    name: "Invisalign / Clear Aligners",
    slug: "invisalign-clear-aligners",
    image: IMG.aligners,
    durationMinutes: 45,
    shortDescription: "Discreet, removable transparent aligners that gradually straighten teeth without metal wires.",
    description: "Straighten your teeth invisibly with custom 3D-scanned clear aligners. No painful metal wires, no food restrictions, and easy removable trays for brushing.",
    price: "₹35,000 onwards",
    benefits: [
      "Virtually invisible transparent material",
      "Removable for eating, brushing, and special occasions",
      "3D digital smile simulation before starting treatment",
      "Fewer clinic visits compared to traditional braces",
    ],
    procedure: [
      "Intraoral 3D digital scan in 60 seconds",
      "Custom 3D ClinCheck video showing week-by-week smile alignment",
      "Receive series of custom medical-grade aligners",
      "Periodic progress checks and retainer guidance",
    ],
    suitableFor: [
      "Crowded, crooked, or overlapping teeth",
      "Gaps between front teeth (Diastema)",
      "Overbite, underbite, or crossbite issues in teens and adults",
    ],
    faqs: [
      { q: "How many hours a day should I wear aligners?", a: "Wear them for 20–22 hours daily, removing them only when eating or brushing." },
      { q: "Are clear aligners noticeable?", a: "They are made of ultra-clear medical grade polyurethane and are virtually imperceptible to others." },
    ],
    sortOrder: 2,
    active: true,
    seoTitle: "Invisalign & Clear Aligners in Mohali | Daily Dental Care",
    seoDescription: "Straighten teeth invisibly with certified aligners in Phase 7 Mohali.",
  },
  {
    id: 3,
    name: "Root Canal Treatment (Single-Sitting RCT)",
    slug: "root-canal-treatment",
    image: IMG.rct,
    durationMinutes: 60,
    shortDescription: "Painless rotary endodontic treatment to relieve toothache and save infected natural teeth.",
    description: "Eliminate dental pain and preserve your natural tooth with our modern single-sitting root canal treatment utilizing apex locators and high-flexibility rotary nickel-titanium instruments.",
    price: "₹2,500 onwards",
    benefits: [
      "100% painless procedure with digital apex locator",
      "Completed in a single sitting in most cases",
      "Preserves your natural tooth structure for decades",
      "Immediate relief from severe toothache and sensitivity",
    ],
    procedure: [
      "Digital X-ray diagnosis and local anaesthesia",
      "Micro-cleaning and sterilization of infected root canals",
      "Hermetic bio-compatible gutta-percha filling",
      "Post & core build-up and crown preparation",
    ],
    suitableFor: [
      "Severe throbbing tooth pain or pain while chewing",
      "Extreme sensitivity to hot or cold drinks",
      "Swelling or pimple on gums near an infected tooth",
    ],
    faqs: [
      { q: "Is Root Canal painful?", a: "No! With modern rotary technology and precise anaesthesia, root canal treatment is as comfortable as getting a simple filling." },
      { q: "Do I always need a crown after RCT?", a: "A crown is highly recommended after RCT to protect the treated tooth from fracturing under chewing pressure." },
    ],
    sortOrder: 3,
    active: true,
    seoTitle: "Single-Sitting Root Canal in Mohali | Daily Dental Care",
    seoDescription: "Painless rotary RCT by endodontic specialists in Phase 7 Mohali.",
  },
  {
    id: 4,
    name: "Zirconia & Ceramic Dental Crowns",
    slug: "dental-crowns",
    image: IMG.crown,
    durationMinutes: 45,
    shortDescription: "Ultra-durable, natural-looking CAD/CAM ceramic crowns with up to 15 years warranty.",
    description: "Restore strength, aesthetics, and chewing ability with custom CAD/CAM milled monolithic zirconia and E-max ceramic crowns made with digital shade matching.",
    price: "₹3,500 onwards",
    benefits: [
      "Metal-free, 100% bio-compatible materials",
      "Indistinguishable from natural tooth enamel",
      "High fracture resistance with 10–15 year warranty",
      "No dark black lines near gums",
    ],
    procedure: [
      "Conservative tooth shaping and digital optical impression",
      "CAD/CAM 3D milling for exact microscopic margin fit",
      "Shade customization matching adjacent teeth",
      "Permanent resin bonding",
    ],
    suitableFor: [
      "Teeth restored with Root Canal Treatment",
      "Fractured, cracked, or severely worn down teeth",
      "Cosmetic smile enhancement",
    ],
    faqs: [
      { q: "What is the difference between Metal-Ceramic and Zirconia?", a: "Zirconia crowns contain no metal, will never show dark gum borders, and offer superior translucency and strength." },
    ],
    sortOrder: 4,
    active: true,
    seoTitle: "Zirconia Dental Crowns in Mohali | Daily Dental Care",
    seoDescription: "CAD/CAM monolithic zirconia crowns with warranty at Daily Dental Care Mohali.",
  },
  {
    id: 5,
    name: "Teeth Whitening (In-Clinic Laser)",
    slug: "teeth-whitening",
    image: IMG.whitening,
    durationMinutes: 45,
    shortDescription: "Safe, instant cold-laser teeth whitening brightening teeth up to 6–8 shades in 45 minutes.",
    description: "Get a radiant, dazzling smile for weddings, events, or everyday confidence with professional in-chair blue light whitening that protects tooth enamel.",
    price: "₹4,500 onwards",
    benefits: [
      "Brightens teeth by 6 to 8 shades in a single visit",
      "Enamel-safe pH balanced whitening formulation",
      "Includes gum barrier protection for zero irritation",
      "Long-lasting brightness with take-home maintenance tips",
    ],
    procedure: [
      "Initial polish and oral shade measurement",
      "Application of protective gingival barrier on gums",
      "Active whitening gel application with blue light activation",
      "Fluoride post-treatment polish for sensitivity protection",
    ],
    suitableFor: [
      "Stains from tea, coffee, smoking, or red wine",
      "Yellowing due to aging",
      "Pre-wedding or special event smile makeovers",
    ],
    faqs: [
      { q: "Will whitening damage my enamel?", a: "No. Professional dental whitening safely lifts stains from enamel pores without weakening the tooth structure." },
    ],
    sortOrder: 5,
    active: true,
    seoTitle: "Laser Teeth Whitening in Mohali | Daily Dental Care",
    seoDescription: "Instant 45-minute teeth whitening in Phase 7 Mohali.",
  },
  {
    id: 6,
    name: "Preventive Teeth Cleaning & Polishing",
    slug: "teeth-cleaning",
    image: IMG.cleaning,
    durationMinutes: 30,
    shortDescription: "Ultrasonic tartar removal and stain polishing for healthy gums and fresh breath.",
    description: "Painless ultrasonic scaling cleans deep tartar, calculus, and plaque deposits beneath gums, preventing gingivitis, bone loss, and bad breath.",
    price: "₹800 onwards",
    benefits: [
      "Stops gum bleeding and bad breath (halitosis)",
      "Gentle ultrasonic micro-vibrations without scratching enamel",
      "Includes fluoride polishing paste finish",
      "Essential twice-yearly preventive maintenance",
    ],
    procedure: [
      "Periodontal gum depth inspection",
      "Ultrasonic tartar cavitation and plaque removal",
      "Interdental flossing and antiseptic irrigation",
      "Prophy-cup high-gloss polishing",
    ],
    suitableFor: [
      "Routine 6-month dental hygiene",
      "Bleeding gums while brushing",
      "Tea/coffee stains and plaque buildup",
    ],
    faqs: [
      { q: "Does teeth cleaning make teeth loose or create gaps?", a: "No! That is a common myth. Cleaning only removes hardened tartar that was inflaming gums." },
    ],
    sortOrder: 6,
    active: true,
    seoTitle: "Ultrasonic Teeth Cleaning in Mohali | Daily Dental Care",
    seoDescription: "Gentle teeth cleaning & scaling at Daily Dental Care Mohali.",
  },
];

export const DEMO_DOCTORS: DoctorItem[] = [
  {
    id: 1,
    name: "Dr. Dental Specialist (MDS)",
    qualification: "BDS, MDS - Prosthodontics & Implantology",
    specialization: "Dental Implants, Full Mouth Rehab & Zirconia Crowns",
    experience: "12+ Years",
    bio: "Senior Implantologist and Prosthodontist specializing in painless guided implant surgery, digital smile makeovers, and full-arch rehabilitation.",
    photo: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=800",
    active: true,
    serviceIds: [1, 4, 5],
  },
  {
    id: 2,
    name: "Dr. Smile Specialist (MDS)",
    qualification: "BDS, MDS - Orthodontics & Dentofacial Orthopedics",
    specialization: "Invisalign Certified, Clear Aligners & Damon Braces",
    experience: "10+ Years",
    bio: "Certified Invisalign Provider dedicated to precision digital orthodontic treatment for children, teens, and adults.",
    photo: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=800",
    active: true,
    serviceIds: [2],
  },
  {
    id: 3,
    name: "Dr. Care Specialist (MDS)",
    qualification: "BDS, MDS - Conservative Dentistry & Endodontics",
    specialization: "Single-Sitting RCT, Cosmetic Veneers & Restorations",
    experience: "8+ Years",
    bio: "Micro-endodontic specialist focusing on 100% painless rotary root canal treatments, composite bonding, and aesthetic restorations.",
    photo: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=800",
    active: true,
    serviceIds: [3, 5, 6],
  },
];
