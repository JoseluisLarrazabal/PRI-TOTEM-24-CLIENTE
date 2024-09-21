import axios from "axios";

export async function uploadPDF(fileBlob, fileName, apiKey) {
    const formData = new FormData();
    const file = new File([fileBlob], fileName, { type: 'application/pdf' });
    formData.append('file', file);

    const config = {
        headers: {
            'x-api-key': apiKey,
        }
    };

    try {
        const rest = await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, config)
        return rest.data.sourceId
    } catch (e) {
        console.log(e)
    }
}