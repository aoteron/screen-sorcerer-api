import { json, urlencoded } from 'express'

const bodyParserMiddleware = [json(), urlencoded({ extended: true })]

export default bodyParserMiddleware
