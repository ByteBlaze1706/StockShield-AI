import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { stocksRouter } from "./stocks";
import { analysisRouter } from "./analysis";
import { alertsRouter } from "./alerts";
import { watchlistRouter } from "./watchlist";
import { chatRouter } from "./chat";
import { dashboardRouter } from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/stocks", stocksRouter);
router.use("/stocks", analysisRouter);
router.use("/alerts", alertsRouter);
router.use("/watchlist", watchlistRouter);
router.use("/chat", chatRouter);
router.use("/dashboard", dashboardRouter);

export default router;
