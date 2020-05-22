const LocationModel = require("../../app/models/location");
const ServiceModel = require("../../app/models/service");
const LocationServiceModel = require("../../app/models/locationService");

const seed = async (next) => {
  // Check if no location records exist
  const locationRecords = await LocationModel.query().count();

  if (locationRecords[0].count === "0") {
    await LocationModel.query().insert([
      {
        code: "L001",
        name: "ECity",
        description: "Electronic City Center",
        city: "Bengaluru",
        country: "India",
        zip: "560068",
        timezone: "Asia/Kolkata",
        openTime: "09:00",
        closeTime: "18:00",
      },
      {
        code: "L002",
        name: "SSignal",
        description: "Sony Singnal Center",
        city: "Bengaluru",
        country: "India",
        zip: "560068",
        timezone: "Asia/Kolkata",
        openTime: "09:00",
        closeTime: "18:00",
      },
    ]);
  }

  // Check if no service records exist
  const serviceRecords = await ServiceModel.query().count();

  if (serviceRecords[0].count === "0") {
    await ServiceModel.query().insert([
      {
        code: "S001",
        name: "Platinum",
        description: "Platinum Service",
        duration: 2 * 60,
      },
      {
        code: "S002",
        name: "Gold",
        description: "Gold Service",
        duration: 60,
      },
      {
        code: "S003",
        name: "Silver",
        description: "Silver Service",
        duration: 30,
      },
    ]);
  }

  const Loc1 = await LocationModel.query()
    .select("id")
    .findOne({ code: "L001" });
  const Loc2 = await LocationModel.query()
    .select("id")
    .findOne({ code: "L002" });

  const S1 = await ServiceModel.query().select("id").findOne({ code: "S001" });
  const S2 = await ServiceModel.query().select("id").findOne({ code: "S002" });
  const S3 = await ServiceModel.query().select("id").findOne({ code: "S003" });

  if (Loc1 && Loc2 && S1 && S2 && S3) {
    await LocationServiceModel.query().insert([
      {
        locationId: Loc1.id,
        serviceId: S1.id,
      },
      {
        locationId: Loc1.id,
        serviceId: S2.id,
      },
      {
        locationId: Loc1.id,
        serviceId: S3.id,
      },
      {
        locationId: Loc2.id,
        serviceId: S1.id,
      },
      {
        locationId: Loc2.id,
        serviceId: S2.id,
      },
      {
        locationId: Loc2.id,
        serviceId: S3.id,
      },
    ]);
  }
};

module.exports = { seed };
