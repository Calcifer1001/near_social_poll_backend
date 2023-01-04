import { getTransactionLastResult } from "near-api-js/lib/providers";
import { env } from "../env";
import { contract, DEFAULT_GAS, viewWithoutAccount } from "./near";

export async function addAccount(accountId: string, samsubId: string, gas:String = DEFAULT_GAS, attachedYoctos:String = "0") {
    const args = {near_account_id: accountId, samsub_id: samsubId, is_valid: false}
    console.log("Called", args)
    // @ts-ignore
    const finalExecOutcome = await contract.add_account({args, gas, amount: attachedYoctos})
    return getTransactionLastResult(finalExecOutcome);
}

export async function getUserData(accountId: string) {
    return viewWithoutAccount(env.ACCOUNT_ID, "get_user_data", {near_account_id: accountId})
}

export function getUsersData(fromIndex: number, limit: number) {
    return viewWithoutAccount(env.ACCOUNT_ID, "get_users_data", {from_index: fromIndex, limit})
}

export function getUsersQuantity() {
    return viewWithoutAccount(env.ACCOUNT_ID, "get_users_quantity")   
}

export async function editUserData(accountId: string, isValid: boolean, gas?:String, attachedYoctos?:String) {
    const args = {near_account_id: accountId, is_valid: isValid}
    // @ts-ignore
    const finalExecOutcome = await contract.edit_user_data(args, gas ?? DEFAULT_GAS, attachedYoctos ?? "0")
    return getTransactionLastResult(finalExecOutcome);
}