<template>
    <div class="p-container">
        <div class="p-box">
            <a-row type="flex" justify="center">
                <a-form-model ref="entity" style="width: 100%" :model="form" :rules="formRules" :labelCol="{span:3}"
                              :wrapperCol="{span:14}">
                    <a-form-model-item label="自提点名称" prop="name" required>
                        <a-input v-model="form.name" style="width: 300px"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="自提点管理员账号" prop="adminAccount" required>
                        <a-input v-model="form.adminAccount" style="width: 300px"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="管理员姓名" prop="adminName" required>
                        <a-input v-model="form.adminName" style="width: 300px"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="联系电话" prop="adminPhone" required>
                        <a-input v-model="form.adminPhone" style="width: 300px"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="自提点地址" prop="address" required>
                        <a-cascader placeholder="" class="font-size-12" v-model="form.address" :options="areaList"
                                    style="width: 300px"></a-cascader>
                    </a-form-model-item>
                    <a-form-model-item label="详细地址" prop="detail" required>
                        <a-input-search @search="onSearchMap" v-model="form.detail" style="width: 500px">
                            <a-button icon="search" slot="enterButton"/>
                        </a-input-search>
                    </a-form-model-item>
                    <a-row class="ant-form-item">
                        <a-col span="3"></a-col>
                        <a-col span="14">
                            <div style="height: 300px;" id="map"></div>
                        </a-col>
                    </a-row>
                    <a-form-model-item label="营业时间" required>
                        <a-radio-group v-model="form.openMode" class="radio-list">
                            <a-radio :value="deliveryTimeModeOptions.all">全天</a-radio>
                            <a-radio :value="deliveryTimeModeOptions.custom">自定义</a-radio>
                        </a-radio-group>
                        <p-select-time v-if="form.openMode === deliveryTimeModeOptions.custom"
                                       v-model="form.openOption"
                                       :is-request-completed="isRequestCompleted"
                                       @exception="onOpenCatch"/>
                    </a-form-model-item>
                    <a-form-model-item label="自提时间" required>
                        <a-checkbox :value="true" v-model="form.isSelectTime"></a-checkbox>
                        <span class="text-muted font-size-12 p-input-left">
                            勾选后，买家下单选择上门自提，必须选择自提时间，卖家需要按约定时间备货。不勾选，将会提示买家尽快到店自提
                        </span>
                    </a-form-model-item>
                    <a-form-model-item v-if="form.isSelectTime" label="自提时段" required>
                        <a-radio-group v-model="form.deliveryTimeMode" class="radio-list">
                            <a-radio :value="deliveryTimeModeOptions.all">全天</a-radio>
                            <a-radio :value="deliveryTimeModeOptions.custom">自定义</a-radio>
                        </a-radio-group>
                        <p-select-time v-model="form.sendOption"
                                       :is-request-completed="isRequestCompleted"
                                       @exception="onSendCatch"
                                       v-if="form.deliveryTimeMode === deliveryTimeModeOptions.custom"/>
                    </a-form-model-item>
                    <a-form-model-item v-if="form.isSelectTime" label="时段细分" required>
                        <a-radio-group v-model="form.timeMode">
                            <a-radio :value="timeModeOptions.D">天</a-radio>
                            <a-radio :value="timeModeOptions.H">小时</a-radio>
                            <a-radio :value="timeModeOptions.HH">半小时</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item v-if="form.isSelectTime" label="预约自提" required>
                        <a-radio-group v-model="form.reservationMode" class="radio-list">
                            <a-radio :value="reservationModeOptions.N">无需提前</a-radio>
                            <a-radio :value="reservationModeOptions.D">
                                <span>提前</span>
                                <a-select :disabled="form.reservationMode!== reservationModeOptions.D"
                                          v-model="form.rDayValue"
                                          style="width: 80px"
                                          class="p-input-left-5 p-input-right-5">
                                    <a-select-option v-for="index of 31" :value="index" :key="index">{{index}}
                                    </a-select-option>
                                </a-select>
                                <span>天</span>
                            </a-radio>
                            <a-radio :value="reservationModeOptions.H">
                                <span>提前</span>
                                <a-select :disabled="form.reservationMode!== reservationModeOptions.H"
                                          v-model="form.rHourValue"
                                          style="width: 80px"
                                          class="p-input-left-5 p-input-right-5">
                                    <a-select-option v-for="index of 24" :value="index" :key="index">{{index}}
                                    </a-select-option>
                                </a-select>
                                <span>小时</span>
                            </a-radio>
                            <a-radio :value="reservationModeOptions.M">
                                <span>提前</span>
                                <a-input-number :disabled="form.reservationMode!== reservationModeOptions.M"
                                                v-model="form.rMinuteValue"
                                                :step="1"
                                                :max="1440" :min="1"
                                                style="width: 80px"
                                                class="p-input-left-5 p-input-right-5">
                                </a-input-number>
                                <span>分钟</span>
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item v-if="form.isSelectTime" label="最长预约" required>
                        <a-radio-group v-model="form.maxReservationMode" class="radio-list">
                            <a-radio :value="false">只能当天自提</a-radio>
                            <a-radio :value="true">
                                <span>可预约</span>
                                <a-select :disabled="form.maxReservationMode === false" style="width: 80px"
                                          class="p-input-left-5 p-input-right-5" v-model="form.rMaxValue">
                                    <a-select-option v-for="index of 90" :value="index" :key="index">{{index}}
                                    </a-select-option>
                                </a-select>
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                </a-form-model>
            </a-row>
        </div>
        <p-footer>
            <template #content>
                <a-button @click="onSave" type="primary" class="font-size-12 p-input-right">保存</a-button>
                <a-button @click="onCancel" class="font-size-12 p-input-right">取消</a-button>
            </template>
        </p-footer>
    </div>
