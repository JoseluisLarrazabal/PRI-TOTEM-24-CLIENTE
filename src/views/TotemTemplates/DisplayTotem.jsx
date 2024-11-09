import { useSelector } from "react-redux";
import Template1 from "./Template1";
import Template2 from "./Template2";

function DisplayTotem() {
    const totem = useSelector((state) => state.totem);
    let plantilla = totem.numeroPlantilla;
    
    // Eliminar el console.log si ya no es necesario
    console.log(totem); // Solo si necesitas verificar los datos del totem

    switch(plantilla){
        case 1:
            return <Template1 />;
        case 2:
            return <Template2 />;
        default:
            return <div>No se ha seleccionado una plantilla válida.</div>; // Manejo por defecto
    }
}

export default DisplayTotem;
