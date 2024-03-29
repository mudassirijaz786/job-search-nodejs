const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const { Appointment } = require("../models/appointment");
const validateObjectId = require("../middleware/validateObjectId");
const { model } = require("mongoose");

router.get("/", auth, async (req, res) => {
  const appointments = await Appointment.find()
    .populate({
      path: "expert",
      mode: "Expert",
      populate: {
        path: "provider",
        model: "User",
        select: "-password",
      },
    })
    .populate({
      path: "customer",
      model: "User",
    })
    .populate({
      path: "service",
      model: "ExpertService",
      populate: {
        path: "service",
        model: "Service",
        populate: {
          path: "category",
          model: "Category",
        },
      },
    })
    .exec();

  appointments.length > 0
    ? res.json({ data: appointments })
    : res.status(403).json({ message: "Not found.." });
});

router.get("/totalAppointments", auth, async (req, res) => {
  const total = await Appointment.count();
  res.json({ total });
});
// :TODO: Need to be tested accurately...
// :FIXME: Need to be tested accurately...
router.get("/appointmentToday", auth, async (req, res) => {
  console.log(new Data().toString());
  const appointments = await Appointment.find({ created_at: new Date().now });
});

// router.get("/status" , async (req, res))
// :TODO: Need to be tested accurately...
// :FIXME: Need to be tested accurately...
router.get("/status", auth, async (req, res) => {
  const appointment = await Appointment.find();
  const data = _.groupBy(appointment, [
    function (item) {
      return item.status;
    },
  ]);
  res.json(data);
});

router.get("/pendingAppointments/:id", async (req, res) => {
  const appointments = await Appointment.find({
    customer: req.params.id,
    status: "Pending",
  })
    .populate({
      path: "expert",
      mode: "Expert",
      populate: {
        path: "provider",
        model: "User",
        select: "-password",
      },
    })
    .populate({
      path: "customer",
      model: "User",
    })
    .populate({
      path: "service",
      model: "ExpertService",
      populate: {
        path: "service",
        model: "Service",
        populate: {
          path: "category",
          model: "Category",
        },
      },
    })
    .exec();

  appointments.length > 0
    ? res.json({ statusCode: 200, data: appointments })
    : res.status(404).json({
        statusCode: 404,
        message: "Could not found any appointments pending.",
      });
});

router.get("/completedAppointments/:id", async (req, res) => {
  const appointments = await Appointment.find({
    customer: req.params.id,
    status: "Completed",
  })
    .populate({
      path: "expert",
      mode: "Expert",
      populate: {
        path: "provider",
        model: "User",
        select: "-password",
      },
    })
    .populate({
      path: "customer",
      model: "User",
    })
    .populate({
      path: "service",
      model: "ExpertService",
      populate: {
        path: "service",
        model: "Service",
        populate: {
          path: "category",
          model: "Category",
        },
      },
    })
    .exec();

  appointments.length > 0
    ? res.json({ statusCode: 200, data: appointments })
    : res.status(404).json({
        statusCode: 404,
        message: "Could not found any appointments completed.",
      });
});

router.get("/me/:id", validateObjectId, auth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: "expert",
      mode: "Expert",
      populate: {
        path: "provider",
        model: "User",
        select: "-password",
      },
    })
    .populate({
      path: "customer",
      model: "User",
    })
    .populate({
      path: "service",
      model: "ExpertService",
      populate: {
        path: "service",
        model: "Service",
        populate: {
          path: "category",
          model: "Category",
        },
      },
    })
    .exec();

  appointment
    ? res.json({ data: appointment })
    : res.status(403).json({ message: "Not found.." });
});

router.post("/", async (req, res) => {
  const appointment = new Appointment(
    _.pick(req.body, ["timeSlot", "expert", "customer", "service"])
  );
  await appointment.save();
  appointment
    ? res.json({ message: "Appointment saved successfully" })
    : res.status(403).json({ message: "Error in saving the appointment" });
});

router.put("/setStatus/:id", validateObjectId, auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
    $set: { status: req.body.status },
  });

  appointment
    ? res.json({
        message: `Appointment status set to ${req.body.status} successfully`,
      })
    : res.status(400).json({
        message: "There is error setting status to " + req.body.status,
      });
});

router.put("/:id", validateObjectId, auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  appointment
    ? res.json({ message: "Appointment updated successfully" })
    : res.status(400).json({ message: "Error in updaing the appointment" });
});

router.delete("/:id", validateObjectId, auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);
  appointment
    ? res.json({ message: "Appointment has removed..." })
    : res.status(400).json({
        message: "Could not delete the appointment. Try again later..",
      });
});

module.exports = router;
