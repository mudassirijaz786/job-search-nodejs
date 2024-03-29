const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  timeSlot: {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  review: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: String,
    required: true,
    default: new Date(),
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpertService",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Cancel",
      "Accept",
      "Denied",
      "Assign",
      "InProgress",
      "Completed",
    ],
    required: true,
    default: "Pending",
  },
});

const Appointment = mongoose.model("Appointment", schema);

validateAppointment = (appointment) => {
  const schema = {
    category_id: Joi.ObjectId().required(),
    service_id: Joi.ObjectId().required(),
    expert_id: Joi.ObjectId().required(),
    status: Joi.string().required(),
  };
  return Joi.validate(appointment, schema);
};

exports.Appointment = Appointment;
exports.validate = validateAppointment;
