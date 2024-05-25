import { Router } from 'express';
//import { AuthMiddleware } from '../middlewares/auth.middleware';
import { DrawingController } from './controller';
import { DrawingService } from '../services/drawing.service';
import { upload } from '../middlewares/multer.middleware'; // Importa el middleware de Multer





export class DrawingRoutes {


  static get routes(): Router {

    const router = Router();
    const drawingService = new DrawingService();
    const controller = new DrawingController(drawingService);

    // Definir las rutas
    router.get('/', controller.getDrawings);
    router.post('/', upload.single('image'), controller.createDrawing);




    return router;
  }


}

