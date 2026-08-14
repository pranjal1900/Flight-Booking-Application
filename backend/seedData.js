import Airline from "./models/airlineSchema.js";
import Flight from "./models/flightSchema.js";

function calcArrival(departHour24, departMin, durationHours) {
  const totalMins = departHour24 * 60 + departMin + durationHours * 60;
  const arrHour24 = Math.floor(totalMins / 60) % 24;
  const arrMin = totalMins % 60;
  const period = arrHour24 >= 12 ? "PM" : "AM";
  const displayHour = arrHour24 % 12 === 0 ? 12 : arrHour24 % 12;
  return `${String(displayHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")} ${period}`;
}

function formatTime(hour24, min) {
  const period = hour24 >= 12 ? "PM" : "AM";
  const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
}

export const seedDatabase = async () => {
  try {
    const flightCount = await Flight.countDocuments();
    if (flightCount > 0) {
      console.log(`✈️ Database already has ${flightCount} flights. Skipping seed.`);
      return;
    }

    console.log("🌱 Seeding airlines and flights...");

    const airlineList = [
      { airlineName: "IndiGo",           airlineLogo: "https://pics.avs.io/200/200/6E.png" },
      { airlineName: "Air India",         airlineLogo: "https://pics.avs.io/200/200/AI.png" },
      { airlineName: "SpiceJet",          airlineLogo: "https://pics.avs.io/200/200/SG.png" },
      { airlineName: "Vistara",           airlineLogo: "https://pics.avs.io/200/200/UK.png" },
      { airlineName: "GoFirst",           airlineLogo: "https://pics.avs.io/200/200/G8.png" },
      { airlineName: "AirAsia India",     airlineLogo: "https://pics.avs.io/200/200/I5.png" },
      { airlineName: "Delta Air Lines",   airlineLogo: "https://pics.avs.io/200/200/DL.png" },
      { airlineName: "American Airlines", airlineLogo: "https://pics.avs.io/200/200/AA.png" },
      { airlineName: "United Airlines",   airlineLogo: "https://pics.avs.io/200/200/UA.png" },
      { airlineName: "British Airways",   airlineLogo: "https://pics.avs.io/200/200/BA.png" },
      { airlineName: "Ryanair",           airlineLogo: "https://pics.avs.io/200/200/FR.png" },
      { airlineName: "Lufthansa",         airlineLogo: "https://pics.avs.io/200/200/LH.png" },
      { airlineName: "Air France",        airlineLogo: "https://pics.avs.io/200/200/AF.png" },
      { airlineName: "Emirates",          airlineLogo: "https://pics.avs.io/200/200/EK.png" },
      { airlineName: "Qatar Airways",     airlineLogo: "https://pics.avs.io/200/200/QR.png" },
      { airlineName: "Singapore Airlines",airlineLogo: "https://pics.avs.io/200/200/SQ.png" },
      { airlineName: "Cathay Pacific",    airlineLogo: "https://pics.avs.io/200/200/CX.png" },
      { airlineName: "Southwest Airlines",airlineLogo: "https://pics.avs.io/200/200/WN.png" },
    ];

    const airlines = {};
    for (const data of airlineList) {
      let airline = await Airline.findOne({ airlineName: data.airlineName });
      if (!airline) airline = await Airline.create(data);
      airlines[data.airlineName] = airline;
    }

    const flightsToCreate = [];
    const now = new Date();

    const pushFlights = (routes, daysCount, slots) => {
      for (let day = 0; day <= daysCount; day++) {
        const d = new Date(now.getTime() + day * 86400000);
        const dateStr = d.toISOString().split("T")[0];
        for (const route of routes) {
          for (const slot of slots) {
            flightsToCreate.push({
              airline: airlines[route.airline]._id,
              from: route.from,
              to: route.to,
              departTime: formatTime(slot.h, slot.m),
              arriveTime: calcArrival(slot.h, slot.m, route.duration),
              departDate: dateStr,
              arriveDate: dateStr,
              price: route.price + (day % 7) * 15,
              bookedSeats: [],
            });
          }
        }
      }
    };

    // ── Timeslots ──
    const twoSlots   = [{ h: 6, m: 0 }, { h: 19, m: 0 }];
    const threeSlots = [{ h: 6, m: 0 }, { h: 13, m: 0 }, { h: 20, m: 0 }];
    const intlSlots  = [{ h: 2, m: 0 }, { h: 22, m: 30 }];

    // ══════════════════════════════════════════════════════
    //  INDIAN DOMESTIC — 30 routes × 2 slots × 8 days = 480
    // ══════════════════════════════════════════════════════
    const indianDomestic = [
      { from: "Delhi",      to: "Mumbai",      price: 4500, airline: "IndiGo",       duration: 2 },
      { from: "Mumbai",     to: "Delhi",       price: 4800, airline: "IndiGo",       duration: 2 },
      { from: "Delhi",      to: "Bangalore",   price: 5200, airline: "Air India",    duration: 3 },
      { from: "Bangalore",  to: "Delhi",       price: 5500, airline: "Air India",    duration: 3 },
      { from: "Delhi",      to: "Chennai",     price: 5800, airline: "SpiceJet",     duration: 3 },
      { from: "Chennai",    to: "Delhi",       price: 6000, airline: "SpiceJet",     duration: 3 },
      { from: "Mumbai",     to: "Bangalore",   price: 3800, airline: "Vistara",      duration: 2 },
      { from: "Bangalore",  to: "Mumbai",      price: 4000, airline: "Vistara",      duration: 2 },
      { from: "Delhi",      to: "Kolkata",     price: 4200, airline: "Air India",    duration: 2 },
      { from: "Kolkata",    to: "Delhi",       price: 4400, airline: "Air India",    duration: 2 },
      { from: "Delhi",      to: "Hyderabad",   price: 4000, airline: "IndiGo",       duration: 2 },
      { from: "Hyderabad",  to: "Delhi",       price: 4200, airline: "IndiGo",       duration: 2 },
      { from: "Mumbai",     to: "Goa",         price: 3200, airline: "SpiceJet",     duration: 1 },
      { from: "Goa",        to: "Mumbai",      price: 3400, airline: "SpiceJet",     duration: 1 },
      { from: "Delhi",      to: "Goa",         price: 5000, airline: "GoFirst",      duration: 3 },
      { from: "Goa",        to: "Delhi",       price: 5200, airline: "GoFirst",      duration: 3 },
      { from: "Delhi",      to: "Ahmedabad",   price: 3500, airline: "IndiGo",       duration: 2 },
      { from: "Ahmedabad",  to: "Delhi",       price: 3700, airline: "IndiGo",       duration: 2 },
      { from: "Bangalore",  to: "Hyderabad",   price: 3000, airline: "AirAsia India",duration: 1 },
      { from: "Hyderabad",  to: "Bangalore",   price: 3200, airline: "AirAsia India",duration: 1 },
      { from: "Kolkata",    to: "Mumbai",      price: 5500, airline: "Air India",    duration: 3 },
      { from: "Mumbai",     to: "Kolkata",     price: 5200, airline: "Air India",    duration: 3 },
      { from: "Delhi",      to: "Kochi",       price: 6500, airline: "Vistara",      duration: 3 },
      { from: "Kochi",      to: "Delhi",       price: 6800, airline: "Vistara",      duration: 3 },
      { from: "Mumbai",     to: "Kochi",       price: 4500, airline: "Air India",    duration: 2 },
      { from: "Kochi",      to: "Mumbai",      price: 4800, airline: "Air India",    duration: 2 },
      { from: "Delhi",      to: "Jaipur",      price: 2800, airline: "SpiceJet",     duration: 1 },
      { from: "Jaipur",     to: "Delhi",       price: 3000, airline: "SpiceJet",     duration: 1 },
      { from: "Bangalore",  to: "Chennai",     price: 3500, airline: "IndiGo",       duration: 1 },
      { from: "Chennai",    to: "Bangalore",   price: 3700, airline: "IndiGo",       duration: 1 },
    ];
    pushFlights(indianDomestic, 7, twoSlots); // 30 × 2 × 8 = 480

    // ══════════════════════════════════════════════════════
    //  US DOMESTIC — 10 routes × 2 slots × 3 days = 60
    // ══════════════════════════════════════════════════════
    const usDomestic = [
      { from: "New York",      to: "Los Angeles",   price: 320, airline: "Delta Air Lines",    duration: 6 },
      { from: "Los Angeles",   to: "New York",      price: 340, airline: "Delta Air Lines",    duration: 5 },
      { from: "New York",      to: "Chicago",       price: 180, airline: "American Airlines",  duration: 3 },
      { from: "Chicago",       to: "New York",      price: 190, airline: "American Airlines",  duration: 3 },
      { from: "Los Angeles",   to: "San Francisco", price: 120, airline: "United Airlines",    duration: 1 },
      { from: "San Francisco", to: "Los Angeles",   price: 130, airline: "United Airlines",    duration: 1 },
      { from: "New York",      to: "Miami",         price: 220, airline: "Southwest Airlines", duration: 3 },
      { from: "Miami",         to: "New York",      price: 240, airline: "Southwest Airlines", duration: 3 },
      { from: "Chicago",       to: "Los Angeles",   price: 280, airline: "United Airlines",    duration: 4 },
      { from: "Los Angeles",   to: "Chicago",       price: 300, airline: "United Airlines",    duration: 4 },
    ];
    pushFlights(usDomestic, 2, twoSlots); // 10 × 2 × 3 = 60

    // ══════════════════════════════════════════════════════
    //  EUROPEAN DOMESTIC — 8 routes × 3 slots × 3 days = 72
    // ══════════════════════════════════════════════════════
    const europeanDomestic = [
      { from: "London",    to: "Manchester", price: 80,  airline: "British Airways", duration: 1 },
      { from: "Manchester",to: "London",     price: 85,  airline: "British Airways", duration: 1 },
      { from: "London",    to: "Edinburgh",  price: 90,  airline: "Ryanair",         duration: 1 },
      { from: "Edinburgh", to: "London",     price: 90,  airline: "Ryanair",         duration: 1 },
      { from: "Frankfurt", to: "Munich",     price: 140, airline: "Lufthansa",       duration: 1 },
      { from: "Munich",    to: "Frankfurt",  price: 140, airline: "Lufthansa",       duration: 1 },
      { from: "Paris",     to: "Nice",       price: 120, airline: "Air France",      duration: 2 },
      { from: "Nice",      to: "Paris",      price: 130, airline: "Air France",      duration: 2 },
    ];
    pushFlights(europeanDomestic, 2, threeSlots); // 8 × 3 × 3 = 72

    // ══════════════════════════════════════════════════════
    //  INTERNATIONAL — 20 routes × 2 slots × 3 days = 120
    // ══════════════════════════════════════════════════════
    const international = [
      // India ↔ Middle East
      { from: "Delhi",     to: "Dubai",       price: 18000, airline: "Emirates",          duration: 4 },
      { from: "Dubai",     to: "Delhi",       price: 20000, airline: "Emirates",          duration: 4 },
      { from: "Mumbai",    to: "Dubai",       price: 16000, airline: "Emirates",          duration: 3 },
      { from: "Dubai",     to: "Mumbai",      price: 18000, airline: "Emirates",          duration: 3 },
      { from: "Delhi",     to: "Doha",        price: 17000, airline: "Qatar Airways",     duration: 4 },
      { from: "Doha",      to: "Delhi",       price: 19000, airline: "Qatar Airways",     duration: 4 },
      // India ↔ UK / Europe
      { from: "Delhi",     to: "London",      price: 45000, airline: "British Airways",   duration: 9 },
      { from: "London",    to: "Delhi",       price: 48000, airline: "British Airways",   duration: 9 },
      { from: "Mumbai",    to: "London",      price: 42000, airline: "Air India",         duration: 9 },
      { from: "London",    to: "Mumbai",      price: 46000, airline: "Air India",         duration: 9 },
      // India ↔ Southeast Asia
      { from: "Delhi",     to: "Singapore",   price: 22000, airline: "Singapore Airlines",duration: 6 },
      { from: "Singapore", to: "Delhi",       price: 24000, airline: "Singapore Airlines",duration: 6 },
      { from: "Mumbai",    to: "Singapore",   price: 21000, airline: "Singapore Airlines",duration: 6 },
      { from: "Delhi",     to: "Bangkok",     price: 20000, airline: "Air India",         duration: 5 },
      { from: "Bangkok",   to: "Delhi",       price: 22000, airline: "Air India",         duration: 5 },
      // India ↔ USA
      { from: "Delhi",     to: "New York",    price: 65000, airline: "Air India",         duration: 16 },
      { from: "New York",  to: "Delhi",       price: 70000, airline: "Air India",         duration: 15 },
      // Global Popular Routes
      { from: "London",    to: "New York",    price: 58000, airline: "British Airways",   duration: 8 },
      { from: "New York",  to: "London",      price: 62000, airline: "British Airways",   duration: 7 },
      { from: "Dubai",     to: "London",      price: 45000, airline: "Emirates",          duration: 7 },
    ];
    pushFlights(international, 2, intlSlots); // 20 × 2 × 3 = 120

    await Flight.insertMany(flightsToCreate);

    const indianCount = indianDomestic.length * 2 * 8;
    const usCount     = usDomestic.length * 2 * 3;
    const euCount     = europeanDomestic.length * 3 * 3;
    const intlCount   = international.length * 2 * 3;

    console.log(`✅ Seeded ${flightsToCreate.length} total flights!`);
    console.log(`   🇮🇳 Indian Domestic:  ~${indianCount} flights`);
    console.log(`   🇺🇸 US Domestic:      ~${usCount} flights`);
    console.log(`   🇪🇺 European:         ~${euCount} flights`);
    console.log(`   🌍 International:    ~${intlCount} flights`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};

