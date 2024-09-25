import { useSelector } from "react-redux";
import Template1 from "./Template1";
import Template2 from "./Template2";

function DisplayTotem() {
    const totem = useSelector((state) => state.totem);
    let plantilla = totem.numeroPlantilla;
    console.log(totem);
    switch(plantilla){
        case 1:
            return (
                <Template1/>
            );
            break;
        case 2:
            return (
                <Template2/>
            );
            break;
    }
    
}

export default DisplayTotem