</template>

<script>
import {jsonp} from 'vue-jsonp'
import moment from 'moment'
import areaMap from '../../../common/area'
import common from '../../../common/common'
import selfTakeDeliveryService from "../../../service/selfTakeDeliveryService"
import constant from "../../../common/constant"

export default {
    name: "UpdateCustomSitePage",
    data() {
        return {
            form: {
                id: '',
                name: '',
                adminAccount: '',
                adminName: '',
                adminPhone: '',
                address: [],
                detail: '',
                lng: 0,
                lat: 0,
                isSelectTime: true,
                deliveryTimeMode: 'all',
                openMode: 'all',
                timeMode: 'D',
                reservationMode: -1,
                maxReservationMode: false,
                openOption: {
                    isDaily: true,
                    weeks: [],
                    times: []
                },
                sendOption: {
                    isDaily: true,
                    weeks: [],
                    times: []
                },
                rDayValue: 1,
                rHourValue: 1,
                rMinuteValue: 1,
                rMaxValue: 1
            },
            deliveryTimeModeOptions: {
                all: 'all',
                custom: 'custom'
            },
            timeModeOptions: {
                D: 'D',
                H: 'H',
                HH: 'HH'
            },
            reservationModeOptions: {
                N: -1,
                D: 1,
                H: 2,
                M: 3
            },
            areaList: [],
            formRules: {
                name: [{
                    required: true,
                    message: '必须填填写名称'
                }],
                adminAccount: [{
                    required: true,
                    message: '必须填填写管理员账号'
                }],
                adminName: [{
                    required: true,
                    message: '必须填填写管理员姓名'
                }],
                adminPhone: [{
                    required: true,
                    message: '必须填填写联系电话'
                }],
                address: [{
                    required: true,
                    message: '必须填填写地址'
                }],
                detail: [{
                    required: true,
                    message: '必须填填写详细地址'
                }]
            },
            map: null,
            func: null,
            marker: null,
            isSendTimeError: false,
            isOpenTimeError: false,
            loading: false,
            isRequestCompleted: false
        }
    },
    created() {
        console.log('created')
        this.areaList = common.getAreaTreeOption(areaMap.province_list, areaMap.city_list, areaMap.county_list)
        this.toForm()
    },
    methods: {
        onSave() {
            console.log(this.toEntity())
            this.$refs.entity.validate((valid) => {
                if (valid) {
                    if (this.isSendTimeError === true || this.isOpenTimeError === true) {
                        return
                    }
                    this.loading = true
                    let entity = this.toEntity()
                    console.log(entity)
                    selfTakeDeliveryService.update(entity).then(res => {
                        this.loading = false
                        if (res.data.code === constant.serviceCode.success) {
                            this.$message.success('保存成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        },
        onSearchMap() {
            let text = ''
            if (this.form.address.length > 0) {
                text = areaMap.province_list[this.form.address[0]] +
                    areaMap.city_list[this.form.address[1]] +
                    areaMap.county_list[this.form.address[2]]
            }
            jsonp('https://restapi.amap.com/v3/geocode/geo', {
                key: process.env.VUE_APP_AMAP_SERVICE_KEY,
                address: text + this.form.detail
            }).then(res => {
                if (res.geocodes.length > 0) {
                    let location = res.geocodes[0].location.split(',')
                    this.form.lat = location[1]
                    this.form.lng = location[0]
                    this.updateMarker()
                } else {
                    this.$message.warning('未搜索到位置')
                }
            })
        },
        updateDetail(e) {
            jsonp('https://restapi.amap.com/v3/geocode/regeo', {
                key: process.env.VUE_APP_AMAP_SERVICE_KEY,
                location: `${e.lnglat.lng},${e.lnglat.lat}`
            }).then(res => {
                console.log(res)
                if (res.info === 'OK') {
                    this.form.detail = res.regeocode.formatted_address
                }

            })
        },
        onCancel() {
            this.$router.back()
        },
        toEntity() {
            let reservationValue = 0
            if (this.form.reservationMode === this.reservationModeOptions.D) {
                reservationValue = this.form.rDayValue
            }
            if (this.form.reservationMode === this.reservationModeOptions.H) {
                reservationValue = this.form.rHourValue
            }
            if (this.form.reservationMode === this.reservationModeOptions.M) {
                reservationValue = this.form.rMinuteValue
            }
            return {
                id: this.form.id,
                name: this.form.name,
                adminName: this.form.adminName,
                adminAccount: this.form.adminAccount,
                adminPhone: this.form.adminPhone,
                openTime: this.form.openOption.times,
                openWeek: this.form.openOption.weeks,
                sendTime: this.form.sendOption.times,
                sendWeek: this.form.sendOption.weeks,
                isSelectTime: this.form.isSelectTime,
                isOpenCustom: this.form.openMode === this.deliveryTimeModeOptions.custom,
                isSendCustom: this.form.deliveryTimeMode === this.deliveryTimeModeOptions.custom,
                isOpenDaily: this.form.openOption.isDaily,
                isSendDaily: this.form.sendOption.isDaily,
                isMaxReservation: this.form.maxReservationMode,
                reservationValue: reservationValue,
                timeMode: this.form.timeMode,
                reservationOption: this.form.reservationMode,
                province: areaMap.province_list[this.form.address[0]],
                city: areaMap.city_list[this.form.address[1]],
                district: areaMap.county_list[this.form.address[2]],
                lat: this.form.lat,
                lng: this.form.lng,
                detail: this.form.detail
            }
        },
        updateMarker() {
            let marker = new AMap.Marker({
                position: new AMap.LngLat(this.form.lng, this.form.lat),
                icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                offset: new AMap.Pixel(-13, -30),
                draggable: true
            });
            marker.on('dragging', (e) => {
                if (this.func !== null) {
                    window.clearTimeout(this.func)
                }
                this.func = window.setTimeout(() => {
                    this.updateDetail(e)
                }, 300)
            });
            if (this.marker === null) {
                this.marker = marker
                this.map.add(marker)
            } else {
                this.map.remove(this.marker)
                this.marker = marker
                this.map.add(marker)
            }
            this.map.setZoomAndCenter(15, [this.form.lng, this.form.lat])
        },
        onOpenCatch(e) {
            this.isOpenTimeError = e
        },
        onSendCatch(e) {
            this.isSendTimeError = e
        },
        toForm() {
            selfTakeDeliveryService.get({id: this.$route.query.id}).then(res => {
                this.isRequestCompleted = true
                let result = res.data.result
                this.form.id = result.id
                this.form.name = result.name
                this.form.adminName = result.adminName
                this.form.adminAccount = result.adminAccount
                this.form.adminPhone = result.adminPhone
                this.form.address.push(result.districtCode.toString().substring(0, 2) + '0000')
                this.form.address.push(result.districtCode.toString().substring(0, 4) + '00')
                this.form.address.push(result.districtCode.toString())
                this.form.lat = result.lat
                this.form.lng = result.lng
                this.form.detail = result.detail
                this.form.isSelectTime = result.isSelectTime
                this.form.openOption.isDaily = result.isOpenDaily
                this.form.openOption.weeks = result.openWeeks
                this.form.openOption.times = result.openTimes
                this.form.sendOption.isDaily = result.isSendDaily
                this.form.sendOption.weeks = result.sendWeeks
                this.form.sendOption.times = result.sendTimes
                this.form.maxReservationMode = result.isMaxReservation
                this.form.timeMode = result.timeMode
                this.form.reservationMode = result.reservationOption
                this.form.openMode = result.isOpenCustom ? this.deliveryTimeModeOptions.custom : this.deliveryTimeModeOptions.all
                this.form.deliveryTimeMode = result.isSendCustom ? this.deliveryTimeModeOptions.custom : this.deliveryTimeModeOptions.all
                if (this.form.reservationMode === this.reservationModeOptions.D) {
                    this.form.rDayValue = result.reservationValue
                }
                if (this.form.reservationMode === this.reservationModeOptions.H) {
                    this.form.rHourValue = result.reservationValue
                }
                if (this.form.reservationMode === this.reservationModeOptions.M) {
                    this.form.rMinuteValue = result.reservationValue
                }
                this.map = new AMap.Map('map', {
                    zoom: 15,
                    center: [this.form.lng, this.form.lat]
                })
                this.updateMarker()
                console.log(this.isRequestCompleted)
            })
        }
    }
}
</script>

<style scoped>

</style>
<style>
    .amap-icon img {
        width: 25px;
        height: 34px;
    }

    .input-card .btn {
        width: 9rem;
    }

    .input-card .btn:first-child {
        margin-right: 1.3rem;
    }
</style>
