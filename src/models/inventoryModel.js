import mongoose from 'mongoose';
import normalize from "normalize-mongoose";

const inventorySchema = new mongoose.Schema({
        product_id: { 
          type: String,
          ref: 'Product', 
          required: true 
        },
        quantity: { type: Number, required: true },
        storageLocation: { type: String, required: true },
        temperature: { type: Number, required: true },
        expirationDate: { type: Date, required: true },
        
      }, {timestamps: true});
      

      inventorySchema.plugin(normalize);
      export const InventoryModel = mongoose.model('Inventory', inventorySchema);
      
      