import { Router } from "express";
import { createEvent, getOrganizerEvents, getAllEvents, getParticipantEvents } from "../controllers/eventController.js";
import {verifyToken} from "../middleware/verifyToken.js"; 
import {checkRole} from "../middleware/checkRole.js"; 

const router = Router();

router.get("/organizer", verifyToken, checkRole("organizer"), getOrganizerEvents);
router.get("/participant/all", verifyToken, checkRole("participant"), getAllEvents);
router.get("/participant/myevents", verifyToken, checkRole("participant"), getParticipantEvents);
router.post("/create", verifyToken, checkRole("organizer"), createEvent);

export default router;
