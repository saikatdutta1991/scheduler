"use strict";

const APIBASE = "";
const clientToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlBdXRoS2V5IjoiNmEyNzRkZTItZTNiMC00YWM4LWExZTItMWYwYTRlYTc5YWM3Iiwic3ViIjowLCJpc3MiOiJTY2hlZHVsZXIiLCJpYXQiOjE1OTA3NTg1MzJ9.dEpniAzPDtjkpzS8-9qR1Q8toaLMlnCMtzH0OOYF76M";
const headers = {
  Authorization: clientToken,
};
const endpoints = {
  getLocations: `${APIBASE}/api/v1/locations`,
  getLocation: `${APIBASE}/api/v1/locations/:locationId`,
  getLocationResources: `${APIBASE}/api/v1/locations/:locationId/resources`,
  getBookings: `${APIBASE}/api/v1/bookings?locationId=:locationId&startDate=:startDate&endDate=:endDate`,
};

const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log("Query variable %s not found", variable);
};

const getLocations = async () => {
  return fetch(endpoints.getLocations, { headers })
    .then((response) => response.json())
    .then((data) => data.data);
};

const getLocation = async (locationId) => {
  const endpoint = endpoints.getLocation.replace(":locationId", locationId);

  return fetch(endpoint, { headers })
    .then((response) => response.json())
    .then((data) => data.data);
};

const getLocationResources = async (locationId) => {
  const endpoint = endpoints.getLocationResources.replace(
    ":locationId",
    locationId
  );

  return fetch(endpoint, { headers })
    .then((response) => response.json())
    .then((data) => data.data.resources);
};

const getBookings = async (locationId, startDate, endDate) => {
  const endpoint = endpoints.getBookings
    .replace(":locationId", locationId)
    .replace(":startDate", startDate)
    .replace(":endDate", endDate);
  console.log(endpoint);

  return fetch(endpoint, { headers })
    .then((response) => response.json())
    .then((data) => data.data.bookings);
};

const setCalendarEvents = async (locationId, calendar, date) => {
  console.log("date", date);
  const bookings = await getBookings(locationId, date, date);
  console.log("Bookings fetched");
  calendar.removeAllEvents();
  // Set bookings as event
  for (let booking of bookings) {
    calendar.addEvent({
      resourceId: booking.resourceId,
      id: booking.id,
      title: `${booking.guest.firstName} ${booking.guest.lastName}`,
      start: booking.startTime,
      end: booking.endTime,
    });
  }
};

// Get calenard instance
const getCalendar = (elemId) => {
  var calendarEl = document.getElementById(elemId);

  const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: "UTC",
    resourceAreaWidth: "200px",
    height: "parent",
    headerToolbar: {
      right: "resourceTimelineDay,prev,next",
    },
    aspectRatio: 1,
    initialView: "resourceTimelineDay",
    views: {
      resourceTimelineDay: {
        slotDuration: "00:30",
      },
    },
    resourceAreaHeaderContent: "Resources",
  });

  return calendar;
};
