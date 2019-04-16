<!--suppress ALL -->

<template>
    <i-select
        ref="select"
        class="ivu-auto-complete"
        :label="label"
        :disabled="disabled"
        :clearable="clearable"
        :placeholder="placeholder"
        :size="size"
        filterable
        remote
        auto-complete
        :remote-method="remoteMethod"
        @on-change="handleChange"
        :transfer="transfer">
        <slot name="input">
            <i-input
                :element-id="elementId"
                ref="input"
                slot="input"
                v-model="currentValue"
                :name="name"
                :placeholder="placeholder"
                :disabled="disabled"
                :size="size"
                :icon="inputIcon"
                @on-focus="handleFocus"
                @on-blur="handleBlur"
                :maxlength="maxlength"
            ></i-input>
        </slot>
        <slot>
            <i-option v-for="item in filteredData" :value="item" :key="item">{{item}}</i-option>
        </slot>
    </i-select>
</template>
<script>
    import Emitter from "iview/src/mixins/emitter";
    export default {
        name: 'AutoComp',
        mixins: [ Emitter ],
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            label: {
                type: [String, Number],
                default: ''
            },
            data: {
                type: Array,
                default: () => []
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            icon: {
                type: String
            },
            filterMethod: {
                type: [Function, Boolean],
                default: false
            },
            transfer: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            },
            maxlength:{
                type:Number
            }
        },
        data () {
            return {
                currentValue: this.value,
                disableEmitChange: false,    // for Form reset
                focus:false
            };
        },
        computed: {
            inputIcon () {
                let icon = '';
                if (this.clearable && this.currentValue) {
                    icon = 'ios-close';
                } else if (this.icon) {
                    icon = this.icon;
                }
                return icon;
            },
            filteredData () {
                if (this.filterMethod) {
                    return this.data.filter(item => this.filterMethod(this.currentValue, item));
                } else {
                    return this.data;
                }
            }
        },
        watch: {
            value (val) {
                this.disableEmitChange = true;
                this.currentValue = val;
            },
            currentValue (val) {
                this.$refs.select.query = val;
                this.$emit('input', val);
                if (this.disableEmitChange) {
                    this.disableEmitChange = false;
                    return;
                }
                this.$emit('on-change', val);
                this.dispatch('FormItem', 'on-form-change', val);
            }
        },
        methods: {
            remoteMethod (query) {
                this.$emit('on-search', query);
            },
            handleChange (val) {
                this.currentValue = val;
                this.$refs.select.model = val;
                this.$refs.input.blur();
                this.$emit('on-select', val);
            },
            toggleMenu(flag){
                this.$refs.select.visible=this.focus&&flag;
            },
            handleBlur () {
                this.focus= false;
                this.$refs.select.visible= false;
            },
            handleFocus () {
                this.focus = true;
            }
        }
    };
</script>