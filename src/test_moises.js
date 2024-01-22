import "dotenv/config"
import Moises from "moises/sdk.js"

const moises = new Moises({ apiKey: process.env.API_KEY })

await moises.processFile(
    "TesteHackTheMusic",
    "how-to-eat-chicken.mp3",
    "../output"
)
