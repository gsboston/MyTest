<style scoped>
    .show-edit-btn{
        display: none;
        margin-left: -10px;
    }
    .ivu-table-cell:hover .show-edit-btn{
        display: inline-block;
    }
</style>

<template>
    <div>
        <Table :height="height" :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
    </div>
</template>

<script type="text/babel">
//行校验
var validate = function(row,columns){
    var flag = true;
    var msg = "";
    for(var item of columns){
        if(item.require&&!row[item.key]){
            flag = false;
            msg = "【"+item.title+"】为必填项";
        }
    }
    return {
        state:flag,
        msg:msg
    };
};
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : 'primary',
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                if (!currentRow.editting) {
                    if (currentRow.edittingCell) {
                        for (let name in currentRow.edittingCell) {
                            currentRow.edittingCell[name] = false;
                            vm.edittingStore[index].edittingCell[name] = false;
                        }
                    }
                    vm.edittingStore[index].editting = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                } else {
                    //增加对当前行必填的校验
                    var validateObj = validate(vm.edittingStore[index],vm.columnsList);
                    if(!validateObj.state){
                        vm.$Message.error(validateObj.msg);
                    }else{
                        vm.edittingStore[index].saving = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        let edittingRow = vm.edittingStore[index];
                        edittingRow.editting = false;
                        edittingRow.saving = false;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                        vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                    }
                }
            }
        }
    }, currentRow.editting ? '保存' : '编辑');
};
const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除这条数据吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.thisTableData.splice(index, 1);
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
    ]);
};
const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};
const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
const cellInput = (vm, h, param, item) => {
    return h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
};
export default {
    name: 'EditTable',
    props: {
        height:String,
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: []
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData.map((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                //下拉类型显示label
                                if(param.column.type=='select'){
                                    var selectOptions = param.column.selectOptions;
                                    var result={
                                        text:''
                                    };
                                    if(currentRow[item.key]!==''){
                                        result = selectOptions.find((i)=>{
                                                    return i.value==currentRow[item.key];
                                        });
                                    }
                                    return h('span', result.text);
                                }
                                else
                                    return h('span', currentRow[item.key]);
                            }
                        } else {
                            var result;
                            //处理select类型
                            if(param.column.type=='select'){
                                var selectOptions = param.column.selectOptions;
                                var defaultValue = param.column.default?param.column.default:"";
                                vm.edittingStore[param.index][param.column.key] = defaultValue;
                                if(selectOptions&&selectOptions.length>0){
                                    var optionList = [];
                                    for(var i = 0;i<selectOptions.length;i++){
                                        var currentItem = h('Option', {
                                            props: {
                                                value:selectOptions[i].value
                                            },
                                            domProps:{
                                                innerHTML:selectOptions[i].text
                                            }
                                        });
                                        optionList.push(currentItem);
                                    }
                                    result = h('Select',{
                                                props: {
                                                    value:currentRow[item.key]?currentRow[item.key]:defaultValue
                                                },
                                                on: {
                                                    'on-change' (data) {
                                                        let value = data;
                                                        let key = param.column.key;
                                                        vm.edittingStore[param.index][key] = value;
                                                    }
                                                }
                                            },
                                            [optionList]
                                    );
                                }

                            }else{
                                result = h('Input', {
                                    props: {
                                        type: 'text',
                                        value: currentRow[item.key]
                                    },
                                    on: {
                                        'on-change' (event) {
                                            let key = param.column.key;
                                            vm.edittingStore[param.index][key] = event.target.value;

                                        }
                                    }
                                });
                            }
                            return result;
                        }
                    };
                }
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        //获取不可编辑状态
                        let non_editable = currentRowData.non_editable;
                        let children = [];
                        item.handle.forEach(item => {
                            //添加不可编辑数据的适配
                            if (item === 'edit'&&!non_editable) {
                                children.push(editButton(this, h, currentRowData, param.index));
                            } else if (item === 'delete') {
                                children.push(deleteButton(this, h, currentRowData, param.index));
                            }
                        });
                        return h('div', children);
                    };
                }
            });
        },
        isEditing(){
            var flag = false;
            this.thisTableData.forEach(item=>{
                if(item.editting){
                    flag = true;
                }
            });
            return flag;
        },
        handleBackdata (data) {
            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData.forEach(item => {
                delete item.editting;
                delete item.edittingCell;
                delete item.saving;
            });
            return clonedData;
        },
        editData(index){
            var row = this.thisTableData[index];
            if (row.edittingCell) {
                for (let name in row.edittingCell) {
                    row.edittingCell[name] = false;
                    this.edittingStore[index].edittingCell[name] = false;
                }
            }
            this.edittingStore[index].editting = true;
            this.thisTableData = JSON.parse(JSON.stringify(this.edittingStore));
        }

    },
    watch: {
        value (data) {
            this.init();
        }
    }
};
</script>
