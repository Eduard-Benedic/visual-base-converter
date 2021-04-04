

const selectors = {
    canvas: '#canvas',
    containerFile: '[el="base-container-file"]',
    itemFile: '[el="base-item-file"]',
    containerNum: '[el="base-container"]',
    itemNum: '[el="base-item"]',
    submitBtn: '#submit'
}



class ArmyCreator {
    constructor({ canvasSel, containerFile, itemFile, containerNum, itemNum, btn }) {
        this.canvas = document.querySelector(canvasSel)
        this.canvas.width = document.body.clientWidth
        this.canvas.height = document.body.clientHeight
 
        this.containerEl = document.querySelector(containerFile)
        this.itemEl = document.querySelector(itemFile)
        this.countParentEl = document.querySelector(containerNum)
        this.countItemEl = document.querySelector(itemNum)
        this.submitBtn = document.querySelector(btn)
        this.containerImgEl
        this.itemImgEl
        this.containerNum = 0
        this.itemNum = 0
        this.context = this.canvas.getContext('2d')
        this.init()
    }

    init() {
        this._attachEvents()
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
        const imgBase64 = await this._readImg(this.containerImgEl)
        const imgKnights = await this._readImg(this.itemImgEl)

        const totalLevel = this._countBaseConversionStep(this.itemNum, this.containerNum)

        const boats = []
        const coordinates = this._getCanvasCoordinates(this.canvas)
        
        let width = coordinates.width / this.containerNum
        let height =  coordinates.height / totalLevel

        let bin = 0

        for (let i = 0; i < totalLevel; i++) {
            boats.push(
                new BoatLevel({
                    context: this.context,
                    knightsNum: this._getQuotient(this.itemNum, 16, i),
                    level: i,
                    width: width,
                    height: height,
                    dy: (height / totalLevel) * i,
                    imgUrl: imgBase64,
                    imgKnight: imgKnights
                })
            )
            bin++
        }

        console.log(boats)
    }

    _getQuotient(num, base,  step) {

        let quotient = Math.floor(num / base);
        for (let i = 0; i < step; i++) {
            quotient = Math.floor(quotient / base)
        }
        return quotient
    }

    _getLevelQuotient(num, level) {

    }

    _countBaseConversionStep(num, base, step) {
        const quotient = Math.floor(num  / base)
        // const mod = num % base
        if (!step) step = 0
        if (quotient == 0)  return step + 0
        return this._countBaseConversionStep(quotient, base, step + 1)
    }

    _attachEvents() {
       
        
        this.submitBtn.addEventListener('click', () => {
            this.containerNum = parseInt(this.countParentEl.value)
            this.itemNum = parseInt(this.countItemEl.value)
            this.containerImgEl = this.containerEl.files[0]
            this.itemImgEl = this.itemEl.files[0]

            this._buildArmy()
        })
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



class FigureRenderer {

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
    
        this.renderBoat()
        this.renderKnights()
    }


    renderBoat() {
        const img = new Image()
        img.src = this.imageUrl
        img.addEventListener('load', () => {
            this.context.drawImage(img, this.dx, this.dy, this.width, this.height)
        })
    }

    renderKnights() {
        let count = this.knightsNum

        for (let i = 0; i < count; i++) {
            this.knights.push(new Knight({parent: this, dx: 123, dy: 332, img: this.imgKnight }))
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
    new ArmyCreator({
        canvasSel: selectors.canvas,
        containerFile: selectors.containerFile,
        itemFile: selectors.itemFile,
        containerNum: selectors.containerNum,
        itemNum: selectors.itemNum,
        btn: selectors.submitBtn
    });
})

