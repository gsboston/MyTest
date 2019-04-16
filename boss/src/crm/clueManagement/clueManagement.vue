<template>
    <div>
        <!--搜索条件-->
        <div class="queryBar" :class="{'collapse': isCollapse}">
            <div class="condition">搜索条件</div>
            <Form ref="searchCriteria" :model="searchCriteria" :label-width="80" inline>
                <FormItem label="区域" prop="region" style="width: 100%;">
                    <Cascader class="region-cascader" :clearable="false" :data="regionList" :load-data="loadInferior" change-on-select @on-change="handleChange"
                              v-model="searchCriteria.region"></Cascader>
                </FormItem>
                <FormItem class="clue-name" label="线索名称" prop="name" style="width: 100%;">
                    <Input v-model="searchCriteria.name" @on-blur="conditionalChange(searchCriteria.name, '线索名称')" :maxlength="200"></Input>
                    <Button class="ivu-btn1" v-show="searchCriteria.isAccurate != '1'" @click.stop="searchCriteria.isAccurate = '1'">精</Button>
                    <Button class="ivu-btn-red" v-show="searchCriteria.isAccurate == '1'" @click.stop="searchCriteria.isAccurate = ''">精</Button>
                </FormItem>
                <FormItem label="意向线索" prop="serviceType" style="width: 100%;">
                    <!--自定义下拉菜单-->
                    <div class="service-type-menu" @mouseleave="closeServiceTypeMenu">
                        <Tag type="border" style="width: 100%; height: 32px; padding-top: 3px;" @click.native="showServiceTypeMenu">
                            <Row>
                                <i-col span="23">
                                    <span style="color:#bcbcbc" v-if="searchCriteria.serviceType.length == 0">点击下拉菜单选择意向线索</span>
                                    <div v-else>
                                        <span class="service-type-menu-input-content" :title="item.val" v-for="(item, index) in selectedConditionList"
                                              :key="index" v-if="item.name === '意向线索'">{{item.val}}</span>
                                    </div>
                                </i-col>
                                <i-col span="1">
                                    <Icon type="arrow-up-b" v-if="isShowServiceTypeMenu"></Icon>
                                    <Icon type="arrow-down-b" v-else></Icon>
                                </i-col>
                            </Row>
                        </Tag>
                        <!--<Input placeholder="点击下拉菜单选择意向线索" readonly style="width: 100%;"></Input>-->
                        <div class="service-type-menu-list" v-if="isShowServiceTypeMenu">
                            <div v-for="item in serviceTypeList" :key="item.id" @click="selectServiceTypes(searchCriteria.serviceType,item)">
                                <Row class="item" :class="{'active': item.select}">
                                    <i-col span="20">
                                        <Row>
                                            <i-col span="22">
                                                {{item.name}}
                                            </i-col>
                                            <i-col span="2">
                                                <Icon v-show="item.select" type="checkmark"></Icon>
                                            </i-col>
                                        </Row>
                                    </i-col>
                                    <i-col span="4" v-if="item.edit" style="width: 24px; margin-right: 3px;">
                                        <Button type="dashed" size="small" @click.stop="delServiceType(serviceTypeList, item)">
                                            <Icon type="close"></Icon>
                                        </Button>
                                    </i-col>
                                </Row>
                            </div>
                            <Row>
                                <i-col span="24" style="text-align: right;">
                                    <Row v-if="addServiceTypeStatus">
                                        <i-col span="16">
                                            <Input v-model="inputServiceType" :maxlength="10"></Input>
                                        </i-col>
                                        <i-col span="4" style="width: 24px; margin-left: 3px;">
                                            <Button type="dashed" size="small" @click="saveServiceType(inputServiceType)">
                                                <Icon type="checkmark"></Icon>
                                            </Button>
                                        </i-col>
                                        <i-col span="4" style="width: 24px; margin-left: 3px;">
                                            <Button type="dashed" size="small" @click="cancelStatus">
                                                <Icon type="close"></Icon>
                                            </Button>
                                        </i-col>
                                    </Row>
                                    <Button icon="ios-plus-empty" type="dashed" size="small" @click="addStatus" v-else>添加其他</Button>
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="注册时间" prop="registerTime" style="width: 100%;">
                    <DatePicker type="daterange" :options="options2" placement="bottom-start" placeholder="选择日期" style="width:100%"
                                v-model="searchCriteria.registerTime" @on-change="conditionalChangeS('searchCriteria.registerTime', '注册时间')"
                                @on-clear="conditionalChange('', '注册时间')" :format="'yyyy-MM-dd'"></DatePicker>
                </FormItem>
                <FormItem label="行业分类" prop="industryType" style="width: 100%;">
                    <!--<Select v-model="searchCriteria.industryType" multiple filterable @on-change="conditionalChange(searchCriteria.industryType, '行业分类', industryTypeList)">-->
                    <!--<Option v-for="item in industryTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <Select class="industry-type-select" v-model="searchCriteria.industryType" multiple filterable @on-change="industryTypeChange">
                        <Option v-for="item in industryTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="企业状态" prop="enterpriseStatus" style="width: 100%;">
                    <Select v-model="searchCriteria.enterpriseStatus" filterable
                            @on-change="conditionalChange(searchCriteria.enterpriseStatus, '企业状态', enterpriseStatusList)">
                        <Option v-for="item in enterpriseStatusList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="民事主体" prop="civilBody" style="width: 100%;">
                    <Select v-model="searchCriteria.civilBody" filterable @on-change="conditionalChange(searchCriteria.civilBody, '民事主体', civilBodyList)">
                        <Option v-for="item in civilBodyList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="注册资本" prop="registeredCapital" style="width: 100%;">
                    <Select v-model="searchCriteria.registeredCapital" filterable
                            @on-change="conditionalChange(searchCriteria.registeredCapital, '注册资本', registeredCapitalList)">
                        <Option v-for="item in registeredCapitalList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="人员规模" prop="personnelScale" style="width: 100%;">
                    <Select v-model="searchCriteria.personnelScale" filterable
                            @on-change="conditionalChange(searchCriteria.personnelScale, '人员规模', personnelScaleList)">
                        <Option v-for="item in personnelScaleList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="地址" prop="address" style="width: 100%;">
                    <Input v-model="searchCriteria.address" @on-blur="conditionalChange(searchCriteria.address, '地址')" :maxlength="200"></Input>
                </FormItem>
                <FormItem style="width: 100%;">
                    <Button type="primary" @click="searchPageFirst" style="width: 200px; margin-left: -17px;">查一下</Button>
                </FormItem>
            </Form>
            <Button type="ghost" icon="chevron-left" size="small" @click="collapse" class="collapseBtn"></Button>
        </div>
        <div class="main">
            <div class="clues">
                <!--已选条件-->
                <div class="searchBar">
                    <Row style="line-height: 30px;">
                        <i-col span="3" style="color: #999; width: 70px;">
                            已选条件：
                        </i-col>
                        <i-col span="21">
                            <Tag :title="item.name + ':' + item.val" class="ivu-tag-new" type="border" :closable="item.name !== '区域'" color="green"
                                 v-for="(item, index) in selectedConditionList" :key="index" @on-close="delSelectedCondition(item)" v-show="item.val">
                                {{item.name + ':' + item.val}}
                            </Tag>
                            <div class="del-all" @click="delAllSelectedCondition(selectedConditionList)">重置条件</div>
                        </i-col>
                    </Row>
                    <a href="javascript:void(0);" @click="showEyePrompt" class="eyePromptLink">
                        <Icon type="ios-location"></Icon>
                        使用地图查询附近的公司
                    </a>
                </div>

                <div class="clueList">
                    <div class="clueHeader">
                        <Row type="flex" align="middle">
                            <template v-if="clues.length">
                                <i-col span="1">
                                    <Checkbox
                                            :indeterminate="indeterminate"
                                            :value="checkAll"
                                            @click.prevent.native="handleCheckAll"></Checkbox>
                                </i-col>
                                <i-col span="2">
                                    <a href="javascript:void(0);" class="checkAll" :disabled="!checkAllGroup.length" @click="collectionAll">全部收藏</a>
                                </i-col>
                            </template>
                            <i-col span="9" offset="1">
                                找到 {{this.total}} 个相关结果
                                <template v-if="searchTime < 3">，用时 {{this.searchTime}} 秒</template>
                            </i-col>
                            <i-col span="10" offset="1" class="clueHeaderAction" v-if="clues.length">
                                <clueUploadTemplate></clueUploadTemplate>
                                <Button href="javascript:void(0);" icon="plus" @click="add">
                                    添加
                                </Button>
                                <Select v-model="sortModel" class="sort" placeholder="默认排序" @on-change="sortChange">
                                    <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </i-col>
                        </Row>
                    </div>
                    <div class="nodata" v-if="!clues.length">
                        <img src="./images/nodata.png" alt="">
                        <div class="nodataText">你搜的关键字，找不到啊！</div>
                        <Button class="clueAdd" type="primary" @click="add">我要添加</Button>
                    </div>
                    <div class="clueItem" v-for="(clue, index) in clues" :key="index">
                        <Row class="itemPanel" :class="{'active': clue.isExtend}" @click.native="extend(clue)">
                            <i-col span="1" class="checkbox">
                                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                                    <Checkbox :label="clue.basic.hxId" @on-change="checkboxChange" @click.stop.native><span></span></Checkbox>
                                </CheckboxGroup>
                            </i-col>
                            <i-col span="2">
                                <Badge class-name="badge-new" :count="!clue.track ? 'NEW' : ''">
                                    <!--<img class="avatar" src="./images/company.png" v-if="clue.isEnterprise"/>-->
                                    <!--<img class="avatar" src="./images/person.png" v-else/>-->
                                    <template v-if="clue.isEnterprise">
                                        <img class="avatar" :src="clue.company.logo" v-if="clue.company.logo"/>
                                        <img class="avatar" src="./images/company.png" v-else/>
                                    </template>
                                    <template v-else>
                                        <img class="avatar" :src="clue.personal.logo" v-if="clue.personal.logo"/>
                                        <img class="avatar" src="./images/person.png" v-else/>
                                    </template>
                                </Badge>
                            </i-col>
                            <i-col span="17" offset="1">
                                <Row class="header">
                                    <i-col class="name">
                                        <!--<span v-if="clue.isEnterprise">{{clue.company.name}}</span>-->
                                        <!--<span v-else>{{clue.personal.name}}</span>-->
                                        <template v-if="clue.isEnterprise">
                                            <Tooltip placement="bottom" v-if="clue.company.name && clue.company.name.length > 20">
                                                <span>{{clue.company.name}}</span>
                                                <div slot="content">
                                                    <div>{{clue.company.name}}</div>
                                                </div>
                                            </Tooltip>
                                            <span v-else>{{clue.company.name}}</span>
                                        </template>
                                        <template v-else>
                                            <Tooltip placement="bottom" v-if="clue.personal.name.length > 20">
                                                <span>{{clue.personal.name}}</span>
                                                <div slot="content">
                                                    <div>{{clue.personal.name}}</div>
                                                </div>
                                            </Tooltip>
                                            <span v-else>{{clue.personal.name}}</span>
                                        </template>
                                    </i-col>
                                    <i-col class="source">
                                        <span>来源:</span>
                                        <span>{{clue.basic.channelName || '-'}}</span>
                                    </i-col>
                                    <!--<template v-if="clue.basic.totalOpportunity && clue.basic.totalOpportunity != 0">-->
                                    <!--<i-col class="opportunity">-->
                                    <!--<span>商机</span>-->
                                    <!--<span>{{clue.basic.totalOpportunity}}</span>-->
                                    <!--</i-col>-->
                                    <!--</template>-->
                                    <template v-if="clue.basic.totalContract && clue.basic.totalContract !== 0">
                                        <i-col class="contract">
                                            <span>合同</span>
                                            <span>{{clue.basic.totalContract}}</span>
                                        </i-col>
                                    </template>
                                </Row>
                                <div class="info">
                                    <Row type="flex" justify="start" v-if="clue.isEnterprise">
                                        <i-col>
                                            <span>行业：{{clue.company.industryName || '-'}}</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>注册资本：{{clue.company.registeredCapital || '-'}}万元</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>注册时间：{{clue.company.foundingTime || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-else>
                                        <i-col>
                                            <!--<span>电话：{{clue.personal.mobile || '-'}}</span>-->
                                            <span v-if="clue.personal.mobile">
                                                电话：
                                                <Tooltip :content="clue.personal.mobile" @click.native.stop>
                                                    {{clue.personal.mobile.substr(0, 3) + '****' + clue.personal.mobile.substr(7)}}
                                                </Tooltip>
                                            </span>
                                            <span v-else>电话：-</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>数据更新时间：{{clue.basic.tsUpdate || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-if="clue.isEnterprise">
                                        <i-col>
                                            <span>
                                                法人：{{clue.company.legalRepresentative || '-'}}
                                                <template v-if="clue.company.companyContactsMobile">
                                                    <Tooltip :content="clue.company.companyContactsMobile" @click.native.stop>
                                                        {{clue.company.companyContactsMobile.substr(0, 3) + '****' + clue.company.companyContactsMobile.substr(7)}}
                                                    </Tooltip>
                                                </template>
                                                <template v-else>-</template>
                                                <!--{{clue.company.companyContactsMobile || '-'}}-->
                                            </span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>数据更新时间：{{clue.basic.tsUpdate || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-else>
                                        <i-col>
                                            <span>邮箱：{{clue.personal.email || '-'}}</span>
                                        </i-col>
                                        <i-col span="1"></i-col>
                                        <i-col>
                                            <span>微信：{{clue.personal.wechat || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start">
                                        <i-col>
                                            <span>最后拜访时间：{{clue.basic.maxTrackTime || '-'}}</span>
                                        </i-col>
                                        <i-col span="1"></i-col>
                                        <i-col>
                                            <span v-if="clue.isEnterprise">地址：{{clue.company.companyAddress || '-'}}</span>
                                            <span v-else>地址：{{clue.personal.address || '-'}}</span>
                                        </i-col>
                                    </Row>
                                </div>
                                <div class="tags" @click.stop>
                                    <Tag v-for="tag in clue.tags" :key="tag.tagId" :name="tag.tagId" v-if="tag.type === 1 || tag.type === 4" type="border"
                                         :closable="tag.isCreateYouself && tag.type === 1"
                                         :class="{tagGrey : !tag.isCreateYouself || tag.type !== 1}"
                                         @on-close="tagClose(clue.basic.hxId, tag.tagId, clue.tags)">
                                        {{tag.name}}
                                    </Tag>
                                    <Button class="ivu-btn2" icon="ios-plus-empty" type="dashed" size="small" @click.stop="tagAdd(clue)">给他贴标签</Button>
                                </div>
                                <div class="extendArrow" :class="{extendArrowReverse: clue.isExtend}">
                                    <Icon type="chevron-down"></Icon>
                                </div>
                            </i-col>
                            <i-col span="2" offset="1" class="buttonPanel">
                                <Button class="ivu-btn-red" @click.stop="collection(clue)" v-if="!clue.isCollected">收藏</Button>
                                <Button class="ivu-btn-red" @click.stop="collection(clue)" v-else>已收藏</Button>
                                <br/>
                                <Button class="ivu-btn1" @click.stop="eyeSearch(clue.company.name, clue.isEnterprise)" v-if="clue.isEnterprise">天眼查询</Button>
                                <Button class="ivu-btn1" @click.stop="eyeSearch(clue.personal.name, clue.isEnterprise)" v-else>天眼查询</Button>
                                <br/>
                                <Button class="ivu-btn1" @click.stop="edit(clue)" v-if="clue.basic.isCreateYouself">修改</Button>
                                <template v-else>
                                    <Button class="ivu-btn1" @click.stop="errorRecovery(clue)" v-if="!clue.isError">纠错</Button>
                                    <Button disabled v-else>已纠错</Button>
                                </template>
                            </i-col>
                        </Row>
                        <div class="extendPanel" v-if="clue.isExtend">
                            <span @click="closeExtend(clue)" class="closeExtend"><Icon type="close"></Icon></span>
                            <div class="extendTabs" v-if="clue.isEnterprise">
                                <span @click="clue.selectedTab = 0" :class="{'active': clue.selectedTab === 0}">基本信息</span>
                                <span @click="clue.selectedTab = 1" :class="{'active': clue.selectedTab === 1}">主要人员</span>
                                <!--<span @click="clue.selectedTab = 2" :class="{'active': clue.selectedTab === 2}">-->
                                <!--&lt;!&ndash;<Badge class-name="extendTabsBadge" :count="clue.basic.totalOpportunity">&ndash;&gt;-->
                                <!--商机-->
                                <!--&lt;!&ndash;</Badge>&ndash;&gt;-->
                                <!--</span>-->
                                <span @click="clue.selectedTab = 3" :class="{'active': clue.selectedTab === 3}">业务往来</span>
                                <span @click="clue.selectedTab = 4" :class="{'active': clue.selectedTab === 4}">信息评价</span>
                            </div>
                            <div class="extendTabs" v-else>
                                <span @click="clue.selectedTab = 0" :class="{'active': clue.selectedTab === 0}">基本信息</span>
                                <span @click="clue.selectedTab = 1" :class="{'active': clue.selectedTab === 1}">他的企业</span>
                                <!--<span @click="clue.selectedTab = 2" :class="{'active': clue.selectedTab === 2}">-->
                                <!--&lt;!&ndash;<Badge class-name="extendTabsBadge" :count="clue.basic.totalOpportunity">&ndash;&gt;-->
                                <!--商机-->
                                <!--&lt;!&ndash;</Badge>&ndash;&gt;-->
                                <!--</span>-->
                                <span @click="clue.selectedTab = 3" :class="{'active': clue.selectedTab === 3}">业务往来</span>
                                <span @click="clue.selectedTab = 4" :class="{'active': clue.selectedTab === 4}">信息评价</span>
                            </div>
                            <div class="" v-if="clue.isEnterprise">
                                <baseinfoCompany v-if="clue.selectedTab === 0" :id="1" :company="clue.company"></baseinfoCompany>
                                <personnel v-else-if="clue.selectedTab === 1" :clue="clue" :companyId="clue.company.id"></personnel>
                                <!--<opportunity v-else-if="clue.selectedTab === 2" @opportunityNumInit="opportunityNumInit" @resetPrompadd="resetPrompadd" @toSignContract="toSignContract" :id="clue.basic.hxId" :clue="clue" :prompadd="clue.prompadd" ref="opportunity"></opportunity>-->
                                <dealings v-else-if="clue.selectedTab === 3" :id="clue.basic.hxId"></dealings>
                                <evaluation v-else-if="clue.selectedTab === 4" :id="clue.basic.hxId"></evaluation>
                            </div>
                            <div v-else>
                                <baseinfoPersonal v-if="clue.selectedTab === 0" :personal="clue.personal" :tags="clue.tags"></baseinfoPersonal>
                                <companies v-else-if="clue.selectedTab === 1" :clue="clue" :personalId="clue.personal.id"></companies>
                                <!--<opportunity v-else-if="clue.selectedTab === 2" @opportunityNumInit="opportunityNumInit" @resetPrompadd="resetPrompadd" @toSignContract="toSignContract" :id="clue.basic.hxId" :clue="clue" :prompadd="clue.prompadd" ref="opportunity"></opportunity>-->
                                <dealings v-else-if="clue.selectedTab === 3" :id="clue.basic.hxId"></dealings>
                                <evaluation v-else-if="clue.selectedTab === 4" :id="clue.basic.hxId"></evaluation>
                            </div>
                        </div>
                    </div>
                    <Page class="cluePage" size="small" :total="total <= totalMax ? total : totalMax" :current="page" :page-size="pageSize"
                          :page-size-opts="pageSizeOpts" placement="bottom" v-if="clues.length" @on-change="cluePageChange"
                          @on-page-size-change="pageSizeChange" show-total show-elevator show-sizer></Page>
                </div>
            </div>
            <Modal
                    title="我要贴标签"
                    v-model="tagAddModal"
                    :closable="false"
                    :mask-closable="false"
                    :styles="{top: '20px'}">
                <!--<div slot="header"></div>-->

                <div style="text-align: center;">
                    <span>我要贴标签：</span>
                    <Input v-model="tagAddValue" :autofocus="true" :maxlength="10" style="width: 200px;"></Input>
                    <Checkbox v-model="isAnonymous">匿名</Checkbox>
                </div>

                <div slot="footer">
                    <Button type="primary" @click="tagAddOk">确定</Button>
                    <Button type="ghost" @click="tagAddCancel">取消</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import baseinfoCompany from './baseinfoCompany.vue'; // 基本信息-公司
    import baseinfoPersonal from './baseinfoPersonal.vue'; // 基本信息-个人
    import companies from './companies.vue'; // 他的企业
    import personnel from './personnel.vue'; // 主要人员
    import opportunity from './opportunity.vue'; // 商机
    import dealings from './dealings.vue'; // 业务往来
    import evaluation from './evaluation.vue'; // 信息评价
    import clueUploadTemplate from '../clueManagement/clueUploadTemplate.vue'; // 下载 excel 模版

    export default {
        props: {
//            jumpSearchName: null, // 跳转过来的线索名称
        },
        data: function () {
            return {
                clues: [],
                page: 1,
                total: 0,
                totalMax: 3000, // 线索数量限制最大条数
                pageSize: 10,
                pageSizeOpts: [10, 50, 100],
                searchTime: 0, // 查询线索花费时间
                sortList: [
                    {
                        value: 'registeredCapital_desc',
                        label: '注册资本降序'
                    }, {
                        value: 'registeredCapital',
                        label: '注册资本升序'
                    }, {
                        value: 'staffSize_desc',
                        label: '人员规模降序'
                    }, {
                        value: 'staffSize',
                        label: '人员规模升序'
                    }, {
                        value: 'tsUpdate_desc',
                        label: '数据更新时间降序'
                    }, {
                        value: 'tsUpdate',
                        label: '数据更新时间升序'
                    }
//                    {
//                        value: 'intentionality_desc',
//                        label: '意向度降序'
//                    }, {
//                        value: 'intentionality',
//                        label: '意向度升序'
//                    }, {
//                        value: 'collectionDate_desc',
//                        label: '收藏时间降序'
//                    }, {
//                        value: 'collectionDate',
//                        label: '收藏时间升序'
//                    }, {
//                        value: 'lastVisitDate_desc',
//                        label: '拜访时间降序'
//                    }, {
//                        value: 'lastVisitDate',
//                        label: '拜访时间升序'
//                    }, {
//                        value: 'nextVisitDate_desc',
//                        label: '下次拜访时间降序'
//                    }, {
//                        value: 'nextVisitDate',
//                        label: '下次拜访时间升序'
//                    }
                ],
                sortModel: '',
                isAnonymous: false, // 贴标签匿名
                checkAll: false, // 是否全选
                checkAllGroup: [], // 已选的线索 id 集合
                IdAllGroup: [], // 所有能选择的线索 id 集合
                indeterminate: false, // 部分选择
                tagAddValue: '',
                tagAddClue: null,
                tagAddModal: false,
                isCollapse: false, // queryBar 默认展开
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理


                userRegionInfo: {},
                searchCriteria: {
                    serviceType: [],
                    industryType: [],
                    region: [],
                    isAccurate: ''//是否精确查找，默认否。'1'为精确查找
                },//查询时提交到node层的对象
                serviceTypeList: [],//意向线索列表数据
                inputServiceType: '',//输入意向线索
                addServiceTypeStatus: false,//添加意向线索状态
                isShowServiceTypeMenu: false,//显示意向线索下拉菜单
                industryTypeList: [],//行业分类列表数据
                enterpriseStatusList: [],//企业状态列表数据
                civilBodyList: [
                    {
                        code: -1,
                        name: '全部'
                    },
                    {
                        code: 1,
                        name: '自然人'
                    },
                    {
                        code: 2,
                        name: '组织'
                    }
                ],//民事主体列表数据
                registeredCapitalList: [
                    {
                        code: '0—100000',
                        name: '十万以下'
                    },
                    {
                        code: '100001—300000',
                        name: '10万—30万'
                    },
                    {
                        code: '300001—500000',
                        name: '30万—50万'
                    },
                    {
                        code: '500001—1000000',
                        name: '50万—100万'
                    },
                    {
                        code: '1000001—3000000',
                        name: '100万—300万'
                    },
                    {
                        code: '3000001—5000000',
                        name: '300万—500万'
                    },
                    {
                        code: '5000001—100000000',
                        name: '500万以上'
                    }
                ],//注册资本列表数据
                personnelScaleList: [
                    {
                        code: '0—10',
                        name: '10人以下'
                    },
                    {
                        code: '11—50',
                        name: '11人—50人'
                    },
                    {
                        code: '51—100',
                        name: '50人—100人'
                    },
                    {
                        code: '101—500',
                        name: '101人—500人'
                    },
                    {
                        code: '501—100000',
                        name: '500人以上'
                    }
                ],//人员规模列表数据
                regionList: [],
                options2: {
                    shortcuts: [
//                        {
//                            text: '最近一周',
//                            value() {
//                                const end = new Date();
//                                const start = new Date();
//                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//                                return [start, end];
//                            }
//                        },
//                        {
//                            text: '最近一个月',
//                            value() {
//                                const end = new Date();
//                                const start = new Date();
//                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
//                                return [start, end];
//                            }
//                        },
                        {
                            text: '最近三个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近半年',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一年',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                                return [start, end];
                            }
                        }
                    ]
                },
                selectedConditionList: [
                    {
                        name: "区域",
                        val: "",
                        tag: "region"
                    },
                    {
                        name: "线索名称",
                        val: "",
                        tag: "name"
                    },
                    {
                        name: "意向线索",
                        val: "",
                        tag: "serviceType"
                    },
                    {
                        name: "注册时间",
                        val: "",
                        tag: "registerTime"
                    },
                    {
                        name: "地址",
                        val: "",
                        tag: "address"
                    },
                    {
                        name: "行业分类",
                        val: "",
                        tag: "industryType"
                    },
                    {
                        name: "企业状态",
                        val: "",
                        tag: "enterpriseStatus"
                    },
                    {
                        name: "民事主体",
                        val: "",
                        tag: "civilBody"
                    },
                    {
                        name: "注册资本",
                        val: "",
                        tag: "registeredCapital"
                    },
                    {
                        name: "人员规模",
                        val: "",
                        tag: "personnelScale"
                    }
                ]//已选择查询条件数据
            }
        },
        created: function () {
//            if(this.jumpSearchName){
//                this.searchName(this.jumpSearchName);
//            }
//            this.search();

            this.getServiceTypeList();//请求意向线索列表数据
            this.getIndustryTypeList();//请求行业分类列表数据
            this.getEnterpriseStatusList();//请求企业状态列表数据
            this.getRegionList();//请求区域列表数据
        },
        methods: {
            search: function () {
                let searchStart = Date.now(),
                    searchEnd = 0;

                this.request({
                    url: '/crm/clueManagement/list.do',
                    data: {
                        searchCriteria: this.searchCriteria,
                        page: this.page - 1,
                        pageSize: this.pageSize
                    }
                }).then(data => {
                    this.clues = data.hints || [];
                    this.page = data.page + 1;
                    this.total = parseInt(data.total) || 0;
                    this.pageSize = parseInt(data.size) || 10;

                    searchEnd = Date.now();
                    this.searchSpendTime(searchStart, searchEnd);

                    this.resetCheck();

                    this.clues.forEach((item) => {
                        if (item.isEnterprise) {
                            item.company.logo = item.company.logo ? this.$updateConfig.file + item.company.logo + this.imageService : item.company.logo;
                        } else {
                            item.personal.logo = item.personal.logo ? this.$updateConfig.file + item.personal.logo + this.imageService : item.personal.logo;
                        }
                        this.IdAllGroup.push(item.basic.hxId);
                    })
                });
            },
            extend: function (clue) {
//                console.log('extend');
                clue.isExtend = !clue.isExtend;
                clue.selectedTab = 0;
            },
            collection: function (clue) {
//                console.log('collection');
//                console.log(clue);
                this.request({
                    url: '/crm/clueManagement/clueCollect.do',
                    param: {
                        id: clue.basic.hxId
                    }
                }).then(() => {
                    clue.isCollected = !clue.isCollected;

                    if (clue.isCollected) {
                        this.$Message.success('收藏成功');
                    } else {
                        this.$Message.success('取消收藏成功');
                    }
                });
            },
            collectionAll: function () {
//                console.log('collectionAll');
                this.request({
                    url: '/crm/clueManagement/clueCollectAll.do',
                    param: {
                        ids: this.checkAllGroup
                    }
                }).then(() => {
                    this.clues.forEach((clue) => {
                        this.checkAllGroup.forEach((item) => {
                            if (clue.basic.hxId === item) {
                                clue.isCollected = true;
                            }
                        })
                    })
                    this.$Message.success('收藏成功');
                });
            },
            eyeSearch: function (key, isEnterprise) {
                key = key || '';
                if (isEnterprise) {
                    window.open('https://www.tianyancha.com/search?key=' + key);
                } else {
                    window.open('https://www.tianyancha.com/humansearch/' + key + '?searchfrom=human');
                }
            },
            errorRecovery: function (clue) {
//                console.log('errorRecovery');
//                console.log(clue);

                this.prompt({
                    code: 'errorRecovery',
                    title: '纠错',
                    width: 600,
                    height: 240,
                    props: {
                        id: clue.basic.hxId
                    },
                    callback: (status, close) => {
                        if (status === 'success') {
                            clue.isError = true;
                        }
                        close();
                    }
                })
            },
            changeTab: function (clue) {
//                console.log('changeTab');
//                console.log(clue);
                clue.selectedTab = 3;
            },
            closeExtend: function (clue) {
                clue.isExtend = false;
                clue.selectedTab = 0;
            },
            tagAdd(clue) {
                this.tagAddModal = true;
                this.tagAddClue = clue;
            },
            tagAddCancel: function () {
                this.tagAddModal = false;
                this.tagAddValue = '';
                this.isAnonymous = false;
                this.tagAddClue = null;
            },
            tagAddOk: function () {
                var value = this.tagAddValue;

                if (!value || !value.trim()) {
                    this.$Message.warning('请填写标签名称');
                    return;
                }else if(!/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)){
                    this.$Message.warning('请填写字母数字汉字');
                    return;
                }

                this.request({
                    url: '/crm/clueManagement/tagsAdd.do',
                    data: {
                        id: this.tagAddClue.basic.hxId,
                        tagAddValue: this.tagAddValue,
                        isAnonymous: this.isAnonymous
                    }
                }).then(data => {
//                    data.isCreateYouself = true;
                    this.tagAddClue.tags = data;

                    this.tagAddModal = false;
                    this.tagAddValue = '';
                    this.isAnonymous = false;
                    this.tagAddClue = null;
                });
            },
            tagClose(clueId, tagId, tags) {
                this.request({
                    url: '/crm/clueManagement/tagsDel.do',
                    param: {
                        clueId,
                        tagId
                    }
                }).then(() => {
                    tags.forEach(function (item, index) {
                        if (item.tagId === tagId) {
                            tags.splice(index, 1);
                        }
                    });
                    this.$Message.success({
                        content: '删除成功！',
                        duration: 2.5
                    });
                });
            },
            cluePageChange: function (page) {
                this.page = page;
                this.search();
            },
            pageSizeChange: function (pageSize) {
                this.pageSize = pageSize;
                this.search();
            },
            searchSpendTime: function (searchStart, searchEnd) {
                this.searchTime = (searchEnd - searchStart) / 1000;
            },
            opportunityNumInit: function (clue, num, operation) {
                if (operation === 'plus') {
                    clue.basic.totalOpportunity = num;
                } else if (operation === 'minus') {
                    clue.basic.totalOpportunity = clue.basic.totalOpportunity - num;
                }
            },
            checkboxChange: function () {
//                console.log('checkboxChange')
            },
            checkAllGroupChange: function (arr) {
                if (arr.length === this.clues.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (arr.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
//                console.log(this.checkAllGroup)
            },
            handleCheckAll: function () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = [...this.IdAllGroup];
                } else {
                    this.checkAllGroup = [];
                }
//                console.log(this.checkAllGroup)
            },
            /* 重置所有 checkbox 框 */
            resetCheck: function () {
                this.checkAllGroup.splice(0);
                this.IdAllGroup.splice(0);
                this.checkAll = false;
                this.indeterminate = false;
            },
            sortChange: function (selected) {
//                console.log('sortChange')
//                console.log(selected)
                let isDesc = false;
                if (selected.indexOf('desc') > -1) {
                    isDesc = true;
                }

                this.clues.sort(function (a, b) {
                    if (isDesc) {
                        let index = selected.split('_desc')[0];
                        if (index === 'tsUpdate') {
                            return a.basic[index] < b.basic[index];
                        } else {
                            return a.company[index] < b.company[index];
                        }
                    } else {
                        if (selected === 'tsUpdate') {
                            return a.basic[selected] > b.basic[selected];
                        } else {
                            return a.company[selected] > b.company[selected];
                        }
                    }
                })
                this.checkAllGroup.splice(0);
                this.checkAll = false;
                this.indeterminate = false;
            },
            resetPrompadd: function (clue) {
                clue.prompadd = null;
            },
            edit(clue) {
                this.prompt({
                    code: 'addClues',
                    title: '修改线索',
                    width: 950,
                    height: 600,
                    top: 5,
                    props: {
                        addFlag: false,
                        clueId: clue.basic.hxId,
                        tabName: clue.isEnterprise ? 'enterpriseName' : 'personalName'
                    },
                    callback: (searchNameData, refresh, close) => {
                        if (refresh === 'refresh') {
                            this.searchPageFirst();
                        } else {
                            close();
                        }
                    }
                })
            },
            collapse() {
                this.isCollapse = !this.isCollapse;
            },
            toSignContract(businessCode, oppoData) {
                console.log('toSignContract-clue');
//                console.log(businessCode);
//                console.log(oppoData);
                if (businessCode && oppoData) {
                    this.$api.addContract(businessCode, oppoData);
                }
            },
            /*根据省份code得到省份名字*/
            getProvinceName: function (code) {
                for (var i = 0; i < this.regionList.length; i++) {
                    if (this.regionList[i].value == code) return this.regionList[i].label;
                }
                return '';
            },


            handleChange: function (value, selectedData) {
//                console.log(value)
//                console.log(selectedData)
//                console.log(this.searchCriteria.region);
                let tempArr = [];
                for (let i = 0; i < selectedData.length; i++) {
                    tempArr.push(selectedData[i].label);
                }
                for (let i = 0; i < this.selectedConditionList.length; i++) {
                    if (this.selectedConditionList[i].name == '区域') {
                        this.selectedConditionList[i].val = tempArr;
                    }
                }
            },
            /*请求意向线索列表数据*/
            getServiceTypeList: function () {
                this.request({
                    url: '/crm/myCollection/serviceTypeList.do'
                }).then(serviceTypeList => {
                    this.serviceTypeList = serviceTypeList || [];
                })
            },
            /*显示意向线索下拉菜单*/
            showServiceTypeMenu: function () {
                this.isShowServiceTypeMenu = true;
            },
            /*关闭意向线索下拉菜单*/
            closeServiceTypeMenu: function () {
                this.isShowServiceTypeMenu = false;
            },
            /*添加其他意向线索*/
            addStatus: function () {
                this.inputServiceType = '';
                this.addServiceTypeStatus = true;
            },
            /*取消添加其他意向线索*/
            cancelStatus: function () {
                this.inputServiceType = '';
                this.addServiceTypeStatus = false;
            },
            /*保存添加其他意向线索*/
            saveServiceType: function (inputServiceType) {
                if (!inputServiceType.trim()) {
                    this.$Message.warning('不能为空');
                    return;
                }
                let tempSign = true;
                for (let i = 0; i < this.serviceTypeList.length; i++) {
                    if (this.serviceTypeList[i].name == this.inputServiceType.trim()) tempSign = false;
                }
                if (!tempSign) {
                    this.$Message.warning('不能重复!');
                    return;
                }
                this.request({
                    url: '/crm/myCollection/saveServiceType.do',
                    param: {
                        name: inputServiceType.trim()
                    }
                }).then(item => {
                    this.serviceTypeList.push(item);
                    this.addServiceTypeStatus = false;
                    this.selectServiceTypes(this.searchCriteria.serviceType, item);
                })
            },
            /*删除添加其他意向线索*/
            delServiceType: function (arr, item) {
                this.request({
                    url: '/crm/myCollection/delServiceType.do',
                    param: {
                        id: item.id
                    }
                }).then(() => {
                    if (item.select) this.selectServiceTypes(this.searchCriteria.serviceType, item);
                    arr.forEach(function (obj, index) {
                        if (obj.id === item.id) {
                            arr.splice(index, 1);
                        }
                    });
                });
            },
            /*选择意向线索*/
            selectServiceTypes: function (arr, item) {
                item.select = !item.select;
                if (item.select) {
                    arr.push(item);
                } else {
                    arr.forEach(function (i, index) {
                        if (i.id === item.id) {
                            arr.splice(index, 1);
                        }
                    });
                }
//                console.log(arr);
                let tempArr = arr.map((item) => {
                    return item.name;
                });
//                console.log(tempArr.join(','));
                this.conditionalChange(tempArr.join(','), '意向线索');
            },
            /*请求行业分类列表数据*/
            getIndustryTypeList: function () {
                this.request({
                    url: '/crm/myCollection/industryTypeList.do'
                }).then(industryTypeList => {
                    this.industryTypeList = industryTypeList;
                })
            },
            /*请求企业状态列表数据*/
            getEnterpriseStatusList: function () {
                this.request({
                    url: '/crm/myCollection/enterpriseStatusList.do'
                }).then(enterpriseStatusList => {
                    this.enterpriseStatusList = enterpriseStatusList;
                })
            },
            /*请求区域列表数据*/
            getRegionList: function () {
                this.request({
                    url: '/crm/myCollection/regionList.do'
                }).then(regionList => {
                    if (regionList && regionList.length > 0) {
                        regionList.splice(0, 1);
                        regionList.push({value: "999999", label: "其他", code: "999999"});
                    }
                    this.regionList = regionList;
                    /*请求用户所在组织区域信息*/
                    this.request({
                        url: '/crm/myCollection/userRegionInfo.do'
                    }).then(data => {
                        setTimeout(() => {
                            if(!this.userRegionInfo.code){
                                if (!data || !data.code) {
                                    this.userRegionInfo = {
                                        code: ['999999'],
                                        name: ['其他']
                                    };
                                } else {
                                    this.userRegionInfo = data;
                                }
                                this.searchCriteria.region = this.userRegionInfo.code;
                                for (var i = 0; i < this.selectedConditionList.length; i++) {
                                    if (this.selectedConditionList[i].name == '区域') {
                                        this.selectedConditionList[i].val = this.userRegionInfo.name;
                                    }
                                }
                            }else{
                                let tempCode = this.userRegionInfo.code;
                                let tempName = this.getProvinceName(tempCode);
                                this.userRegionInfo.name = [tempName];
                                this.searchCriteria.region = [tempCode[0]];
                                this.handleChange(tempCode, [{
                                    code: tempCode[0],
                                    label: tempName,
                                    value: tempCode[0]
                                }]);
                            }
                        })
                    })
                })
            },
            /*请求下级区域列表数据*/
            loadInferior(item, callback) {
                item.loading = true;
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: item.value
                    }
                }).then(data => {
                    item.children = data;
                    item.loading = false;
                    callback();
                });
            },
            /*组合已选条件*/
            conditionalChange: function (val, name, arr) {
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].code == val) val = arr[i].name;
                    }
                }
                for (let i = 0; i < this.selectedConditionList.length; i++) {
                    if (this.selectedConditionList[i].name == name) this.selectedConditionList[i].val = val;
                }
            },
            /*选择时间控件处理*/
            conditionalChangeS(a, b) {
                this.$nextTick(() => {
                    a = eval("this." + a);
                    let str = '';
                    for (let i = 0; i < a.length; i++) {
                        str += window.DateFormat.dateToString(a[i]);
                        if (i == 0) str += '至';
                    }
                    if (str == '至') return;
                    this.conditionalChange(str, b);
                });
            },
            /*行业分类条件改变*/
            industryTypeChange(arr) {
                let industryTypeList = this.industryTypeList;
                let tempArr = [];
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < industryTypeList.length; j++) {
                        if (industryTypeList[j].code == arr[i]) tempArr.push(industryTypeList[j].name);
                    }
                }
                this.conditionalChange(tempArr.join(","), '行业分类')
            },
            /*删除选择已选条件*/
            delSelectedCondition: function (item) {
                item.val = '';
                if (item.name === '意向线索') {
                    this.searchCriteria[item.tag] = [];
                    this.serviceTypeList.forEach(function (obj) {
                        obj.select = false;
                    });
                    this.closeServiceTypeMenu();
                } else if (item.name === '行业分类') {
                    this.searchCriteria.industryType = [];
                } else {
                    this.searchCriteria[item.tag] = '';
                }
//                searchCriteria.industryType
            },
            /*删除所有已选条件*/
            delAllSelectedCondition: function (arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name != "区域") {
//                        alert(arr[i].name);
                        arr[i].val = '';
                    } else {
                        arr[i].val = this.userRegionInfo.name;
                    }
                }
                this.searchCriteria = {
                    serviceType: [],
                    industryType: [],
                    region: this.userRegionInfo.code
                };
                this.serviceTypeList.forEach(function (obj) {
                    obj.select = false;
                });
            },
            /*开始查询*/
            searchResult: function () {
                this.request({
                    url: '/crm/myCollection/searchResult.do',
                    data: {
                        searchCriteria: this.searchCriteria
                    }
                }).then(() => {
//                    console.log(data);
                })
            },
            /*新增*/
            add: function () {
                this.prompt({
                    code: 'addClues',
                    title: '添加线索',
                    width: 950,
                    height: 600,
                    top: 5,
                    props: {
                        addFlag: true,
                        tabName: 'enterpriseName'
                    },
                    callback: (searchNameData, refresh, close) => {
//                        console.log('新增回查线索');
//                        console.log(searchNameData);
                        if (searchNameData && searchNameData.name) {
                            this.searchName(searchNameData);
                        }
                        if (refresh === 'refresh') {
                            this.searchPageFirst();
                        } else {
                            close();
                        }
                    }
                })
            },
            searchName(data) {
                if (!data) {
                    return;
                }
                if (!data.provinceCode) {
                    data.provinceCode = '999999';
                }
                let provinceName = this.getProvinceName(data.provinceCode);
                let provinceCode = [data.provinceCode]
                this.userRegionInfo.code = provinceCode;
                this.delAllSelectedCondition(this.selectedConditionList);
                this.searchCriteria.region = provinceCode;
                this.searchCriteria.name = data.name;
                this.conditionalChange(data.name, '线索名称');
                this.handleChange(provinceCode, [{
                    code: data.provinceCode,
                    label: provinceName,
                    value: data.provinceCode
                }]);
                this.search();
            },
            searchPageFirst() {
                this.page = 1;
                this.search();
            },
            init(props) {
                if(props){
                    this.searchName(props.jumpSearchNameData);
                } else {
                    this.searchPageFirst();
                }
            },
            showEyePrompt() {
                this.prompt({
                    code: 'eyeSearchPrompt',
                    title: '使用地图查询附近的公司',
                    width: 1300,
                    height: 550,
                    top: 50,
                    props: {
                        searchObj: {
                            eye: this.searchCriteria,
//                            enterpriseStatusList: this.enterpriseStatusList,
                            registeredCapitalList: this.registeredCapitalList,
                        }
                    },
                    callback: (close) => {
                        close();
                    }
                })
            }
        },
        components: {
            baseinfoCompany,
            baseinfoPersonal,
            companies,
            personnel,
            opportunity,
            dealings,
            evaluation,
            clueUploadTemplate
        }
    };
