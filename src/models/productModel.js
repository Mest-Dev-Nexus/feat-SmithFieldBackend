import mongoose from "mongoose";
import normalize from "normalize-mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  qualityGrade: { 
    type: String, 
    enum: ['Grade A', 'Grade B', 'Grade C'],
    required: true 
  },
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
 
}, { timestamps: true });

productSchema.plugin(normalize);
export const ProductModel = mongoose.model('Product', productSchema);


