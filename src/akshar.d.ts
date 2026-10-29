/** The only privileged operations available to the renderer. API keys never cross back to it. */
type AksharSettings = {
  schools: Array<{id:string;name:string;address:string}>;
  lists: Record<'class'|'subject'|'fullMarks'|'time'|'examTitle',string[]>;
  appearance: {theme:'system'|'light'|'dark';sky?:'day'|'night';reduceEffects?:boolean;accent:string;uiSize:'S'|'M'|'L';hindiSize:number;density:'comfortable'|'compact';sidebar:boolean};
  lastSelection:Record<string,string> & {language?:'hi'|'en'};model:string;
};
type AksharHistory = {id:string;title:string;date:string;text:string;language?:'hi'|'en'};
interface Window {
  akshar: {
    load():Promise<{settings:AksharSettings;history:AksharHistory[]}>;
    saveSettings(settings:AksharSettings):Promise<boolean>;
    saveHistory(history:AksharHistory[]):Promise<boolean>;
    getKeyStatus():Promise<boolean>;
    setKey(key:string):Promise<boolean>;
    testKey():Promise<boolean>;
    transcribe(images:string[],details:Record<string,string>,model:string,language:'hi'|'en'):Promise<string>;
    onStatus(handler:(message:string)=>void):()=>void;
    saveFile(name:string,data:string,kind:'txt'|'docx',language:'hi'|'en',details:Record<string,string>):Promise<boolean>;
    exportJson(name:string,data:unknown):Promise<boolean>;
    importJson():Promise<unknown|null>;
  }
}
