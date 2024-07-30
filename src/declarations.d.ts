declare namespace NodeJS {
    interface ProcessEnv {
        readonly PORT?: string
        readonly HOST?: string
        readonly MODEL_PATH?: string 
    }
}