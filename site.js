

const selectors = {
    canvas: '#canvas',
    baseFile: '[el="base-container-file"]',
    decimalFile: '[el="base-item-file"]',
    baseNum: '[el="base-container"]',
    decimalNum: '[el="base-item"]',
    submitBtn: '#submit'
}

//

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

        const coordinates = this._getCanvasCoordinates(this.canvas)
        
        let width = coordinates.width / this.base
        let height =  coordinates.height / totalLevel

        let bin = 0

        for (let i = 0; i < totalLevel; i++) {
                new Level({
                    context: this.context,
                    knightsNum: this._getQuotient(this.decimal, this.base, i),
                    level: i,
                    width: width,
                    height: height,
                    dy: (height / totalLevel) * i,
                    imgUrl: baseImg,
                    imgKnight: decimalImg
                })
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


class Level {
    constructor({level, width, dy, imgUrl}) {
        this.figurines = []
        this.level = level
        this.width = width
        this.dyStart = dy
        this.imgUrl = imgUrl
    }

    addContainer(container) {
        this.figurines.push(figurine)
    }

}


class Figurine {
    constructor({dx, dy, width, img}) {
        this.dx = dx
        this.dy = dy
        this.width = width
        this.img = img
    }

    drawFigure(context) {
        const img = new Image()
        img.src = this.img
        img.addEventListener('load', () => {
            const height = 100 *  img.height / img.width
            context.drawImage(img, this.dx, this.dy, this.width, height )
        })
    }
}

class Boat extends Figurine {
    constructor({ dx, dy, width, img }) {
        super({dx, dy, width, img})
        this.knights = []
    }

    addFigurine(figurine) {
        this.knights.push(figurine)
    }
}

class Knight extends Figurine {
    constructor({dx, dy, img,  parent }) {
        super(dx, dy, width, img)
        this.parent = parent
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

