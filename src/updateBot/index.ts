import { loadEnv } from "../env"
import { editUserData } from "../near/contract"
import { getAllUsers } from "../near/contractHelper"
import { connectToNear } from "../near/near"
import { getUserStatus } from "../samsub/samsubApi"

loadEnv()
run()

async function run() {
    await connectToNear()
    const users = await getAllUsers()
    const invalidUsers = users.filter(u => !u.is_valid)
    const invalidUsersStatus = await Promise.all(invalidUsers.map(u => getUserStatus(u.samsub_id, u.near_account_id)))

    const invalidUsersRegistered = invalidUsersStatus.filter(u => u.id && u.review && u.review.reviewResult)
    const recentlyApprovedUsers = invalidUsersRegistered.filter(u => u.review.reviewResult.reviewAnswer == 'GREEN')

    console.log(recentlyApprovedUsers.map(u => { 
        const result = u.review && u.review.reviewResult ? u.review.reviewResult.reviewAnswer : "Not defined"
        return {id: u.id, acc: u.externalUserId, result, status: u.review.reviewResult}
    }))

    await Promise.all(recentlyApprovedUsers.map(u => editUserData(u.externalUserId, true)))

    
}