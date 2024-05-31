import axios from "axios"
import { useEffect, useState } from "react"
import connectionString from "../../components/connections/connection"
import { useParams } from "react-router-dom"

function ChatTotem() {

    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [input, setInput] = useState('')

    const [sourceId, setSourceId] = useState('')

    const [response, setResponse] = useState("");

    const apiKey = "sec_6Iv3eMYHKFN3Qkdwa6rF70GRcAaRgoK6"

    useEffect(() => {
        const fetchAndUploadFiles = async () => {
            try {
                const response = await axios.get(`${connectionString}/Archivo/FilesContent/${id}`);
                const base64Files = response.data;
                await Promise.all(
                    base64Files.map(async (file) => {
                        const fileBlob = base64ToBlob(file.contenidoArchivo, 'application/pdf');
                        await uploadPDF(fileBlob, file.NombreArchivo);
                    })
                );

                setLoading(false);
            } catch (error) {
                console.error('Error fetching and uploading files:', error);
                setLoading(false);
            }
        };

        fetchAndUploadFiles();
    }, [id])

    const base64ToBlob = (base64, contentType) => {
        const byteCharacters = atob(base64);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    const uploadPDF = async (fileBlob, fileName) => {
        const formData = new FormData();
        const file = new File([fileBlob], fileName, { type: 'application/pdf' });
        formData.append('file', file);

        const config = {
            headers: {
                'x-api-key': apiKey,
            }
        };

        await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, config)
            .then(res => {
                setSourceId(res.data)
            })
            .catch(err => console.error("No se pudo cargar los archivos", err))
    }

    const handleSendMessage = () => {

        if (sourceId === null) {
            alert("No se encontro un id De Origen. Porfavor selecciona un PDF primero");
        } else {
            fetch("https://api.chatpdf.com/v1/chats/message", {
                method: 'POST',
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: "user",
                    messages: [{ "role": "user", "content": input }],
                    sourceId: sourceId.sourceId
                })
            })
                .then(res => res.json())
                .then(data => {
                    setResponse(data.content)
                    speakDescription(data.content)
                })
                .catch(err => console.error(err))
        }
    }

    const speakDescription = (content) => {
        const valueSpeech = new SpeechSynthesisUtterance(content);
        window.speechSynthesis.speak(valueSpeech);
    }


    if (loading) {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>;
    }

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="container mx-auto bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-300">
                    <p className="text-4xl font-bold text-center text-gray-700">Consulta al totem</p>
                </div>
                <div className="flex-col p-4 space-y-4 overflow-y-auto h-100">
                    <div>
                        <textarea
                            value={response}
                            id="response"
                            className="block w-full mb-4 text-black bg-white border border-gray-300 rounded-md focus:border-blue-500 h-96"
                            placeholder="..."
                            readOnly></textarea>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-300">
                    <textarea
                        value={input}
                        onChange={(e) => {
                            const newValue = e.target.value
                            setInput(newValue)
                        }}
                        className="block w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                        placeholder="Por favor, redacte su consulta..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="block w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatTotem