import { userPayload } from "./server";

declare global {
    namespace Express{
        interface Request{
            user?: userPayload
        }
    }
}

export {};