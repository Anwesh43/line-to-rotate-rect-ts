const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 3 
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const dealy : number = 20 
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
        context.rotate(rot * sf1)
        for (var j = 0; j < 2; j++) {
            DrawingUtil.drawLine(context, 0, 0, 0, -size * sf2)
        }
        context.fillRect(0, 0, size, -size * sf3)
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
