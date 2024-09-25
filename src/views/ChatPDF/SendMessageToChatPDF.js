import axios from "axios";

export async function sendMessageToChatPDF(apiKey, sourceId, message) {
    if (sourceId === null) {
        alert("No se encontro un id De Origen. Porfavor selecciona un PDF primero");
    } else {

        const res = await axios.post(
            "https://api.chatpdf.com/v1/chats/message",
            JSON.stringify({
                role: "user",
                messages: [{ "role": "user", "content": message }],
                sourceId: sourceId
            }),
            {
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json"
                }
            }
        )
        return res.data.content
    }
}