export type Driver = {
  id: string;
  name: string;
  photo: string;
  rating: number;
  trips: number;
  yearsActive: number;
  trustScore: number;
  vehicle: string;
  plate: string;
  etaMin: number;
  distanceKm: number;
};

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Rahul Verma",
    photo: "RV",
    rating: 4.92,
    trips: 1247,
    yearsActive: 4,
    trustScore: 94,
    vehicle: "Maruti Swift",
    plate: "DL 8C AB 1234",
    etaMin: 4,
    distanceKm: 1.2,
  },
  {
    id: "d2",
    name: "Suresh Kumar",
    photo: "SK",
    rating: 4.78,
    trips: 892,
    yearsActive: 3,
    trustScore: 87,
    vehicle: "Hyundai i20",
    plate: "DL 4C XY 5678",
    etaMin: 6,
    distanceKm: 2.1,
  },
  {
    id: "d3",
    name: "Amit Patel",
    photo: "AP",
    rating: 4.65,
    trips: 412,
    yearsActive: 2,
    trustScore: 72,
    vehicle: "Honda City",
    plate: "DL 1C PQ 9012",
    etaMin: 8,
    distanceKm: 3.4,
  },
];

export const mockRides = [
  {
    id: "r1",
    date: "Today",
    from: "Connaught Place",
    to: "IGI Airport T3",
    fare: 580,
    driver: "Rahul Verma",
    status: "completed" as const,
  },
  {
    id: "r2",
    date: "Yesterday",
    from: "Saket",
    to: "Gurgaon Cyber Hub",
    fare: 420,
    driver: "Suresh Kumar",
    status: "completed" as const,
  },
  {
    id: "r3",
    date: "Mon",
    from: "Home",
    to: "Office",
    fare: 180,
    driver: "Amit Patel",
    status: "completed" as const,
  },
];

export const mockTransactions = [
  { id: "t1", type: "Ride", amount: -580, date: "Today, 9:42 AM", icon: "car" },
  {
    id: "t2",
    type: "Top-up",
    amount: 1000,
    date: "Yesterday, 6:15 PM",
    icon: "plus",
  },
  {
    id: "t3",
    type: "Ride",
    amount: -420,
    date: "Yesterday, 8:20 AM",
    icon: "car",
  },
  {
    id: "t4",
    type: "Subscription",
    amount: -299,
    date: "Mon, 12:00 AM",
    icon: "star",
  },
  {
    id: "t5",
    type: "Refund",
    amount: 80,
    date: "Sun, 4:11 PM",
    icon: "rotate",
  },
];

export const mockNotifications = [
  {
    id: "n1",
    group: "Today",
    title: "Ride completed",
    body: "Your ride with Rahul has ended. Rate now.",
    time: "9:42 AM",
    unread: true,
  },
  {
    id: "n2",
    group: "Today",
    title: "Driver assigned",
    body: "Rahul Verma is on the way • ETA 4 min",
    time: "9:18 AM",
    unread: true,
  },
  {
    id: "n3",
    group: "Yesterday",
    title: "Wallet topped up",
    body: "₹1,000 added to your wallet",
    time: "6:15 PM",
    unread: false,
  },
  {
    id: "n4",
    group: "Earlier",
    title: "Welcome to DriverLink Pro",
    body: "Tap to set up your first ride",
    time: "Mon",
    unread: false,
  },
];

export const subscriptionPlans = [
  {
    id: "daily",
    name: "Daily",
    price: 99,
    period: "day",
    perks: ["1 dedicated driver", "Unlimited rides", "Priority support"],
  },
  {
    id: "weekly",
    name: "Weekly",
    price: 599,
    period: "week",
    perks: ["Lock your driver", "10% off all fares", "Free cancellations"],
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 1999,
    period: "month",
    perks: ["Same driver always", "20% off all fares", "VIP support"],
  },
];
