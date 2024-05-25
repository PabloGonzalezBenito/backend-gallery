import { Router } from 'express';
import { DrawingRoutes } from './drawing/routes';



export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        //router.use('/api/auth', Authroutes.routes);
        router.use('/api/drawing', DrawingRoutes.routes);

        return router;
    }


}