</script>

<style scoped>
    .queryBar {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 300px;
        background: #fff;
        padding: 10px 18px 0;
        border-right: 1px solid #e7e9ef;
    }

    .queryBar .condition {
        margin-left: 10px;
        line-height: 28px;
        color: #999;
    }

    .queryBar .ivu-form-item {
        margin-bottom: 8px;
    }

    .queryBar.collapse {
        /*left: -300px;*/
        transform: translate3d(-300px, 0, 0);
    }

    .queryBar.collapse + .main {
        left: 0px;
    }

    .collapseBtn {
        /*position: fixed;*/
        position: absolute;
        /*top: 0;*/
        top: 50%;
        left: 0;
        z-index: 1;
        padding: 10px 7px;
        opacity: .7;
        margin-top: -22px;
        background: #fff;
    }

    .collapseBtn:hover {
        opacity: 1;
    }

    .collapse .collapseBtn {
        transform: translate3d(300px, 0, 0);
    }

    .collapse .collapseBtn >>> .ivu-icon {
        transform: rotate(180deg);
    }

    .queryBar,
    .main,
    .collapseBtn,
    .collapseBtn >>> .ivu-icon {
        transition: all .3s;
        transform: translateZ(0);
        /*backface-visibility: hidden;*/
        /*perspective: 1000;*/
    }

    .searchBar {
        position: relative;
    }

    .searchBar > .ivu-row {
        margin-right: 180px;
    }

    .eyePromptLink {
        position: absolute;
        top: 0;
        right: 20px;
        line-height: 30px;
        color: #666;
    }

    .eyePromptLink:hover {
        text-decoration: underline;
    }

    .eyePromptLink > .ivu-icon {
        color: #F0917E;
        vertical-align: middle;
        font-size: 20px;
        margin-right: 10px;
    }

    .main {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 300px;
        overflow: auto;
    }

    .clues {
        padding: 10px 25px;
    }

    .clueList {
        margin-top: 15px;
        background: #fff;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
    }

    .clueItem {
        border-top: 1px solid #F5F5F5;
    }

    .clueItem:first-child {
        border-top: none;
    }

    .itemPanel {
        padding: 20px;
    }

    .itemPanel:hover {
        background-color: #fff;
        box-shadow: 1px 1px 20px rgba(150, 150, 150, .2);
        cursor: pointer;
    }

    .itemPanel.active {
        background-color: #fff;
    }

    .avatar {
        width: 75px;
        height: 75px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .header {
        font-size: 0;
    }

    .header > div {
        display: inline-block;
        vertical-align: middle;
    }

    .name {
        font-size: 22px;
        font-weight: bold;
    }

    .name >>> .ivu-tooltip-rel {
        max-width: 20em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }

    .name >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

    .source,
    .opportunity,
    .contract {
        margin-left: 10px;
        color: #fff;
        /*line-height: 18px;*/
    }

    .opportunity,
    .contract {
        font-size: 0;
    }

    .source {
        background: #f4f7f9;
        color: #99acbd;
        padding: 0 6px;
    }

    .opportunity {
        background: #FF8D76;
    }

    .contract {
        background: #5ACDA2;
    }

    .opportunity > span:first-child {
        background: #FFECE8;
        color: #FF8D76;
    }

    .contract > span:first-child {
        background: #E0F6EE;
        color: #5ACDA2;
    }

    .source > span,
    .opportunity > span,
    .contract > span {
        font-size: 13px;
        font-weight: 700;
    }

    .opportunity > span,
    .contract > span {
        padding: 0 6px;
        display: inline-block;
        vertical-align: middle;
    }

    .info > div {
        margin-top: 6px;
    }

    .tags {
        margin-top: 8px;
        display: inline-block;
    }

    .buttonPanel > button {
        margin-top: 8px;
        min-width: 76px;
        padding: 4px 8px;
    }

    .buttonPanel > button:first-child {
        margin-top: 0;
    }

    .extendPanel {
        position: relative;
        width: 95%;
        margin: 0px auto;
        border-top: 1px solid #e7e9ef;
        border-bottom: 1px solid #e7e9ef;
        margin-bottom: 15px;
    }

    .extendTabs {
        background: #F6F8FA;
        font-size: 14px;
    }

    .extendTabs > span {
        display: inline-block;
        vertical-align: middle;
        margin: 0px 30px;
        line-height: 40px;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
    }

    .clueItem .ivu-col .name > span {
        line-height: 40px;
        font-weight: bold;
        font-size: 22px;
        text-align: center;
        cursor: pointer;
    }

    .clueItem .info .ivu-col > span {
        line-height: 26px;
        font-size: 14px;
        text-align: center;
    }

    .extendTabs > span.active {
        color: #59b399;
        border-bottom: 1px solid #59b399;
    }

    .closeExtend {
        position: absolute;
        top: 8px;
        right: 15px;
        font-size: 16px;
        cursor: pointer;
        color: #666;
    }

    .closeExtend:hover {
        color: #FF9379;
    }

    .cluePage {
        text-align: left;
        padding: 15px 30px;
        position: relative;
    }

    .clueHeader {
        background: #FFF;
        padding: 6px 20px;
        line-height: 30px;
    }

    .checkbox {
        margin-top: 25px;
    }

    .clueHeaderAction {
        text-align: right;
    }

    .sort {
        text-align: left;
        width: 140px;
    }

    .checkAll {
        color: #2A2A2A;
        text-decoration: underline;
    }

    .checkAll[disabled] {
        text-decoration: none;
    }

    .tagGrey {
        background-color: #f1f1f1 !important;
    }

    .nodata {
        padding: 45px 0 65px;
        text-align: center;
    }

    .nodataText {
        margin: 30px auto;
        font-size: 16px;
        color: #727375;
    }

    .clueAdd {
        padding: 8px 20px;
        font-size: 14px;
    }

    .clueAdd:hover {
        opacity: .9;
    }

    .ivu-badge >>> .badge-new {
        font-size: 12px;
        background: #FF6464;
        line-height: 1;
        padding: 1px;
        border: none;
        /*width: 32px;*/
        height: auto;
        border: none;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
    }

    .ivu-badge >>> .extendTabsBadge {
        background-color: #FF6464;
        border: none;
        -webkit-box-shadow: 0 0px 5px #e8b5b5;
        -moz-box-shadow: 0 0px 5px #e8b5b5;
        box-shadow: 0 0px 5px #e8b5b5;
        -webkit-transform: translateX(100%);
        -moz-transform: translateX(100%);
        -ms-transform: translateX(100%);
        -o-transform: translateX(100%);
        transform: translateX(100%);
    }

    .extendArrow {
        position: absolute;
        bottom: -2px;
        bottom: -18px;
        width: 100%;
        text-align: center;
        color: #B6B2B1;
        transition: all .3s;
    }

    .extendArrow.extendArrowReverse {
        transform: rotate(180deg);
    }

    .extendArrow:hover {
        color: #59b399;
    }
</style>

<style scoped>
    .searchBar .del-all {
        width: 80px;
        display: inline-block;
        color: #666;
        cursor: pointer;
    }

    /*自定义下拉菜单*/
    .service-type-menu {
        position: relative;
    }

    .service-type-menu .service-type-menu-list {
        width: 100%;
        position: absolute;
        left: 0;
        top: 34px;
        background: #fff;
        z-index: 10;
        border-radius: 6px;
        border: 1px solid #e7e9ef;
        max-height: 210px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .service-type-menu .item {
        padding: 0 0 0 10px;
        cursor: pointer;
    }

    .service-type-menu .item:hover {
        background: #f3f3f3;
    }

    .service-type-menu .item.active {
        color: rgba(45, 140, 240, .9);
    }

    .ivu-btn1 {
        color: #666;
        background: #fff;
        border-color: #ddd;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .ivu-btn2 {
        color: #59b399;
        background: #fff;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .ivu-btn-red {
        color: #fff;
        background: #ff8066;
        border-color: #ff8066;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .queryBar >>> .ivu-form-item-label {
        font-size: 14px;
        font-weight: 700;
    }

    .queryBar >>> .ivu-icon-arrow-down-b {
        position: absolute;
        top: 50%;
        right: 1px;
        line-height: 1;
        margin-top: 6px;
        font-size: 10px;
        color: #aaa;
        transition: all .5s ease-in-out;
    }

    .queryBar >>> .ivu-icon-arrow-up-b {
        position: absolute;
        top: 50%;
        right: 1px;
        line-height: 1;
        margin-top: 6px;
        font-size: 10px;
        color: #aaa;
        transition: all .5s ease-in-out;
    }

    .queryBar >>> .ivu-select-arrow {
        position: absolute;
        top: 50%;
        right: 10px;
        line-height: 1;
        margin-top: -5px;
        font-size: 10px;
        color: #aaa;
        transition: all .2s ease-in-out;
    }

    .queryBar >>> .ivu-cascader-arrow {
        position: absolute;
        top: 50%;
        right: 10px;
        line-height: 1;
        margin-top: -5px;
        font-size: 10px;
        color: #aaa;
        transition: all .2s ease-in-out;
    }

    .queryBar >>> .ivu-btn {
        font-size: 14px;
        line-height: 1.5;
    }

    .queryBar >>> .info > span {
        font-size: 14px;
        line-height: 1.5;
    }

    .ivu-tag-new {
        color: #59b399 !important;
        border: 1px solid #59b399 !important;
    }

    .industry-type-select >>> .ivu-select-selection {
        max-height: 68px;
        overflow: auto;
    }

    .industry-type-select >>> .ivu-tag-text {
        max-width: 100px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .industry-type-select >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
    }

    .ivu-tag-new >>> .ivu-tag-text {
        max-width: 200px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ivu-tag-new:after {
        background: #59b399 !important;
    }

    .ivu-tag-new >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
        color: #59b399 !important;
    }

    .region-cascader >>> .ivu-input {
        padding-right: 24px;
        cursor: pointer;
    }

    .service-type-menu-input-content {
        display: block;
        width: 154px;
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .clue-name{
        position: relative;
    }

    .clue-name >>> .ivu-btn{
        position: absolute;
        right: 2px;
        top: 6px;
        padding: 3px 4px;
        font-size: 10px;
        font-weight: 100;
        line-height: 1.1;
    }

    .clue-name .ivu-btn1{
        color: #ff8066;
        border-color: #ff8066;
    }

    .clue-name >>> .ivu-input{
        padding: 4px 32px 4px 7px;
    }
</style>