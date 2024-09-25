import axios from "axios"
import { uploadPDF } from "./UploadPDFToChatPDF"
import { base64ToBlob } from "./ConvertToBlob"
import connectionString from "../../components/connections/connection"

export async function getPdfFiles(totemId, apiKey) {

    let sourceId = null

    try {
        const response = await axios.get(`${connectionString}/Archivo/FilesContent/${totemId}`)
        const base64Files = response.data
        await Promise.all(
            base64Files.map(async (file) => {
                const fileBlob = base64ToBlob(file.contenidoArchivo, 'application/pdf')
                sourceId = await uploadPDF(fileBlob, file.nombreArchivo, apiKey)
            })
        )
        return sourceId
    } catch (e) {
        console.error('Error fetching and uploading files:', e)
    }
}