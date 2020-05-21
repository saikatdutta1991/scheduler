const express = require("express");
const router = express.Router();
const moment = require("moment");
const _ = require("lodash");
const ServiceModel = require("../models/service");
const ResourceModel = require("../models/resource");
const EventModel = require("../models/event");
// new change
/** 
const init = async () => {
  await EventModel.query().delete();
  const service = await ServiceModel.query().first();
  const resource1 = await ResourceModel.query().first();
  const resource2 = (await ResourceModel.query())[1];
  console.log("resource1", resource1);
  await EventModel.query().insert([
    {
      serviceId: service.id,
      resourceId: resource1.id,
      startTime: moment("2020-05-20T01:00:00Z"),
      endTime: moment("2020-05-20T01:29:59Z"),
    },
    {
      serviceId: service.id,
      resourceId: resource2.id,
      startTime: moment("2020-05-20T01:00:00Z"),
      endTime: moment("2020-05-20T01:29:59Z"),
    },
  ]);
};
init();

router.get("/", (req, res) => {
  return sendResponse(res, codes.OK, "OK", "Ok");
});

const calculateIntervalBlocks = (startDate, endDate, duration) => {
  const blocks = [];
  while (startDate <= endDate) {
    const block = {
      start: startDate.clone(),
      end: startDate.add(duration, "minutes").clone().add(-1, "seconds"),
    };
    blocks.push(block);
  }
  return blocks;
};

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
app.use("/api/v1/", router);
