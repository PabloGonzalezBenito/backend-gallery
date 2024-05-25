import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },

    available: {
        type: Boolean,
        default: false,
    },

    price: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
    },

    img: {
        type: String,  // Almacena la ruta del archivo como string
        required: [true, 'Image path is required'],
    },

    category: {
        type: String,
        ref: 'Category',
        required: true
    }

});


drawingSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
})

export const DrawingModel = mongoose.model('Drawing', drawingSchema);
