import { userPayload } from "./utils";

declare global {
    namespace Express{
        interface Request{
            user?: userPayload
        }
    }
}

export {};