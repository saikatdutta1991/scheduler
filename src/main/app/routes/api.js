const express = require("express");
const router = express.Router();
const checkApiKey = require("../middlewares/checkApiKey");
const Location = require("../controllers/location");
const Service = require("../controllers/service");
const Resource = require("../controllers/resource");
const Guest = require("../controllers/guest");

// const EventModel = require("../models/event")

// const moment = require("moment-timezone");
// console.log(moment('2020-05-23T01:00:00Z').utc())

// const init = async () => {
// await EventModel.query().delete();
// const service = await ServiceModel.query().first();
// const resource1 = await ResourceModel.query().first();
// const resource2 = (await ResourceModel.query())[1];
// console.log("resource1", resource1);
// await EventModel.query().insert([
//   {
//     startTime: "2020-05-20T01:00:00Z",
//     endTime: "2020-05-20T01:29:59Z",
//   }
// ]);
// };
// init();

// const calculateIntervalBlocks = (startDate, endDate, duration) => {
//   const blocks = [];
//   while (startDate <= endDate) {
//     const block = {
//       start: startDate.clone(),
//       end: startDate.add(duration, "minutes").clone().add(-1, "seconds"),
//     };
//     blocks.push(block);
//   }
//   return blocks;
// };

// const start = moment("2020-05-20T00:00:00Z");console.log('start', start)
//   const end = moment("2020-05-20T23:59:59Z");console.log('end', end)
//   console.time("blocks");
//   const blocks = calculateIntervalBlocks(start, end, 60);console.log('blocks', blocks)
//   console.timeEnd("blocks");

router.use(checkApiKey);

router.put("/guests", Guest.validators, Guest.create.bind(Guest));
router.get("/guests", Guest.all.bind(Guest));
router.get("/guests/:id", Guest.one.bind(Guest));
router.delete("/guests/:id", Guest.deleteValidators, Guest.delete.bind(Guest));

router.put(
  "/resources",
  Resource.createValidators,
  Resource.create.bind(Resource)
);
router.get("/resources", Resource.all.bind(Resource));
router.get("/resources/:id", Resource.one.bind(Resource));
router.delete(
  "/resources/:id",
  Resource.deleteValidators,
  Resource.delete.bind(Resource)
);

router.put("/services", Service.validators, Service.create.bind(Service));
router.get("/services", Service.all.bind(Service));
router.get("/services/:id", Service.one.bind(Service));
router.delete(
  "/services/:id",
  Service.deleteValidators,
  Service.delete.bind(Service)
);

router.put("/locations", Location.validators, Location.create.bind(Location));
router.get("/locations", Location.all.bind(Location));
router.get("/locations/:id", Location.one.bind(Location));
router.delete(
  "/locations/:id",
  Location.deleteValidators,
  Location.delete.bind(Location)
);
router.put(
  "/locations/:locationId/services/:serviceId",
  Location.addLocationService.validators,
  Location.addLocationService
);
router.get(
  "/locations/:locationId/services",
  Location.getLocationServices.validators,
  Location.getLocationServices
);

// new change
/** 




const isEventInsideBlock = (event, block) => {
  if (block.start <= event.startTime && block.end >= event.startTime) {
    return true;
  } else if (block.start <= event.endTime && block.end >= event.endTime) {
    return true;
  }
  return false;
};

router.get("/slots", async (req, res) => {
  const start = moment("2020-05-20T00:00:00Z");
  const end = moment("2020-05-20T23:59:59Z");
  console.time("blocks");
  const blocks = calculateIntervalBlocks(start, end, 30);
  console.timeEnd("blocks");

  console.log("resources");
  const resources = await ResourceModel.query().select("id");
  const resourceIds = resources.map((r) => r.id);
  console.log(resourceIds);
  console.timeEnd("resources");

  console.time("resourceEvents");
  const events = await EventModel.query()
    .select("id", "resourceId", "startTime", "endTime")
    .whereIn("resourceId", resourceIds)
    .where("startTime", "<", start)
    .orWhere("endTime", ">", end);

  const resourceEvents = {};
  _.each(resourceIds, (rId) => {
    if (!resourceEvents[rId]) {
      resourceEvents[rId] = [];
    }

    // Check which events are for current resource
    _.each(events, (event) => {
      if (event.resourceId === rId) {
        resourceEvents[rId].push(event);
      }
    });
  });
  console.log(resourceEvents);
  console.timeEnd("resourceEvents");

  const withResouceId = true;
  const availBlocks = [];
  _.each(blocks, (block) => {
    let isAvailable = false;
    for (rId in resourceEvents) {
      let isInsideResouceEvent = false;
      for (event of resourceEvents[rId]) {
        if (isEventInsideBlock(event, block)) {
          isInsideResouceEvent = true;
        }
      }
      isAvailable = !(isInsideResouceEvent && !isAvailable);

      if (isAvailable && withResouceId) {
        availBlocks.push(_.merge(_.clone(block), { resouceId: rId }));
      }
    }
    if (isAvailable && !withResouceId) {
      availBlocks.push(block);
    }
  });

  return sendResponse(res, codes.OK, "OK", "Ok", {
    curr: moment(),
    test: moment("2020-05-20T00:30:00Z"),
    alen: availBlocks.length,
    availBlocks,
    len: blocks.length,
    blocks,
  });
});
*/

router.get("/", (req, res) => {
  return sendResponse(res, codes.OK, "OK", "Ok");
});

app.use("/api/v1/", router);
