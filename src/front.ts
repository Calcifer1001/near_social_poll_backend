import snsWebSdk from '@sumsub/websdk'

let applicantId: string
let nearAccountId: String

function generateRandomToken(length: number = 16) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const BASE_URL = "http://localhost:3000"

window.onload = async function() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    nearAccountId = urlParams.get('accountId')
    await lauchSamsub(nearAccountId)        
}

async function lauchSamsub(nearAccountId: String) {
    const accessTokenResponse = await fetch(`${BASE_URL}/getNewAccessToken?id=${nearAccountId}`)
    const accessTokenJson = await accessTokenResponse.json()
    const accessToken = accessTokenJson.token
    
    launchWebSdk(accessToken)
}

/**
 * @param accessToken - access token that you generated on the backend in Step 2
 * @param applicantEmail - applicant email (not required)
 * @param applicantPhone - applicant phone, if available (not required)
 * @param customI18nMessages - customized locale messages for current session (not required)
 */
 function 
 launchWebSdk(accessToken, applicantEmail?, applicantPhone?, customI18nMessages?) {
    console.log(accessToken)
    let snsWebSdkInstance = snsWebSdk.init(
            accessToken,
            // token update callback, must return Promise
            // Access token expired
            // get a new one and pass it to the callback to re-initiate the WebSDK
            () => getNewAccessToken()
        )
        .withConf({
            lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
            email: applicantEmail,
            phone: applicantPhone,
            i18n: customI18nMessages, //JSON of custom SDK Translations
            uiConf: {
                customCss: "https://url.com/styles.css"
                // URL to css file in case you need change it dynamically from the code
                // the similar setting at Customizations tab will rewrite customCss
                // you may also use to pass string with plain styles `customCssStr:`
            },
        })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true})
        // see below what kind of messages WebSDK generates
        .on('idCheck.onReady', (payload) => {
            console.log('onReady', payload)
        })
        .on('idCheck.onInitialized', (payload) => {
            console.log('onInitialized', payload)
        })
        .on('idCheck.onStepInitiated', (payload) => {
            console.log('onStepInitiated', payload)
        })
        .on('idCheck.stepCompleted', (payload) => {
            console.log('stepCompleted', payload)
        })
        .on('idCheck.onApplicantLoaded', (payload) => {
            console.log('onApplicantLoaded', payload)
            applicantId = payload.applicantId
            document.querySelector("#samsub-id").innerHTML = applicantId
            fetch("http://localhost:3000/create", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({nearAccountId, samsubId: applicantId 
                })
            })
        })
        .on('idCheck.onApplicantSubmitted', (payload) => {
            console.log('onApplicantSubmitted', payload)
        })
        .on('idCheck.applicantStatus', (payload) => {
            console.log('applicantStatus', payload)
        })
        .on('idCheck.onApplicantResubmitted', (payload) => {
            console.log('onApplicantResubmitted', payload)
        })
        .on('idCheck.onActionSubmitted', (payload) => {
            console.log('onActionSubmitted', payload)
        })
        .on('idCheck.actionCompleted', (payload) => {
            console.log('actionCompleted', payload)
        })
        .on('idCheck.moduleResultPresented', (payload) => {
            console.log('moduleResultPresented', payload)
        })
        .on('idCheck.onResize', (payload) => {
            console.log('onResize', payload)
        })
        .on('idCheck.onError', (error) => {
            console.log('onError', error)
        })
        .build();

    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch('#sumsub-websdk-container')
}

async function getNewAccessToken(): Promise<string> {
    const token = generateRandomToken()
    const accessTokenResponse = await fetch(`${BASE_URL}/getNewAccessToken?id=${token}`)
    const accessTokenJson = await accessTokenResponse.json()
    const accessToken = accessTokenJson.token
    return accessToken
}