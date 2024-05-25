export class CreateDrawingDto {

  constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly imageFile: Express.Multer.File, // Propiedad para manejar la carga de archivos
    public readonly category: string, // ID
  ) { }

  static create(props: { [key: string]: any; }): [string?, CreateDrawingDto?] {

    const {
      name,
      available,
      price,
      description,
      imageFile, // Asegúrate de incluir imageFile en las props
      category,
    } = props;

    if (!name) return ['Missing name'];
    if (!imageFile) return ['Missing image file']; // Verifica si imageFile está presente
    if (!category) return ['Missing category'];

    return [
      undefined,
      new CreateDrawingDto(
        name,
        !!available,
        price,
        description,
        imageFile,
        category,
      )
    ];
  }
}
