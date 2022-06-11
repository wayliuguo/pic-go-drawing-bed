import createHeading from './heading.js'
import './main.css'
import icon from './icon.png'
import about from './about.md'

const heading = createHeading()

document.body.append(heading)

const img = new Image()
img.src = icon

document.body.append(img)

document.body.append(about)
