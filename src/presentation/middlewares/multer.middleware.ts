import multer from 'multer';

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán los archivos subidos
    },
    filename: function (req, file, cb) {
        // Usa la fecha actual como nombre de archivo para evitar colisiones
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

// Middleware de Multer
export const upload = multer({ storage: storage });
