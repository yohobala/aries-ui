export const argsToString = (args:any) :string=>{
    return Array.from<any>(args).reduce((sum:string, num:any) => sum + num.toString());
}