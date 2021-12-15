import common from './common'

class Field {
    /**
     * 初始化一个Field
     * @param name 字段名称
     * @param width 宽度
     * @param type 字段类型
     * @param cellType 控件类型
     * @param value 内容
     * @param rule 验证规则
     * @param hidden 是否隐藏
     * @param disabled 是否禁用
     */
    constructor(name, width, type, cellType, value, rule = [], hidden = false, disabled = false) {
        this.uuid = common.guid.newGuid()
        this.name = name
        this.cellType = cellType
        this.hasError = false
        this.errorMessage = ''
        this.hidden = hidden
        this.width = width
        this.type = type
        this.rules = rule
        this.disabled = disabled
        if (type === 'number') {
            if (value > 0) {
                this.value = value.toString()
            } else {
                this.value = ''
            }
        } else {
            this.value = value
        }
    }

    getValue() {
        if (this.type === 'number' && this.value === '') {
            return 0
        } else {
            return this.value
        }
    }

    onChange() {
        this.validate()
        if (this.name === 'addOrSubInventory') {
            this.addOrSub()
        }
    }

    validate() {
        if (this.disabled) return
        for (let rule of this.rules) {
            if (rule.hasOwnProperty('required')) {
                if (this.isNullOrEmpty(rule)) return
            }
            if (rule.hasOwnProperty('pattern')) {
                if (this.isMatch(rule)) return
            }
            if (rule.hasOwnProperty('func')) {
                this.hasError = rule.func(this.value)
                this.errorMessage = rule.message
            }
        }
    }

    isNullOrEmpty(rule) {
        if (this.value.length === 0 || this.value === null || this.value === undefined) {
            this.errorMessage = rule.message
            this.hasError = true
            return true
        } else {
            this.hasError = false
        }
        return false
    }

    isMatch(rule) {
        if (this.value.length > 0) {
            if (rule.pattern.test(this.value) === false) {
                this.hasError = true
                this.errorMessage = rule.message
                return true
            } else {
                this.hasError = false
                return false
            }
        }
        return false
    }

    addOrSub() {
        if (this.value.length <= 0) {
            this.updateAfterInventory.value = this.inventory
            return
        }
        if (this.hasError === false) {
            if (isNaN(parseInt(this.value))) return
            let inventory = parseInt(this.updateAfterInventory.value)
            if (isNaN(inventory)) {
                inventory = 0
            }
            let temp = inventory + parseInt(this.value)
            if (temp < 0) {
                this.hasError = true
                this.errorMessage = '库存数量不能小于0'
            } else {
                this.updateAfterInventory.value = inventory + parseInt(this.value)
            }
        }
    }
}

let PaginationConfig = {
    pageSizeOptions: ['25', '50', '100'],
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSize: 25,
    defaultPageSize: 25,
    current: 1,
    showTotal: (total) => {
        let pageNum = Math.ceil(total / PaginationConfig.pageSize)
        return '共 ' + pageNum + ' 页' + ' ' + total + ' 条数据'
    }
}

function getPaginationConfig(){
    return {
        pageSizeOptions: ['25', '50', '100'],
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 25,
        defaultPageSize: 25,
        current: 1,
        showTotal: (total) => {
            let pageNum = Math.ceil(total / PaginationConfig.pageSize)
            return '共 ' + pageNum + ' 页' + ' ' + total + ' 条数据'
        }
    }
}

export {
    Field,
    PaginationConfig,
    getPaginationConfig
}
