import {Injectable} from '@angular/core';
import {PopSer} from './pop-ser';
import { File } from 'ionic-native';

declare var cordova;
/**
 * 文件读写服务
 */
@Injectable()
export class FileSer {
    fs = cordova.file.dataDirectory;

    constructor(public popser:PopSer) {}


    /**
     * 一键写入
     * @param  obj：JSON格式的对象
     */
    writeErrLogs(obj){
        let str:string=JSON.stringify(obj)+',';
        this._writeErrLogs(str);
    }


    /**
     * 一键写入
     * @param  content：JSON格式的字符串
     */
    _writeErrLogs(content){
        //检查文件夹是否存在
        File.checkDir(this.fs, 'ipvpKMF').then((bool)=>{
            console.log('文件夹存在');
        },()=>{
            console.log('文件夹不存在');
            return File.createDir(this.fs, 'ipvpKMF', true).then(()=>{ console.log('文件夹新建成功')});
        }).then(()=>{
            //检查文件是否存在
            return File.checkFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt');
        }).then(()=>{
            //文件存在   写入
            console.log('文件存在');
            File.writeFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', content, {replace:true,append:true}).then(()=>{ console.log('文件写入成功')});
        },()=>{
            console.log('文件不存在');
            File.createFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', true).then((success)=> {
                console.log('文件新建成功');
                File.writeFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', content, {replace:true,append:true}).then(()=>{ console.log('文件写入成功')});
            },  (error)=> {
                console.log('文件新建失败，再次尝试新建');
                File.createFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', true).then((success)=> {
                    console.log('文件新建成功');
                    File.writeFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', content, {replace:true,append:true}).then(()=>{ console.log('文件写入成功')});
                });
            });
        });
    }
    /**
     * 一键读取
     * @returns     数组 【{}，{}，{}】
     */
    readErrLogs(){
       return File.readAsText(this.fs, 'ipvpKMF/IpvpErrLogs.txt').then((res:string)=>{
            console.log('读取成功');
           let arr:any=[];
           if(res){
               let str:string='['+''+res.substring(0,res.length-1)+']';
               arr=JSON.parse(str);
           }
            return arr;
        },()=>{
            console.log('读取失败');
            return [];
        });
    }

/************************************参考方法***********************************/
    /**
     * 创建文件夹
     */
    createDir(){
        // File.createDir(path, dirName, replace)
        File.createDir(this.fs, 'ipvpKMF', true).then((success)=> {
            // success
            alert('ok!');
        },  (error)=> {
            // error
            alert('fail!');
        });
    }
    /**
     * 检查文件夹是否存在
     */
    checkDir(){
        // File.checkDir(path, dir)
        File.checkDir(this.fs, 'ipvpKMF').then((success)=> {
            // success
            alert('ok');
            console.log(success);
        },  (error)=> {
            // error
            alert('err');
            console.log(error);
        });
    }
    /**
     * 创建文件
     */
    createFile(){
        // File.createFile(path, fileName, replace)
        File.createDir(this.fs, 'ipvpKMF', true).then((success)=> {
            // success
            alert('ok!');
            console.log(success);
        },  (error)=> {
            // error
            alert('fail!');
            console.log(error);
        });
    }
    /**
     * 检查文件是否存在
     */
    checkFile(){
        // File.checkFile(path, file)
        File.checkFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt').then((success)=> {
            // success
            alert('ok');
            console.log(success);
        },  (error)=> {
            // error
            alert('err');
            console.log(error);
        });
    }
    /**
     * 写入一个新文件,可以替换
     */
    writeFile(content){
        // File.writeFile(path, fileName, text, options)
        File.createFile(this.fs, 'ipvpKMF/IpvpErrLogs.txt', true).then((success)=> {
            // success
            alert('ok!');
        },  (error)=> {
            // error
            alert('fail!');
        });
    }

    /**
     * 写入一个存在的文件。
     */
    writeExistingFile(content){
        // File.writeExistingFile(path, file, data)
        File.writeExistingFile(this.fs,'ipvpKMF/IpvpErrLogs.txt',content).then((success)=> {
            // success
            alert(success);
        },  (error)=> {
            // error
            alert(error);
        });
    }

    /**
     * 读文件
     */
    readAsText(){
        // File.readAsText(path, file);
        File.readAsText(this.fs,'ipvpKMF/IpvpErrLogs.txt').then((success)=> {
            // success
            alert(success);
        },  (error)=> {
            // error
            alert(error);
        });
    }
    /**
     * 删文件
     */
    removeFile(){
        // File.removeFile(path, fileName)
        File.removeFile(this.fs,'ipvpKMF/IpvpErrLogs.txt').then((success)=> {
            // success
            // alert('ok');
        },  (error)=> {
            // error
            // alert('fail');
        });
    }



}
