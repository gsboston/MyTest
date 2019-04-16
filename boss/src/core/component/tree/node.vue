<template>
    <collapse-transition>
        <ul :class="classes" v-show="visible">
            <li>
                <span :class="arrowClasses" @click="handleExpand">
                    <Icon type="arrow-right-b"></Icon>
                </span>
                <Checkbox
                        v-if="showCheckbox"
                        :value="data.checked"
                        :indeterminate="indeterminate"
                        :disabled="data.disabled || data.disableCheckbox"
                        @click.native.prevent="handleCheck"></Checkbox>
                <span :class="titleClasses" v-html="data.title" @click="handleSelect"></span>
                <BSTreeNode
                        v-for="item in data.children"
                        :key="item.nodeKey"
                        :data="item"
                        :visible="data.expand"
                        :multiple="multiple"
                        :show-checkbox="showCheckbox">
                </BSTreeNode>
            </li>
        </ul>
    </collapse-transition>
</template>
<script>
    import { findComponentsDownward } from "iview/src/utils/assist";
    import CollapseTransition from "iview/src/components/base/collapse-transition";
    import Emitter from "iview/src/mixins/emitter";

    const prefixCls = 'ivu-tree';

    export default {
        name: 'BSTreeNode',
        mixins: [ Emitter ],
        components: { CollapseTransition },
        props: {
            data: {
                type: Object,
                default () {
                    return {};
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: false
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                indeterminate: false
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-children`
                ];
            },
            selectedCls () {
                return [
                    {
                        [`${prefixCls}-node-selected`]: this.data.selected
                    }
                ];
            },
            arrowClasses () {
                return [
                    `${prefixCls}-arrow`,
                    {
                        [`${prefixCls}-arrow-disabled`]: this.data.disabled,
                        [`${prefixCls}-arrow-open`]: this.data.expand,
                        [`${prefixCls}-arrow-hidden`]: !(this.data.children && this.data.children.length)
                    }
                ];
            },
            titleClasses () {
                return [
                    `${prefixCls}-title`,
                    {
                        [`${prefixCls}-title-selected`]: this.data.selected
                    }
                ];
            }
        },
        methods: {
            handleExpand () {
                if (this.data.disabled) return;
                this.$set(this.data, 'expand', !this.data.expand);
                this.dispatch('BSTree', 'toggle-expand', this.data);
            },
            handleSelect () {
                if (this.data.disabled) return;
                if (this.data.selected) {
                    this.data.selected = false;
                } else if (this.multiple) {
                    this.$set(this.data, 'selected', !this.data.selected);
                } else {
                    this.dispatch('BSTree', 'selected', this.data);
                }
                this.dispatch('BSTree', 'on-selected');
            },
            handleCheck () {
                if (this.disabled) return;
                const checked = !this.data.checked;
                if (!checked || this.indeterminate) {
                    findComponentsDownward(this, 'BSTreeNode').forEach(node => node.data.checked = false);
                } else {
//                    findComponentsDownward(this, 'BSTreeNode').forEach(node => node.data.checked = true);
                }
                this.data.checked = checked;
//                this.dispatch('BSTree', 'checked');
//                this.dispatch('BSTree', 'on-checked');
            },
            setIndeterminate () {
                this.indeterminate = this.data.checked ? false : findComponentsDownward(this, 'BSTreeNode').some(node => node.data.checked);
            }
        },
        created () {
            // created node.vue first, mounted BSTree.vue second
            if (!this.data.checked) this.$set(this.data, 'checked', false);
        },
        mounted () {
            this.$on('indeterminate', () => {
                this.broadcast('BSTreeNode', 'indeterminate');
                this.setIndeterminate();
            });
        }
    };
</script>