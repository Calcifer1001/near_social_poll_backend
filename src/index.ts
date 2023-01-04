import { loadEnv} from "./env";
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { generateAccessToken, getUserStatus } from "./samsub/samsubApi";
import { connectToNear } from "./near/near";
import { addAccount } from "./near/contract";
import { getAllUsers } from "./near/contractHelper";

const PORT = 3000

loadEnv()
const app = express()
const jsonParser = bodyParser.json()



app.options('*', cors())

app.get("/getNewAccessToken", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    if(!req.query.id) {
        res.send(JSON.stringify({error: "Param id not set"}))
        return
    }
    
    const accountId: string = req.query.id.toString()
    res.setHeader("Access-Control-Allow-Origin", "*")
    
    res.send(await generateAccessToken(accountId))
})

app.get("/allUsersStatus", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
    
    const users = await getAllUsers()
    res.send(users)
})

app.post("/create", jsonParser, async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Access-Control-Allow-Origin", "*")
        const body = req.body
        console.log(body)
        // @ts-ignore
        if(!body.nearAccountId || !body.samsubId) {
            res.send(JSON.stringify({error: "This request needs nearAccountId and samsubId"}))
            return
        }
        try {
            // @ts-ignore
            await addAccount(body.nearAccountId, body.samsubId)
            res.send(JSON.stringify({success: "Applicant created successfully"}))
        } catch(err) {
            const errorMessage = JSON.parse(err.message).kind.ExecutionError.split("'")[1]
            res.send(JSON.stringify({error: errorMessage}))
        }
        // Call contract to add user
        
    } catch (err) {
        console.error("Error when creating applicant", err.message)
        res.send(JSON.stringify({error: "Unexpected error. Please, try again or communicate with administrator"}))
    }
})

app.get("/status", async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Access-Control-Allow-Origin", "*")
        if(!req.query.id) {
            res.send(JSON.stringify({error: "Param id not set"}))
            return
        }
        let accountId = req.query.id.toString()
        const samsubId = await generateAccessToken(accountId)
        // const samsubId: string = req.query.id.toString()
        res.send(await getUserStatus(samsubId, accountId))
    } catch (err) {
        console.error("Error when checking applicant status", err.message)
    }
})

app.listen(PORT, async () => {
    await connectToNear()
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});


