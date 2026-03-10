import Airline from "./models/airlineSchema.js";
import Flight from "./models/flightSchema.js";

export const seedDatabase = async () => {
  try {
    const flightCount = await Flight.countDocuments();
    if (flightCount > 0) {
      console.log(`✈️ Database already contains ${flightCount} flights.`);
      return;
    }

    console.log("🌱 Seeding sample airlines and flights...");

    let emirates = await Airline.findOne({ airlineName: "Emirates" });
    if (!emirates) {
      emirates = await Airline.create({
        airlineName: "Emirates",
        airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
      });
    }

    let delta = await Airline.findOne({ airlineName: "Delta Air Lines" });
    if (!delta) {
      delta = await Airline.create({
        airlineName: "Delta Air Lines",
        airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Delta_logo.svg",
      });
    }

    let britishAirways = await Airline.findOne({ airlineName: "British Airways" });
    if (!britishAirways) {
      britishAirways = await Airline.create({
        airlineName: "British Airways",
        airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/British_Airways_Logo.svg",
      });
    }

    const flightsToCreate = [];
    const airlines = [emirates, delta, britishAirways];
    const routes = [
      { from: "New York", to: "London", price: 520 },
      { from: "London", to: "New York", price: 580 },
      { from: "Delhi", to: "Mumbai", price: 120 },
      { from: "Mumbai", to: "Delhi", price: 110 },
      { from: "Delhi", to: "London", price: 450 },
      { from: "San Francisco", to: "New York", price: 340 },
    ];

    // Seed flights for the next 30 days
    const now = new Date();
    for (let dayOffset = 0; dayOffset <= 30; dayOffset++) {
      const d = new Date(now.getTime() + dayOffset * 86400000);
      const dateStr = d.toISOString().split("T")[0];

      routes.forEach((route, idx) => {
        const airline = airlines[idx % airlines.length];
        flightsToCreate.push({
          airline: airline._id,
          from: route.from,
          to: route.to,
          departTime: idx % 2 === 0 ? "09:00 AM" : "04:30 PM",
          arriveTime: idx % 2 === 0 ? "09:00 PM" : "11:30 PM",
          departDate: dateStr,
          arriveDate: dateStr,
          price: route.price + (dayOffset % 5) * 10,
          bookedSeats: [],
        });
      });
    }

    await Flight.insertMany(flightsToCreate);
    console.log(`✅ Seed completed successfully! Added ${flightsToCreate.length} sample flights across 30 days.`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};
