import { Schema, model } from 'mongoose';
import normalize from "normalize-mongoose/index.js";


const deliveryAddressSchema = new Schema({
  region: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

deliveryAddressSchema.plugin(normalize);

export const deliveryAddressModel = model('DeliveryAddress', deliveryAddressSchema);
