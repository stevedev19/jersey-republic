import { ProductStatus } from "../libs/enums/product.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";


class ProductService {
    private readonly productModel;
    public viewService;

constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA */

  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
const match: T = {productStatus: {$in: [ProductStatus.PROCESS, ProductStatus.PAUSE]}};

if(inquiry.productCollection)
   match.productCollection = inquiry.productCollection;
if(inquiry.search) {
    match.productName = {$regex: new RegExp(inquiry.search, "i")}
}

const sort: T =
 inquiry.order === "productPrice" 
? { [inquiry.order] : -1} 
: { [inquiry.order] : -1};

console.log("Sorting by:", sort);
console.log("Query parameters:", inquiry);

const result = await this.productModel
.aggregate([
{$match: match},
{$sort: sort},
{$skip: (inquiry.page * 1 - 1)*inquiry.limit },
{$limit: inquiry.limit * 1 },
])
.exec();
console.log("Raw database result:", result);
if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

// Transform image URLs to full URLs and filter out non-existent files
const transformedResult = result.map((product: any) => ({
  ...product,
  productImages: product.productImages?.map((imagePath: string) => 
    imagePath.startsWith('http') ? imagePath : `http://localhost:3003${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
  ).filter((url: string) => {
    // For now, we'll include all URLs and let the frontend handle missing images
    // In production, you might want to check file existence here
    return true;
  }) || []
}));

console.log("Final transformed result:", transformedResult);
return transformedResult as unknown as Product[];
}


public async getProduct(
  memberId: ObjectId | null, 
  id: string
): Promise<Product> {
const productId = shapeIntoMongooseObjectId(id);

let result = await this.productModel
.findOne({
  _id: productId, 
  productStatus: {$in: [ProductStatus.PROCESS, ProductStatus.PAUSE]},
})
.exec();
if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

// TODO: if authenticated users => first => view log creation

if(memberId) {
// Check Existence
const input: ViewInput = {
    memberId: memberId,
    viewRefId: productId,
    viewGroup: ViewGroup.PRODUCT,
};
const existView = await this.viewService.checkViewExistence(input)

console.log("exist:", !!existView);
if(!existView) {
  //  Insert View
  await this.viewService.insertMemberView(input);

   //  Increase Counts
    result = await this.productModel
    .findByIdAndUpdate(
      productId, 
      {$inc:{ productViews: +1 } },
       { new: true }
      )
       .exec();
  }
}

// Transform image URLs to full URLs
if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

const transformedResult = {
  ...result.toObject(),
  productImages: result.productImages?.map((imagePath: string) => 
    imagePath.startsWith('http') ? imagePath : `http://localhost:3003${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
  ).filter((url: string) => {
    // For now, we'll include all URLs and let the frontend handle missing images
    return true;
  }) || []
};

return transformedResult as unknown as Product;


    //Increase Target View
}

  /** SSR */

public async getAllProducts(): Promise<Product[]> {
   
   const result = await this.productModel.find().exec();
   if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

   // Transform image URLs to full URLs
   const transformedResult = result.map((product: any) => ({
     ...product.toObject(),
     productImages: product.productImages?.map((imagePath: string) => 
       imagePath.startsWith('http') ? imagePath : `http://localhost:3003${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
     ).filter((url: string) => {
       // For now, we'll include all URLs and let the frontend handle missing images
       return true;
     }) || []
   }));

   console.log("result:", transformedResult);
   return transformedResult as unknown as Product[];
}

public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
       console.log("=== PRODUCT SERVICE DEBUG ===");
       console.log("createNewProduct - Input:", input);
       console.log("createNewProduct - Required fields check:");
       console.log("- productCollection:", input.productCollection);
       console.log("- productName:", input.productName);
       console.log("- productPrice:", input.productPrice);
       console.log("- productLeftCount:", input.productLeftCount);
       console.log("- productImages:", input.productImages);
       
       const result = await this.productModel.create(input) as unknown as Product;
       console.log("createNewProduct - Database result:", result);
       
       // Ensure image URLs have proper format for frontend consumption
       if (result.productImages) {
         result.productImages = result.productImages.map((imagePath: string) => 
           imagePath.startsWith('http') ? imagePath : `http://localhost:3003${imagePath}`
         );
       }
       
       console.log("createNewProduct - Final result:", result);
       return result;
      } catch (err) {
      console.error("ERROR, model: createNewProduct:", err);
      console.error("Error details:", (err as Error).message);
      console.error("Error stack:", (err as Error).stack);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      } 
   }

   public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
): Promise<Product> {
   id = shapeIntoMongooseObjectId(id);
   const result = await this.productModel
   .findOneAndUpdate({ _id: id }, input, { new: true })
   .exec();
   if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

   return result as unknown as Product;
  }

  public async deleteChosenProduct(id: string): Promise<Product> {
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
    .findByIdAndDelete({ _id: id })
    .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Product;
  }
}

export default ProductService;