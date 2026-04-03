import { NextFunction, Request,  Response } from "express";
import{ T } from "../libs/types/common";
import MemberService from "../models/Member.service"; 
import StatisticsService from "../models/Statistics.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();
const statisticsService = new StatisticsService();

 const restaurantController: T = {};
 restaurantController.goHome = async(req: Request, res: Response) => {
   console.log("goHome");
   res.render("home");
 };

restaurantController.getSignup = async(req: Request, res: Response) => {
  console.log("getSignup");
  res.render("signup");
};

 restaurantController.getLogin = async(req: Request, res: Response) => {
  console.log("getLogin");
  res.render("login");
};

restaurantController.processSignup = async(req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    }
    
    const newMember: MemberInput = {
      ...req.body,
      memberImage: '/' + file.path.replace(/\\/g, "/").replace(/^[./]+/, ''),
      memberType: MemberType.RESTAURANT
    };
    
    const result = await memberService.processSignup(newMember);
    
    req.session.member = result;
    req.session.save(() => {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error processSignup", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

 restaurantController.processLogin = async(req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(() => {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error processLogin", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

  restaurantController.logout = async(req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(() => {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error logout", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
 

restaurantController.getUsers = async(req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();
    console.log("result:", result);
    res.render("users", { users: result });
  } catch (err) {
    console.log("Error getUsers", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

  restaurantController.updateChosenUser = async(req: Request, res: Response) => {
    try {
      console.log("updateChosenUser");
      const result = await memberService.updateChosenUser(req.body);
      res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
      console.log("Error updateChosenUser", err);
      if(err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

  restaurantController.deleteChosenUser = async(req: Request, res: Response) => {
    try {
      console.log("deleteChosenUser");
      const userId = req.params.id;
      const result = await memberService.deleteChosenUser(userId);
      res.status(HttpCode.OK).json({ data: result }); 
    } catch (err) {
      console.log("Error deleteChosenUser", err);
      if(err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };


 restaurantController.checkAuthSession = async(req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) {
      res.send(`<script>alert("${req.session.member.memberNick}")</script>`);
    } else {
      res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")</script>`);
    }
  } catch (err) {
    console.log("Error checkAuthSession", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

 restaurantController.verifyRestaurant = (
    req: AdminRequest, 
    res: Response, 
    next: NextFunction
    ) => {
    try {
      console.log("verifyRestaurant");
      if (req.session?.member?.memberType === MemberType.RESTAURANT) {
        req.member = req.session.member;
        next();
      } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);
      }
    } catch (err) {
      console.log("Error verifyRestaurant", err);
      if(err instanceof Errors) res.status(err.code).json(err)
      else res.status(Errors.standard.code).json(Errors.standard);
    }
  };

 restaurantController.getDashboardStats = async(req: Request, res: Response) => {
  try {
    console.log("getDashboardStats");
    const stats = await statisticsService.getDashboardStats();
    res.status(HttpCode.OK).json({ data: stats });
  } catch (err) {
    console.log("Error getDashboardStats", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

 restaurantController.getRecentActivity = async(req: Request, res: Response) => {
  try {
    console.log("getRecentActivity");
    const activities = await statisticsService.getRecentActivity();
    res.status(HttpCode.OK).json({ data: activities });
  } catch (err) {
    console.log("Error getRecentActivity", err);
    if(err instanceof Errors) res.status(err.code).json(err)
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

 export default restaurantController; 