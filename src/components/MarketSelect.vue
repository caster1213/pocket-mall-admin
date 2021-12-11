<template>
    <a-space>
        <span class="market-btn" :class="{'market-btn-active':currentValue === 'red'}" @click="onIconClick('red')">
            <a-icon :component="FlagIcon" :style="{fontSize:size}"></a-icon>
        </span>
        <span class="market-btn" :class="{'market-btn-active':currentValue === 'yellow'}" @click="onIconClick('yellow')">
              <a-icon @click="onIconClick('yellow')" :component="FlagYellow" :style="{fontSize:size}"></a-icon>
        </span>
        <span class="market-btn" :class="{'market-btn-active':currentValue === 'green'}" @click="onIconClick('green')">
            <a-icon @click="onIconClick('green')" :component="FlagGreen" :style="{fontSize:size}"></a-icon>
        </span>
        <span class="market-btn" :class="{'market-btn-active':currentValue === 'blue'}" @click="onIconClick('blue')">
             <a-icon @click="onIconClick('blue')" :component="FlagBlue" :style="{fontSize:size}"></a-icon>
        </span>
        <span class="market-btn" :class="{'market-btn-active':currentValue === 'violet'}" @click="onIconClick('violet')">
            <a-icon @click="onIconClick('violet')" :component="FlagViolet" :style="{fontSize:size}"></a-icon>
        </span>
    </a-space>
</template>

<script>
import FlagIcon from "./icon/FlagIcon"
import FlagYellow from "./icon/FlagYellow"
import FlagGreen from "./icon/FlagGreen"
import FlagBlue from "./icon/FlagBlue"
import FlagViolet from "./icon/FlagViolet"
import FlagGrey from "./icon/FlagGrey"

export default {
    name: "MarketSelect",
    props: {
        size: String,
        defaultValue: ''
    },
    data() {
        return {
            FlagIcon: FlagIcon,
            FlagYellow: FlagYellow,
            FlagGreen: FlagGreen,
            FlagBlue: FlagBlue,
            FlagViolet: FlagViolet,
            FlagGrey: FlagGrey,
            currentValue: this.defaultValue
        }
    },
    methods: {
        onIconClick(value) {
            this.currentValue = value
            this.$emit('change', this.currentValue)
        }
    }
}
</script>

<style scoped>
    .market-btn {
        display: inline-block;
        border: 1px solid #e3e2e5;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;
        padding: 5px 8px;
        border-radius: 4px;
    }

    .market-btn-active {
        color: #2589FF;
        border-color: #2589FF !important;
    }
    .market-btn:hover{
        color: #2589ff;
        border-color: #2589ff !important;
    }
</style>
