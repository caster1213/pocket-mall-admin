import FooterBoxPagination from "./FooterBoxPagination"
import FooterBox from "./FooterBox"
import OrderStateBox from "./OrderStateBox"
import MarketSelect from './MarketSelect'
import DistrictSelect from "./DistrictSelect"
import OrderItemTotalPrice from "./OrderItemTotalPrice"
import OrderStepFlow from "./OrderStepFlow"
import SelectTime from "./SelectTime"
import OrderTable from "./OrderTable";
import PageLinkSelectPricker from './PageLinkSelectPricker'
import GoodsSelectPricker from './GoodsSelectPricker'
import GoodsSelectPrickerResult from './GoodsSelectPrickerResult'
import Title from './Title'
import Page from './Page'
import UserLevelSelectPicker from "./UserLevelSelectPicker"
import UserLevelSelectPickerResult from "./UserLevelSelectPickerResult"

const Pocket = {
    install(Vue){
        Vue.component('p-footer-page',FooterBoxPagination)
        Vue.component('p-footer',FooterBox)
        Vue.component('p-order-status-box',OrderStateBox)
        Vue.component('p-market-select',MarketSelect)
        Vue.component('p-district-select',DistrictSelect)
        Vue.component('p-order-item',OrderItemTotalPrice)
        Vue.component('p-order-step-flow',OrderStepFlow)
        Vue.component('p-select-time',SelectTime)
        Vue.component('p-order-table',OrderTable)
        Vue.component('p-page-select-pricker',PageLinkSelectPricker)
        Vue.component('p-goods-select-pricker',GoodsSelectPricker)
        Vue.component('p-goods-select-pricker-result',GoodsSelectPrickerResult)
        Vue.component('p-title',Title)
        Vue.component('p-page',Page)
        Vue.component('p-user-level-select-picker',UserLevelSelectPicker)
        Vue.component('p-user-level-select-picker-result',UserLevelSelectPickerResult)
    }
}

export default Pocket
