import { Response, Request } from 'express';
import { CreateDrawingDto, CustomError, PaginationDto } from '../../domain';
import { DrawingService } from '../services/drawing.service';




export class DrawingController {

    // DI
    constructor(
        private readonly drawingService: DrawingService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    };


    createDrawing = (req: Request, res: Response) => {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const [error, createDrawingDto] = CreateDrawingDto.create({
            ...req.body,
            imageFile: req.file,
        });
        if (error) return res.status(400).json({ error });



        this.drawingService.createDrawing(createDrawingDto!, createDrawingDto.imageFile)
            .then(category => res.status(201).json(category))
            .catch(error => this.handleError(error, res));

    };

    getDrawings = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });


        this.drawingService.getDrawings(paginationDto!)
            .then(drawings => res.json(drawings))
            .catch(error => this.handleError(error, res));

    };


}