import area from './area';
import constant from './constant';

class StringBuilder {
    constructor() {
        this._strs = []
    }

    append(input = '') {
        this._strs.push(input)
    }

    remove(startIndex, count) {
        if (this._strs.length === 0) return
        this._strs.splice(startIndex, count)
    }

    toString() {
        let result = ''
        for (const str of this._strs) {
            result += str
        }
        return result
    }
}


(() => {
    Number.prototype.toDecimalString = function () {
        if (this === 0) return '0.00'
        let str = this.toString().split('.')
        if (str.length === 1) {
            str.push('00')
        } else {
            if (str[1].length === 1) {
                str[1] += '0'
            }
            if (str[1].length >= 2) {
                str[1] = str[1].substring(0, 2)
            }
        }
        return `${str[0]}.${str[1]}`
    }
    Number.prototype.getProvinceName = function () {
        return area.province_list[parseInt(this.toString().substring(0, 2) + '0000')]
    }
    Number.prototype.getCityName = function () {
        return area.city_list[parseInt(this.toString().substring(0, 4) + '00')]
    }
    Number.prototype.getDistrictName = function () {
        return area.county_list[parseInt(this)]
    }

    String.prototype.toDecimalString = function () {
        if (this.length === 0) return ''
        let str = this.split('.')
        if (str.length === 1) {
            str.push('00')
        } else {
            if (str[1].length === 1) {
                str[1] += '0'
            }
        }
        return `${str[0]}.${str[1]}`
    }
    String.prototype.toDecimal = function () {
        if (this.length === 0) {
            return 0
        } else {
            return parseFloat(this)
        }
    }

    Array.prototype.isIndexOut = function (index) {
        if (this.length === 0) return true
        return this.length < index
    }
})()

export default {
    regex: {
        decimal2: /^-?([0-9][0-9]*)+(.[0-9]{1,2})?$/
    },
    guid: {
        newGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                c => {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }
    },
    isSuccess(rep) {
        return rep.data.code === constant.serviceCode.success
    },
    regular: {},
    unitConvert: {
        byteToUnit(value) {
            let kb = 1024
            let mb = kb * 1024
            let gb = mb * 1024
            if (value / kb < mb) {
                return (value / kb).toFixed(3) + 'KB'
            } else if (value / mb < 1024) {
                return value / mb + '.' + value % mb + 'MB'
            } else if (value / gb < 1024) {
                return value / gb + '.' + value % gb + 'GB'
            } else {
                return ''
            }
        }
    },
    getAreaTreeOption(province_list, city_list, county_list) {
        let tree = []
        for (let province in province_list) {
            let root = {
                value: province,
                label: province_list[province],
                children: []
            }
            for (let city in city_list) {
                if (city.toString().substring(0, 2) === province.toString().substring(0, 2)) {
                    let children = {
                        value: city,
                        label: city_list[city],
                        children: []
                    }
                    for (let county in county_list) {
                        if (city.toString().substring(0, 4) === county.toString().substring(0, 4)) {
                            let node = {
                                value: county,
                                label: county_list[county]
                            }
                            children.children.push(node)
                        }
                    }
                    root.children.push(children)
                }
            }
            tree.push(root)
        }
        return tree
    },
    toDecimal2(input) {
        let str = input.toString().split('.')
        if (str.length === 1) {
            str.push('00')
        } else {
            if (str[1].length === 1) {
                str[1] += '0'
            }
        }
        return `${str[0]}.${str[1]}`
    },
    download(url) {
        let a = document.createElement('a')
        a.href = url
        a.download = url
        document.body.append(a)
        a.click()
    },
    ObjectExtend: {
        fieldCopy(source, to, name, validate) {
            if (validate(source)) {
                to[name] = source[name]
            }
        }
    },
    DateExtend: {
        getDeadlineString(timespan) {
            let second = 1000
            let minute = second * 60
            let hour = minute * 60
            let day = hour * 24
            let last = timespan
            let sb = new StringBuilder()
            let zerofill = (value) => {
                if (value.toString().length === 1) {
                    return '0' + value.toString()
                } else {
                    return value.toString()
                }
            }
            sb.append(zerofill(Math.floor(timespan / day)) + '天')
            last = timespan - (Math.floor(timespan / day) * day)
            sb.append(zerofill(Math.floor(last / hour)) + '小时')
            last = last - (Math.floor(last / hour) * hour)
            sb.append(zerofill(Math.floor(last / minute)) + '分钟')
            return sb.toString()
        }
    },
    TextExtend: {
        StringBuilder: StringBuilder,
        String: {
            isEmptyOrNull(value) {
                if (value === null) return true
                if (value.length === 0) return true
                return false
            },
            empty: ''
        }
    },
    AddressExtend: {
        convertCodeToString(provinceList, cityList, districtList, code) {
            let province = provinceList[parseInt(code.toString().substring(0, 2) + '0000')]
            let city = cityList[parseInt(code.toString().substring(0, 4) + '00')]
            let district = districtList[code]
            return {
                province: province,
                city: city,
                district: district
            }
        }
    }
}
