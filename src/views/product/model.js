class ProductEntity {
  constructor() {
    this.id = 0
    this.title = ''
    this.status = ''
    this.sellPointTitle = ''
    this.shareTitle = ''
    this.categoryId = 0
    this.saleArea = 0
    this.images = []
    this.detail = ''
    this.salePrice = ''
    this.inventory = ''
    this.memberPrice = ''
    this.costPrice = ''
    this.marketPrice = ''
    this.code = ''
    this.volume = ''
    this.weight = ''
    this.saleCategorySelect = 1
    this.deliverySelect = []
    this.saleTimeSelect = ''
    this.saleTime = null
    this.customServiceSelect = []
    this.freightTemplateSelect = []
    this.sku = []
    this.leastSaleCount =1
    this.limit = {
      isLimitIdentity: false,
      isLimitCount: false,
      isLifelongLimit: false,
      limitCount: 0,
      levels: [],
      cycleUnit: 'DAY'
    }
  }
}

export default ProductEntity
