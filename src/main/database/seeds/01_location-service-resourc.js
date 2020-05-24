const LocationModel = require("../../app/models/location");
const ServiceModel = require("../../app/models/service");
const LocationServiceModel = require("../../app/models/locationService");
const ResourceModel = require("../../app/models/resource");
const GuestModel = require("../../app/models/guest");

const seed = async (next) => {
  // Check if no location records exist
  const locationRecords = await LocationModel.query().count();

  if (locationRecords[0].count === "0") {
    // Insert location
    await LocationModel.query().insert([
      {
        id: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        code: "L001",
        name: "ECity",
        description: "Electronic City Center",
        city: "Bengaluru",
        country: "India",
        zip: "560068",
        timezone: "Asia/Kolkata",
        openTime: "08:00",
        closeTime: "20:00",
      },
    ]);

    // Insert services
    await ServiceModel.query().insert([
      {
        id: "68bc344d-1906-4f56-a8bc-dd67100bcce5",
        code: "S001",
        name: "Platinum",
        description: "Platinum Service",
        duration: 2 * 60,
      },
      {
        id: "0d5ee548-5e0f-465f-99e9-5e1bf953bc40",
        code: "S002",
        name: "Gold",
        description: "Gold Service",
        duration: 60,
      },
      {
        id: "3e3f8a6e-b516-4e2a-b010-19788c4415c7",
        code: "S003",
        name: "Silver",
        description: "Silver Service",
        duration: 30,
      },
    ]);

    await LocationServiceModel.query().insert([
      {
        locationId: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        serviceId: "68bc344d-1906-4f56-a8bc-dd67100bcce5",
      },
      {
        locationId: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        serviceId: "0d5ee548-5e0f-465f-99e9-5e1bf953bc40",
      },
      {
        locationId: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        serviceId: "3e3f8a6e-b516-4e2a-b010-19788c4415c7",
      },
    ]);

    // Insert resource
    await ResourceModel.query().insert([
      {
        id: "028b177e-9726-44fe-891a-53a68533fa26",
        locationId: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        firstName: "Alice",
        lastName: "A",
        email: "alice@mail.com",
      },
      {
        id: "1f535f05-0625-4730-8ff6-0f3d2d1da6e3",
        locationId: "f48ae944-a70a-4cbd-abfb-71a8329338ac",
        firstName: "Bob",
        lastName: "B",
        email: "b@mail.com",
      },
    ]);

    // Insert guest
    await GuestModel.query().insert([
      {
        id: "6cfdebb1-4674-4749-ba02-22774d5975c7",
        firstName: "Guest",
        lastName: "G",
        email: "guest@mail.com",
      },
    ]);
  }
};

module.exports = { seed };
