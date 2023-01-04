import { Account, connect, Contract, KeyPair, keyStores, Near, WalletConnection } from "near-api-js";
import { env } from "../env";
import { getTransactionLastResult, JsonRpcProvider, Provider } from "near-api-js/lib/providers";

let nearConnection: Near
let account: Account
let provider: Provider
export let contract: Contract

export const DEFAULT_GAS="200"+"0".repeat(12);

export async function connectToNear() {
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = env.NEAR_PRIVATE_KEY
    // creates a public / private key pair using the provided private key
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await myKeyStore.setKey("testnet", env.OWNER_ID, keyPair);

    const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      nearConnection = await connect(connectionConfig);
    //   walletConnection = new WalletConnection(nearConnection, null);
      
      account = await nearConnection.account(env.OWNER_ID);
      contract = new Contract(
        account, // the account object that is connecting
        env.ACCOUNT_ID,
        {
          // name of contract you're connecting to
          viewMethods: ["get_user_data"], // view methods do not change state but usually return a value
          changeMethods: ["add_account", "edit_user_data"], // change methods modify state
        }
      );

      provider = new JsonRpcProvider({ url: connectionConfig.nodeUrl })
}

export async function call(contractId:string, methodName:string, args:Record<string,any>, gas?:String, attachedYoctos?:String):Promise<any>{
    //clear SearchURL before calling to not mix old results with new ones
    // @ts-ignore
    const finalExecOutcome = await contract.add_account(args, gas || DEFAULT_GAS, attachedYoctos || "0")
    return getTransactionLastResult(finalExecOutcome);
}

export async function viewWithoutAccount(contractId: string, method: string, args: any = {}): Promise<any> {
    try {
        const argsAsString = JSON.stringify(args)
        let argsBase64 = Buffer.from(argsAsString).toString("base64")
        const rawResult = await provider.query({
            request_type: "call_function",
            account_id: contractId,
            method_name: method,
            args_base64: argsBase64,
            finality: "optimistic",
        });
    
        // format result
        // @ts-ignore
        const res = JSON.parse(Buffer.from(rawResult.result).toString());
        return res
    } catch(err) {
        console.error(`Error calling function ${method} from contract ${contractId} with params ${JSON.stringify(args)}`, err)
    }
    
}
