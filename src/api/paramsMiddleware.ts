// 这个文件是crypto-proxy_static，为了隐藏使用的是这个加密方法，修改名字，并且混淆代码
// @ts-nocheck
import { strSmDecode, routerHelp } from "./routerHelp"

// console.log('routeHelp', routerHelp)

const keyStr = strSmDecode(
    "109,116,115,97,111,109,121,118,107,111,121,104,107,108,118,99,49,118,106,109,103,48,110,103,52,53,101,54,115,101,103,104"
)
const ivStr = strSmDecode("108,120,100,111,113,52,100,114,54,98,48,52,115,108,113,107")

const arr = [
    strSmDecode("101,110,99,114,121,112,116"),
    strSmDecode("101,110,99"),
    strSmDecode("85,116,102,56"),
    strSmDecode("65,69,83"),
    strSmDecode("112,97,114,115,101"),
    strSmDecode("105,118"),
    strSmDecode("109,111,100,101"),
    strSmDecode("112,97,100,100,105,110,103"),
    strSmDecode("100,101,99,114,121,112,116"), // 8
    strSmDecode("67,66,67"), // 9
    strSmDecode("112,97,100"), // 10
    strSmDecode("90,101,114,111,80,97,100,100,105,110,103"), // 11
    strSmDecode("77,68,53"), // 12
    strSmDecode("107,101,121"), // 13
    strSmDecode(
        "122,105,53,54,110,116,121,105,98,113,108,119,99,51,48,112,48,112,50,110,50,107,56,120,98,119,120,56,102,100,122,49"
    ) // 14 "zi56ntyibqlwc30p0p2n2k8xbwx8fdz1"
]

const encrypt = (str: string) => {
    const key = routerHelp[arr[1]][arr[2]][arr[4]](keyStr) // 秘钥
    const iv = routerHelp[arr[1]][arr[2]][arr[4]](ivStr) // 向量iv
    const encrypted = routerHelp[arr[3]][arr[0]](str, arr[14], {
        [arr[13]]: key,
        [arr[5]]: iv,
        [arr[6]]: routerHelp[arr[6]][arr[9]],
        [arr[7]]: routerHelp[arr[10]][arr[11]]
    })
    /* let resultDecipher = routerHelp.enc.Utf8.stringify(encrypted); */
    const resultDecipher = encrypted.toString()
    // 返回解密结果
    return resultDecipher
}

const decrypt = (str: string): string => {
    // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
    // const restoreBase64 = encrypted.replace(//-/g,'+').replace(/_/g,'/');
    // 这里 mode, padding, iv 一定要跟加密的时候完全一样
    const key = routerHelp[arr[1]][arr[2]][arr[4]](keyStr) // 秘钥
    const iv = routerHelp[arr[1]][arr[2]][arr[4]](ivStr) // 向量iv
    // 返回的是一个解密后的对象
    const decipher = routerHelp.AES.decrypt(str, arr[14], {
        [arr[13]]: key,
        [arr[5]]: iv,
        [arr[6]]: routerHelp[arr[6]][arr[9]],
        [arr[7]]: routerHelp[arr[10]][arr[11]]
    })
    return decipher.toString(routerHelp[arr[1]][arr[2]])
}

const objKeySort = <T>(obj: T) => {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        return obj
    }
    const newkey = Object.keys(obj).sort()
    const newObj = {}
    // 创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {
        // 遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]]
        // 向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj // 返回排好序的新对象
}

const getmd5 = (str: string) => {
    return routerHelp[arr[12]](str).toString()
}

export { encrypt, decrypt, objKeySort, getmd5 }
