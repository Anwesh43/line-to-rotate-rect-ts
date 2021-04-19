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