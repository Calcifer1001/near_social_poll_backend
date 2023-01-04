import { EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
    SAMSUB_BASE_URL: String,
    SECRET_KEY: String,
    SAMSUB_TOKEN: String,
    NEAR_PRIVATE_KEY: String,
    ACCOUNT_ID: String,
    OWNER_ID: String,
};

export let env: Env

export function loadEnv(): void {
    env = load(schema, __dirname+'/../.env');
}