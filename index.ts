const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 3 
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const delay : number = 20 
const colors : Array<string> = [
    "#f44336",
    "#673AB7",
    "#4CAF50",
    "#00C853",
    "#1A237E"
] 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2 
const sizeFactor : number = 6.9 
class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)       
    }
}

class DrawingUtil {

    static drawLine(context  : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawLineToRotateRect(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, 2, parts)
        context.save()
        context.translate(w / 2, h / 2)
        
        for (var j = 0; j < 2; j++) {
            context.save()
            context.rotate(rot * sf2 * (1 - 2 * j))
            DrawingUtil.drawLine(context, 0, 0, 0, -(1 - 2 * j) * size * sf1)
            context.restore()
        }
        context.fillRect(0, -size * sf3, size, size * sf3)
        context.restore()
    }

    static drawLTRRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawLineToRotateRect(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class LTRRNode {

    next : LTRRNode 
    prev : LTRRNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LTRRNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLTRRNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : LTRRNode {
        var curr : LTRRNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
    
}

class LineToRotateRect {

    curr : LTRRNode = new LTRRNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }
    
    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    ltrr : LineToRotateRect = new LineToRotateRect()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.ltrr.draw(context)
    }

    handleTap(cb : Function) {
        this.ltrr.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.ltrr.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}