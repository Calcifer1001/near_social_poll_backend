import { callSamsubApi, SignatureData } from "./samsubUtils";

interface ApiData {
    method: "GET" | "POST"
    endpoint: string
}

interface ApiDataWithKey {
    [call: string]: ApiData
}

const apiData: ApiDataWithKey = {
    CREATE_APPLICANT: {method: "GET", endpoint: `/resources/applicants/-/levels`},
    // USER_STATUS: {method: "GET", endpoint: `/resources/applicants/{samsubId}/one`},
    USER_STATUS: {method: "GET", endpoint: `/resources/applicants/-;externalUserId={externalUserId}/one`},
    GET_NEW_ACCESS_TOKEN: {method: "POST", endpoint: `/resources/accessTokens?userId={userId}&levelName=basic-kyc-level&ttlInSecs=600`},
}

function getSignatureData(apiData: ApiData): SignatureData {
    return {
        ...apiData,
        timestamp: Math.floor(Date.now() / 1000),
        
    }
}

async function callSamsub(apiData: ApiData) {
    const signatureData: SignatureData = getSignatureData(apiData)
    const response = await callSamsubApi(signatureData)
    return response.json()
}

export async function generateAccessToken(userId: string): Promise<string> {
    let methodApiData = {...apiData.GET_NEW_ACCESS_TOKEN}
    methodApiData.endpoint = methodApiData.endpoint.replace("{userId}", userId)
    return callSamsub(methodApiData)
    
}

export async function getUserStatus(samsubId: string, nearAccountId: string) {
    let methodApiData = {...apiData.USER_STATUS}
    // methodApiData.endpoint = methodApiData.endpoint.replace("{samsubId}", samsubId)
    methodApiData.endpoint = methodApiData.endpoint.replace("{externalUserId}", nearAccountId)
    return callSamsub(methodApiData)
    
}

export async function createApplicant() {
    return callSamsub(apiData.CREATE_APPLICANT)
}
