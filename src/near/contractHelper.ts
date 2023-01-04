import { getUsersData, getUsersQuantity } from "./contract";

export async function getAllUsers() {
    const usersQuantity = await getUsersQuantity()
    let i = 0
    let users = []
    const limit = 100
    while(i < usersQuantity) {
        const newUsers = await getUsersData(i, limit)
        users = users.concat(newUsers)
        i += limit
    }
    return users
}