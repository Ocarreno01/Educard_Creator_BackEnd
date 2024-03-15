import { Router } from "express";
import { injectable } from "inversify";
import { TYPES } from "../types";
import { asyncHandler } from "../middlewares/asyncHandler";
import container from "../inversify.config";
import { Controllers } from "../controllers/controllers";

@injectable()
export class Routes {
  private readonly _router: Router;
  private readonly controllers: Controllers;

  constructor() {
    this._router = Router();

    this.controllers = container.get<Controllers>(TYPES.Controllers);

    this._router.post(
      "/createSchool",
      asyncHandler(this.controllers.createSchools)
    );
    this._router.get(
      "/gelAllSchools",
      asyncHandler(this.controllers.gelAllSchools)
    );
    this._router.get(
      "/getGrades/:idScholl",
      asyncHandler(this.controllers.getGrades)
    );
    this._router.get(
      "/getStudents/:idGrade",
      asyncHandler(this.controllers.getStudents)
    );
    this._router.post(
      "/createGrade",
      asyncHandler(this.controllers.createGrade)
    );
    this._router.post(
      "/manageStudents",
      asyncHandler(this.controllers.manageStudents)
    );
  }

  get router(): Router {
    return this._router;
  }
}
