import { useState } from "react";

function FormularioLogo() {
    const [imagen, setImagen] = useState(null);
    const handleImagenChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setImagen(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // lógica  formulario
    };

    return (
        <>
            <div
                name="portfolio"
                className="bg-gradient-to-b from-black to-gray-800 w-full text-white h-full"
            >
                <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
                    <div className="pb-8">
                        <p className="text-4xl font-bold inline border-b-4 border-gray-500">
                            Logo
                        </p>
                        <p className="py-6">Seleccione la plantilla de su preferencia</p>
                    </div>
                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                        <div className="my-4">
                            <div className="flex items-left justify-left">
                                <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-gray-100 hover:border-blue-300 group">
                                    <div className="flex flex-col items-center justify-center pt-7">
                                        <svg
                                            className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            ></path>
                                        </svg>
                                        <p className="text-base text-gray-300 group-hover:text-blue-900 pt-1 tracking-wider">
                                            Seleccione una imagen
                                        </p>
                                    </div>
                                    <input
                                        className="hidden"
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        onChange={handleImagenChange}
                                    />
                                </label>
                                {imagen && (
                                    <div className="ml-8">
                                        <img
                                            className="h-69 object-cover"
                                            src={imagen}
                                            alt="Previsualización de la imagen"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default FormularioLogo;
