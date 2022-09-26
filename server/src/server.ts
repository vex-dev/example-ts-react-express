import express from 'express'
import path from 'path'
import {sign} from 'jsonwebtoken';

const buildFolder = '../../client/build'
const { VEX_API_KEY_ID, VEX_API_SECRET, VEX_ROOM_ID } = process.env

function createJWT(roomId: string) {
  const payload = {
    "action": "join",
    "room_id": roomId
  }

  // TypeScript definitions for jsonwebtoken do not allow custom headers, so...
  // @ts-ignore
  return sign(
    payload,
    VEX_API_SECRET,
    {
      header: { "api_key_id": VEX_API_KEY_ID }
    }
  )
}

const app = express()
app.set('views', path.join(__dirname, buildFolder))
app.engine('html', require('ejs').renderFile)

app.use('/static', express.static(path.join(__dirname, `${buildFolder}/static`)))

app.get('/', function (req: Express.Request, res: any) {
  const jwt = createJWT(VEX_ROOM_ID)
  res.render('index.html', { VEX_ROOM_ID, JWT: jwt })
});

app.listen(4000, () => console.log(`Server listening on port 4000`))
