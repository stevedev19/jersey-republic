import mongoose, { Schema } from "mongoose";
import { ProductCollection, ProductSize, ProductStatus, ProductVolume, } from "../libs/enums/product.enum";

const productSchema = new Schema(
    {
      productStatus: {
        type: String,
        enum: ProductStatus,
        default: ProductStatus.PAUSE,
      },

      productCollection: {
        type: String,
        enum: ProductCollection,
        required: true,

      },

      productName: {
        type: String,
        required: true,

      },

      productPrice: {
        type: Number,
        required: true,
      },

      productLeftCount: {
        type: Number,
        required: true,
      },
      productSize: {
        type: String,
        enum: ProductSize,
        default: ProductSize.M,
      },
      productVolume: {
        type: String,
        enum: ProductVolume,
        default: ProductVolume.HOME,
      },

      productDesc: {
        type: String,

      },

      productImages: {
        type: [String],
       default: [],

      },

      productViews: {
        type: Number,
        default: 0,
      },

      teamName: {
        type: String,
      },

      season: {
        type: String,
      },

      playerName: {
        type: String,
      },

    },
    { timestamps: true } //updateAt, createAt
  );


  productSchema.index(
    {productName: 1, productSize: 1, productVolume: 1, teamName: 1}, 
    {unique: true})
  export default mongoose.model("Product", productSchema);