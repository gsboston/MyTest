const Option = function() {
    this.state = [];
    // this.invoiceState = [];
    for(let i = 0; i < arguments.length; i++) {
        let condition = arguments[i];
        let group = condition.group;
        if(this.hasOwnProperty(group)) {
            group = this[group];
            group.push && group.push(condition);
        }
    }
};

const Condition = function(group, code, name, isBasis,visible, selected) {
    isBasis = (isBasis === true ? true : false);
    visible = (visible === false ? false : true);
    selected = (selected === true || selected === false ? selected : !visible);
    this.group = group;
    this.code = code;
    this.name = name;
    this.isBasis = isBasis;//是基础查询条件
    this.visible = visible;//是否显示
    this.selected = selected;//是否选中
};

Option.addNone = function(isBasis,visible, selected) {
    let condition = new Condition("state", "NONE", "待提交",isBasis, visible, selected);
    return condition;
};

Option.addCommited = function(isBasis,visible, selected) {
    let condition = new Condition("state", "COMMITTED", "待审核",isBasis, visible, selected);
    return condition;
};

Option.addApproved = function(isBasis,visible, selected) {
    let condition = new Condition("state", "APPROVED", "已核准",isBasis, visible, selected);
    return condition;
};

Option.addSigning = function(isBasis,visible, selected) {
    let condition = new Condition("state", "SIGNING", "签约中",isBasis, visible, selected);
    return condition;
};

Option.addSigned = function(isBasis,visible, selected) {
    let condition = new Condition("state", "SIGNED", "已签署",isBasis, visible, selected);
    return condition;
};

Option.addTermination = function(isBasis,visible, selected) {
    let condition = new Condition("state", "TERMINATION", "已解约",isBasis, visible, selected);
    return condition;
};
// Option.addInvoiceNone = function(visible, selected) {
//     let condition = new Condition("invoiceState", "NONE", "未开票", visible, selected);
//     return condition;
// };
// Option.addInvoiceInvoiced = function(visible, selected) {
//     let condition = new Condition("invoiceState", "INVOICED", "部分开票", visible, selected);
//     return condition;
// };
// Option.addInvoiceFinish = function(visible, selected) {
//     let condition = new Condition("invoiceState", "FINISH", "已结束", visible, selected);
//     return condition;
// };
export default Option;