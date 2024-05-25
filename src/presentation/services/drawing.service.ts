import { DrawingModel } from '../../data/mongo/models/drawing.model';
import { CustomError } from '../../domain/errors/custom.error';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { CreateDrawingDto } from '../../domain/dtos/drawings/create-drawing.dto';

import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { envs } from '../../config/envs';

export class DrawingService {

    // DI
    constructor() { }


    async createDrawing(createDrawingDto: CreateDrawingDto, imageFile: Express.Multer.File) {

        const drawingExists = await DrawingModel.findOne({ name: createDrawingDto.name });
        if (drawingExists) throw CustomError.badRequest('Drawing already exists');

        try {

            // Ruta de la carpeta de subidas en tu servidor
            const uploadDir = path.join(__dirname, '../../uploads');

            // Ruta completa de la imagen en el servidor
            const imagePath = path.join(uploadDir, imageFile.filename);

            // Crea un stream de lectura desde el archivo subido
            const readStream = fs.createReadStream(imageFile.path);

            // Crea un stream de escritura hacia la ubicación deseada
            const writeStream = fs.createWriteStream(imagePath);

            // Usa el método pipe para mover el archivo
            readStream.pipe(writeStream);

            // Elimina el archivo temporal después de moverlo
            fs.unlinkSync(imageFile.path);

            const drawing = new DrawingModel({
                ...createDrawingDto,
                img: `/uploads/${imageFile.filename}`
            });

            await drawing.save();

            return drawing;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }



    async getDrawings(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, drawings] = await Promise.all([
                DrawingModel.countDocuments(),
                DrawingModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            // Mapea los dibujos para ajustar las rutas de las imágenes
            const drawingsWithImageUrls = drawings.map(drawing => {
                return {
                    ...drawing.toJSON(),
                    img: `${envs.WEBSERVICE_URL}${drawing.img}` // Suponiendo que BASE_URL contiene la URL base de tu servidor
                };
            });

            return {
                page: page,
                limit: limit,
                total: total,
                next: (page + 1 <= Math.ceil(total / limit)) ? `/api/drawings?page=${(page + 1)}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/api/drawings?page=${(page - 1)}&limit=${limit}` : null,
                drawings: drawingsWithImageUrls
            };
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error');
        }
    }


}


