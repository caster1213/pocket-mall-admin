import Vue from 'vue'
import {
    Button,
    Row,
    Col,
    Tabs,
    Tag,
    Tooltip,
    Transfer,
    Statistic,
    Form,
    FormModel,
    Input,
    Switch,
    Radio,
    InputNumber,
    Checkbox,
    Steps,
    Icon,
    Layout,
    Card,
    List,
    Upload,
    Menu,
    notification,
    message,
    Cascader,
    Result,
    Popconfirm,
    Breadcrumb,
    DatePicker,
    TimePicker,
    Table,
    Pagination,
    Avatar,
    Tree,
    Badge,
    Dropdown,
    Select,
    Modal,
    Spin,
    AutoComplete,
    Divider,
    Popover,
    Empty,
    Space, Timeline,
    Alert, Carousel, ConfigProvider
} from 'ant-design-vue'
import Pocket from "../components/pocket-index"
import OrderDelivery from "../components/delivery/index"
import OrderCancelConfirm from "../components/order/OrderCancelConfirmIndex"
import OrderUpdateMarket from "../components/order/OrderUpdateMarketIndex"
import OrderUpdateAddress from "../components/order/OrderUpdateAddressIndex"
import OrderChangePrice from "../components/order/OrderChangePriceIndex";
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true

export default {
    init() {
        Vue.use(Pocket)
        Vue.use(Alert)
        Vue.use(Button)
        Vue.use(Result)
        Vue.use(Popconfirm)
        Vue.use(Breadcrumb)
        Vue.use(Menu)
        Vue.use(Layout)
        Vue.use(Card)
        Vue.use(List)
        Vue.use(Upload)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Tree)
        Vue.use(Transfer)
        Vue.use(Tooltip)
        Vue.use(Tag)
        Vue.use(Form)
        Vue.use(FormModel)
        Vue.use(Input)
        Vue.use(Switch)
        Vue.use(Radio)
        Vue.use(InputNumber)
        Vue.use(DatePicker)
        Vue.use(TimePicker)
        Vue.use(Checkbox)
        Vue.use(Cascader)
        Vue.use(Carousel)
        Vue.use(Steps)
        Vue.use(Tabs)
        Vue.use(Table)
        Vue.use(Pagination)
        Vue.use(Icon)
        Vue.use(Avatar)
        Vue.use(Badge)
        Vue.use(Modal)
        Vue.use(Dropdown)
        Vue.use(Select)
        Vue.use(ConfigProvider)
        Vue.use(Statistic)
        Vue.use(Tree)
        Vue.use(Spin)
        Vue.use(AutoComplete)
        Vue.use(Divider)
        Vue.use(Popover)
        Vue.use(Empty)
        Vue.use(VueClipboard)
        Vue.use(Space)
        Vue.use(Timeline)
        Vue.prototype.$notification = notification
        Vue.prototype.$message = message
        Vue.prototype.$confirm = Modal.confirm
        Vue.prototype.$success = Modal.success
        Vue.prototype.$warning = Modal.warning
        Vue.prototype.$order = {
            delivery: OrderDelivery,
            canceled: OrderCancelConfirm,
            marker: OrderUpdateMarket,
            updateAddress: OrderUpdateAddress,
            priceChanged: OrderChangePrice
        }
    }
}
