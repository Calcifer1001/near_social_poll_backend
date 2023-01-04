import * as CryptoJs from "crypto-js"
import { env } from "../env";

export interface SignatureData {
    timestamp: number
    method: "GET" | "POST"
    endpoint: string
    body?: string
}

function buildValueToSign(signatureData: SignatureData): string {
    return signatureData.timestamp + signatureData.method.toUpperCase() + signatureData.endpoint; // add body
}

function sign(signatureData: SignatureData) {
    const valueToSign = buildValueToSign(signatureData)
    const secretKey = env.SECRET_KEY
    return CryptoJs.enc.Hex.stringify(CryptoJs.HmacSHA256(valueToSign, secretKey));
}

export async function callSamsubApi(signatureData: SignatureData): Promise<Response> {
    const signature = sign(signatureData)
    const url = `${env.SAMSUB_BASE_URL}${signatureData.endpoint}`
    
    return fetch(url, {
        method: signatureData.method,
        headers: {
            'X-App-Token': env.SAMSUB_TOKEN,
            'X-App-Access-Ts': signatureData.timestamp.toString(),
            'X-App-Access-Sig': signature
        }
    })
}