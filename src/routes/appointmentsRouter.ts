import { Router, Request, Response } from 'express';
import { 
    getAppointmentsController, 
    getAppointmentByIdController, 
    scheduleAppointmentController, 
    cancelAppointmentController,
    deleteAppointmentController
} from '../controllers/appointmentsController';
import { ScheduleAppointmentDTO } from '../../DOTs/appointmentDTO';

const appointmentsRouter: Router = Router();

appointmentsRouter.get("/", getAppointmentsController);

appointmentsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => 
    getAppointmentByIdController(req, res)
);

appointmentsRouter.post("/schedule", (req: Request<unknown, unknown, ScheduleAppointmentDTO>, res: Response) => 
    scheduleAppointmentController(req, res)
);

appointmentsRouter.put("/cancel/:id", (req: Request<{ id: string }>, res: Response) => 
    cancelAppointmentController(req, res)
);

appointmentsRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => 
    deleteAppointmentController(req, res));


export default appointmentsRouter;