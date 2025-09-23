import { Request,  Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import{ T } from "../libs/types/common"; 
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";




const  productService = new ProductService();

const productController: T = {}; 


  /** SPA */
  productController.getProducts = async(req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const {page, limit, order, productCollection, search} = req.query;
    const inquiry: ProductInquiry = {
      order: String(order) || "createdAt",
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    if(productCollection) {
      inquiry.productCollection = productCollection as ProductCollection;
    }
    if(search) inquiry.search = String(search);
    
     const result = await productService.getProducts(inquiry);
    // console.log(`page: ${page}, order: ${order} `);

    res.status(HttpCode.OK).json(result);
    } catch (err) {
    console.log("Error, getProducts", err);
    if(err instanceof Errors) res.status(err.code).json(err);
      else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) =>{
  try {
    console.log("getProduct");
   const {id} = req.params;

   const memberId = req.member?._id ?? null,
    result = await productService.getProduct(memberId, id);

   res.status(HttpCode.OK).json(result);
    } catch (err) {
    console.log("Error, getProduct:", err);
    if(err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard);
  }
};

  /** SSR */

 productController.getAllProducts = async (req: Request, res: Response) => {
    try {
      console.log("getAllProducts");
      const data = await productService.getAllProducts();
      
      res.render("products", { products: data });
    } catch (err) {
      console.log("Error, getAllProducts", err);
      if(err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

 productController.createNewProduct = async (
  req: AdminRequest, 
  res: Response
) => {
   try {
    console.log("=== CREATE PRODUCT DEBUG ===");
    console.log("createNewProduct - Files:", req.files);
    console.log("createNewProduct - Body:", req.body);
    console.log("createNewProduct - Files length:", req.files?.length);
    
    if (!req.files?.length) {
      console.log("ERROR: No files uploaded");
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    }

      const data: ProductInput = req.body;
      console.log("createNewProduct - Data before processing:", data);
      
      data.productImages = req.files?.map((ele) => {
          const path = ele.path.replace(/\\/g, "/");
          // Convert to relative path for proper serving
          const relativePath = path.replace(/^.*\/uploads\//, "/uploads/");
          console.log("createNewProduct - Image path:", relativePath);
          return relativePath;
      });
      
      console.log("createNewProduct - Final data:", data);

      await productService.createNewProduct(data);
      console.log("createNewProduct - SUCCESS");
      res.send(
        `<script> alert("Successfull creation"); window.location.replace('/admin/product/all') </script>`
      );
    } catch (err) {  
      console.log("ERROR, createNewProduct:", err);
      const message = 
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
     res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
     );
    }
  };

 productController.updateChosenProduct = async (req: Request, res: Response) => {
   try {
    console.log("updateChosenProduct - ID:", req.params.id);
    console.log("updateChosenProduct - Body:", req.body);
   const id = req.params.id;

    const result = await productService.updateChosenProduct(id, req.body);
    console.log("updateChosenProduct - Result:", result);

     res.status(HttpCode.OK).json({data: result});
  } catch (err) {
    console.log("Error, updateChosenProduct", err); 
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
 };

 productController.deleteChosenProduct = async (req: Request, res: Response) => {
   try {
    console.log("deleteChosenProduct");
   const id = req.params.id;

    const result = await productService.deleteChosenProduct(id);

     res.status(HttpCode.OK).json({data: result});
  } catch (err) {
    console.log("Error, deleteChosenProduct", err); 
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
 };

export default productController;