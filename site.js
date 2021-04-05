

const selectors = {
    canvas: '#canvas',
    baseFile: '[el="base-container-file"]',
    decimalFile: '[el="base-item-file"]',
    baseNum: '[el="base-container"]',
    decimalNum: '[el="base-item"]',
    submitBtn: '#submit'
}



class ArmyCreator {
    constructor({ base, decimal, baseFile, decimalFile, context, canvas }) {
        this.base = base
        this.baseFile = baseFile
        this.decimal = decimal
        this.decimalFile = decimalFile
        this.context = context
        this.canvas = canvas
    }

    run() {
        this._buildArmy()
    }

    _readImg(imgSource) {
        const fr = new FileReader()
        fr.readAsDataURL(imgSource)
        return new Promise((res, rej) => {
            fr.addEventListener('loadend', (evt) => {
                res(fr.result)
             })     
        }) 
    }

    async _buildArmy() {
        const baseImg = await this._readImg(this.baseFile)
        const decimalImg = await this._readImg(this.decimalFile)

        const totalLevel = this._countBaseConversionStep(this.decimal, this.base)

        const boats = []
        const coordinates = this._getCanvasCoordinates(this.canvas)
        
        let width = coordinates.width / this.base
        let height =  coordinates.height / totalLevel

        let bin = 0

        for (let i = 0; i < totalLevel; i++) {
            boats.push(
                new BoatLevel({
                    context: this.context,
                    knightsNum: this._getQuotient(this.decimal, this.base, i),
                    level: i,
                    width: width,
                    height: height,
                    dy: (height / totalLevel) * i,
                    imgUrl: baseImg,
                    imgKnight: decimalImg
                })
            )
            bin++
        }
    }

    _getQuotient(num, base,  step) {

        let quotient = Math.floor(num / base);
        for (let i = 0; i < step; i++) {
            quotient = Math.floor(quotient / base)
        }
        return quotient
    }


    _countBaseConversionStep(num, base, step) {
        const quotient = Math.floor(num  / base)
        // const mod = num % base
        if (!step) step = 0
        if (quotient == 0)  return step + 0
        return this._countBaseConversionStep(quotient, base, step + 1)
    }

    _getCanvasCoordinates(el) {
        return el.getBoundingClientRect()
    }
    
}


class BoatLevel {
    constructor({context, knightsNum, level, width, height, dy, imgUrl, imgKnight}) {
        this.boats = []
        this.context = context
        this.knightsNum = knightsNum
        this.level = level
        this.width = width
        this.height = height
        this.dyStart = dy
        this.imgUrl = imgUrl
        this.imgKnight = imgKnight

        this.createBoatLevel()
    }

    createBoatLevel() { 
        for (let i = 0; i < 16; i++) {
            this.boats.push(new Boat({
                context: this.context,
                knights: this.knightsNum,
                dx: this.width * i,
                dy: this.dyStart,
                width: this.width,
                height: this.height,
                imageUrl: this.imgUrl,
                imgKnight: this.imgKnight
            }))
        }
    }


}




class Boat {

    constructor({ context, knights, dx, dy, width, height, imageUrl, imgKnight }) {

        this.knights = []
        this.knightsNum = knights
        this.dx = dx
        this.dy = dy
        this.width = width
        this.height = height
        this.imageUrl = imageUrl
        this.imgKnight = imgKnight

        this.context = context
    
        this.drawBoat()
        this.addKnightsToBoat()
        this.drawKnight()
    }


    drawBoat() {
        const img = new Image()
        img.src = this.imageUrl
        img.addEventListener('load', () => {
            this.context.drawImage(img, this.dx, this.dy, this.width, 100 *  img.height / img.width)
        })
    }


    drawKnight() {
        this.knights.forEach(knight => {
            const img = new Image()
            img.src = knight.img
            img.addEventListener('load', () => {
                const width = this.width / this.knights.length
                const height = 100* img.height / img.width
                this.context.drawImage(img, knight.dx, knight.dy, 50, height)
            })
        })
       
    }

    addKnightsToBoat() {
        let count = this.knightsNum

        for (let i = 0; i < count; i++) {
            const positionX = this.dx + (this.width / count) * i
            const positionY = this.dy
            this.knights.push(new Knight({
                parent: this,
                dx: positionX,
                dy: positionY,
                img: this.imgKnight
            }))
        }
    }

    
}

class Knight {
    constructor({ parent, dx, dy, img }) {
        this.parent = parent
        this.dx = dx
        this.dy = dy
        this.img = img
    }

    
}


document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector(selectors.canvas)
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
    const context = canvas.getContext('2d')

    
    const baseFileEl = document.querySelector(selectors.baseFile)
    const baseNumEl = document.querySelector(selectors.baseNum)

    const decimalFileEl = document.querySelector(selectors.decimalFile)
    const decimalNumEl = document.querySelector(selectors.decimalNum)


    const submitBtn = document.querySelector(selectors.submitBtn)
    submitBtn.addEventListener('click', () => {
        const army = new ArmyCreator({
            base: Math.floor(parseInt(baseNumEl.value)),
            baseFile: baseFileEl.files[0],
            decimal: Math.floor(parseInt(decimalNumEl.value)),
            decimalFile: decimalFileEl.files[0],
            context: context,
            canvas: canvas
        })


        army.run()
    })
 
   
})

