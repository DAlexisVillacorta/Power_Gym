import { Request, Response, Router } from 'express';
import { 
    getUserByIdController, 
    getUsersController, 
    loginUserController, 
    registerUserController 
} from '../controllers/usersController';
import { UserLoginDTO, UserRegisterDTO } from '../../DOTs/UserDOTs';

const usersRouter: Router = Router();

usersRouter.get("/users", getUsersController);

usersRouter.get("/users/:id", (req: Request<{ id: string }>, res: Response) => 
    getUserByIdController(req, res)
);

usersRouter.post("/users/register", (req: Request<unknown, unknown, UserRegisterDTO>, res: Response) => 
    registerUserController(req, res)
);
usersRouter.post("/users/login", (req: Request<unknown, unknown, UserLoginDTO>, res: Response) => 
    loginUserController(req, res)
);

export default usersRouter;