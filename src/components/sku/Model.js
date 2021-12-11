class SelectOption {
    constructor(value, label) {
        this.value = value
        this.label = label
    }
}

class AttrValue {
    constructor(attr,value) {
        this.skuId = attr.value
        this.skuName = attr.label
        this.skuValueId = value.value
        this.skuValue = value.label
    }
}

class Sku {
    constructor(id,salePrice,costPrice,marketPrice,code,inventory,weight,volume,attrs) {
        this.id = ''
        this.salePrice = ''
        this.costPrice = ''
        this.marketPrice = ''
        this.code = ''
        this.inventory = ''
        this.weight = ''
        this.volume = ''
        this.hash = ''
        this.sku = []
    }
}

class Field {
    constructor() {
        this.value = ''
        this.isError = false
        this.message = ''
        this.rules = []
    }

    validate() {
        for (const rule of this.rules) {
            if (rule.type === 'required') {
                this.isError = this.isNullOrEmpty()
                if (this.isError) {
                    this.message = rule.message
                    return
                }
            }
            if (rule.type === 'pattern') {
                if (this.value.length === 0) return
                this.isError = rule.pattern.test(this.value) === false
                if (this.isError) {
                    this.message = rule.message
                    return
                }
            }
        }
    }

    isNullOrEmpty() {
        return this.value.length === 0
    }
}

export default Field
