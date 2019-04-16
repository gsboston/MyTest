<template>
  <div>
    <!--搜索条件-->
    <div class="queryBar" :class="{'collapse': isCollapse}">
      <div class="condition">搜索条件</div>
      <Form ref="searchCriteria" :model="searchCriteria" :label-width="80" inline>
        <FormItem label="区域" prop="region" style="width: 100%;">
          <!--<Select v-model="searchCriteria.region" filterable @on-change="conditionalChange(searchCriteria.region, '区域', regionList)">-->
          <!--<Option v-for="item in regionList" :value="item.code" :key="item.code">{{ item.name }}</Option>-->
          <!--</Select>-->
          <Cascader
            class="region-cascader"
            :clearable="false"
            :data="regionList"
            :load-data="loadInferior"
            change-on-select
            @on-change="handleChange"
            v-model="searchCriteria.region"
          ></Cascader>
        </FormItem>
        <FormItem label="线索名称" prop="name" style="width: 100%;">
          <Input
            v-model="searchCriteria.name"
            @on-blur="conditionalChange(searchCriteria.name, '线索名称')"
            :maxlength="200"
          ></Input>
        </FormItem>
        <FormItem label="意向线索" prop="serviceType" style="width: 100%;">
          <!--自定义下拉菜单-->
          <div class="service-type-menu" @mouseleave="closeServiceTypeMenu">
            <Tag
              type="border"
              style="width: 100%; height: 32px; padding-top: 3px;"
              @click.native="showServiceTypeMenu"
            >
              <Row>
                <i-col span="23">
                  <span
                    style="color:#bcbcbc"
                    v-if="searchCriteria.serviceType.length == 0"
                  >点击下拉菜单选择意向线索</span>
                  <div v-else>
                    <span
                      class="service-type-menu-input-content"
                      :title="item.val"
                      v-for="(item, index) in selectedConditionList"
                      :key="index"
                      v-if="item.name === '意向线索'"
                    >{{item.val}}</span>
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
              <div
                v-for="item in serviceTypeList"
                :key="item.id"
                @click="selectServiceTypes(searchCriteria.serviceType,item)"
              >
                <Row class="item" :class="{'active': item.select}">
                  <i-col span="20">
                    <Row>
                      <i-col span="22">{{item.name}}</i-col>
                      <i-col span="2">
                        <Icon v-show="item.select" type="checkmark"></Icon>
                      </i-col>
                    </Row>
                  </i-col>
                  <i-col span="4" v-if="item.edit" style="width: 24px; margin-right: 3px;">
                    <Button
                      type="dashed"
                      size="small"
                      @click.stop="delServiceType(serviceTypeList, item)"
                    >
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
                    <i-col span="4" style="width: 24px; margin-left: 5px;">
                      <Button type="dashed" size="small" @click="cancelStatus">
                        <Icon type="close"></Icon>
                      </Button>
                    </i-col>
                  </Row>
                  <Button
                    icon="ios-plus-empty"
                    type="dashed"
                    size="small"
                    @click="addStatus"
                    v-else
                  >添加其他</Button>
                </i-col>
              </Row>
            </div>
          </div>
        </FormItem>
        <FormItem label="收藏时间" prop="collectionTime" style="width: 100%;">
          <DatePicker
            type="daterange"
            :options="options2"
            placement="bottom-start"
            placeholder="选择日期"
            style="width:100%"
            v-model="searchCriteria.collectionTime"
            @on-change="conditionalChangeS('searchCriteria.collectionTime', '收藏时间')"
            @on-clear="conditionalChange('', '收藏时间')"
            :format="'yyyy-MM-dd'"
          ></DatePicker>
        </FormItem>
        <FormItem label="拜访执行" prop="visitExecution" style="width: 100%;">
          <DatePicker
            type="daterange"
            :options="options2"
            placement="bottom-start"
            placeholder="选择日期"
            style="width:100%"
            v-model="searchCriteria.visitExecution"
            @on-change="conditionalChangeS('searchCriteria.visitExecution', '拜访执行')"
            @on-clear="conditionalChange('', '拜访执行')"
            :format="'yyyy-MM-dd'"
          ></DatePicker>
        </FormItem>
        <FormItem label="下次拜访" prop="nextVisit" style="width: 100%;">
          <DatePicker
            type="daterange"
            :options="options2"
            placement="bottom-start"
            placeholder="选择日期"
            style="width:100%"
            v-model="searchCriteria.nextVisit"
            @on-change="conditionalChangeS('searchCriteria.nextVisit', '下次拜访')"
            @on-clear="conditionalChange('', '下次拜访')"
            :format="'yyyy-MM-dd'"
          ></DatePicker>
        </FormItem>
        <FormItem label="意向度" prop="intentionality" style="width: 100%;">
          <Select
            v-model="searchCriteria.intentionality"
            filterable
            @on-change="conditionalChange(searchCriteria.intentionality, '意向度', intentionalityList)"
          >
            <Option
              v-for="item in intentionalityList"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="地址" prop="address" style="width: 100%;">
          <Input
            v-model="searchCriteria.address"
            @on-blur="conditionalChange(searchCriteria.address, '地址')"
            :maxlength="200"
          ></Input>
        </FormItem>
        <FormItem style="width: 100%;">
          <Button
            type="primary"
            @click="searchPageFirst"
            style="width: 200px; margin-left: -17px;"
          >查一下</Button>
        </FormItem>
      </Form>
      <Button type="ghost" icon="chevron-left" size="small" @click="collapse" class="collapseBtn"></Button>
    </div>
    <div class="main">
      <div class="clues">
        <!--已选条件-->
        <div class="searchBar">
          <Row style="line-height: 30px;">
            <i-col span="3" style="color: #999; width: 70px;">已选条件：</i-col>
            <i-col span="21">
              <Tag
                :title="item.name + ':' + item.val"
                class="ivu-tag-new"
                type="border"
                :closable="item.name !== '区域'"
                color="blue"
                v-for="(item, index) in selectedConditionList"
                :key="index"
                @on-close="delSelectedCondition(item)"
                v-show="item.val"
              >{{item.name + ':' + item.val}}</Tag>
              <div class="del-all" @click="delAllSelectedCondition(selectedConditionList)">重置条件</div>
            </i-col>
          </Row>
        </div>
        <!--<div class="clueList">-->
        <!--<Button @click="add">新增</Button>-->
        <!--</div>-->
        <div class="clueList">
          <div class="clueHeader">
            <Row type="flex" align="middle">
              <template v-if="clues.length">
                <i-col span="1">
                  <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll"
                  ></Checkbox>
                </i-col>
                <i-col span="2">
                  <a
                    href="javascript:void(0);"
                    class="checkAll"
                    :disabled="!checkAllGroup.length"
                    @click="collectionAll"
                  >取消收藏</a>
                </i-col>
              </template>
              <i-col span="9" offset="1">
                找到 {{this.total}} 个相关结果
                <template v-if="searchTime < 3">，用时 {{this.searchTime}} 秒</template>
              </i-col>
              <i-col span="10" offset="1" class="clueHeaderAction" v-if="clues.length">
                <clueUploadTemplate></clueUploadTemplate>
                <Button href="javascript:void(0);" icon="plus" @click="add">添加</Button>
                <Select v-model="sortModel" class="sort" placeholder="默认排序" @on-change="sortChange">
                  <Option
                    v-for="item in sortList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </i-col>
            </Row>
          </div>
          <div class="nodata" v-if="!clues.length">
            <img src="../clueManagement/images/nodata.png" alt>
            <div class="nodataText">你搜的关键字，找不到啊！</div>
            <Button class="clueAdd" type="primary" @click="add">我要添加</Button>
          </div>
          <div class="clueItem" v-for="(clue, index) in clues" :key="index">
            <Row class="itemPanel" :class="{'active': clue.isExtend}" @click.native="extend(clue)">
              <i-col span="1" class="checkbox">
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                  <Checkbox :label="clue.basic.hxId" @on-change="checkboxChange" @click.stop.native>
                    <span></span>
                  </Checkbox>
                </CheckboxGroup>
              </i-col>
              <i-col span="2">
                <Badge class-name="badge-new" :count="!clue.track ? 'NEW' : ''">
                  <template v-if="clue.isEnterprise">
                    <img class="avatar" :src="clue.company.logo" v-if="clue.company.logo">
                    <img class="avatar" src="../clueManagement/images/company.png" v-else>
                  </template>
                  <template v-else>
                    <img class="avatar" :src="clue.personal.logo" v-if="clue.personal.logo">
                    <img class="avatar" src="../clueManagement/images/person.png" v-else>
                  </template>
                </Badge>
              </i-col>
              <i-col span="17" offset="1">
                <Row class="header">
                  <i-col class="name">
                    <template v-if="clue.isEnterprise">
                      <Tooltip placement="bottom" v-if="clue.company.name.length > 20">
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
                  <!--<span>{{clue.basic.totalOpportunity || 0}}</span>-->
                  <!--</i-col>-->
                  <!--</template>-->
                  <template v-if="clue.basic.totalContract && clue.basic.totalContract !== 0">
                    <i-col class="contract">
                      <span>合同</span>
                      <span>{{clue.basic.totalContract || 0}}</span>
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
                      <span v-if="clue.personal.mobile">电话：
                        <Tooltip
                          :content="clue.personal.mobile"
                          @click.native.stop
                        >{{clue.personal.mobile.substr(0, 3) + '****' + clue.personal.mobile.substr(7)}}</Tooltip>
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
                          <Tooltip
                            :content="clue.company.companyContactsMobile"
                            @click.native.stop
                          >{{clue.company.companyContactsMobile.substr(0, 3) + '****' + clue.company.companyContactsMobile.substr(7)}}</Tooltip>
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
                  <Tag
                    v-for="tag in clue.tags"
                    :key="tag.tagId"
                    :name="tag.tagId"
                    v-if="tag.type === 1 || tag.type === 4"
                    type="border"
                    :closable="tag.isCreateYouself && tag.type === 1"
                    :class="{tagGrey : !tag.isCreateYouself || tag.type !== 1}"
                    @on-close="tagClose(clue.basic.hxId, tag.tagId, clue.tags)"
                  >{{tag.name}}</Tag>
                  <Button
                    class="ivu-btn2"
                    icon="ios-plus-empty"
                    type="dashed"
                    size="small"
                    @click.stop="tagAdd(clue)"
                  >给他贴标签</Button>
                </div>
                <div class="extendArrow" :class="{extendArrowReverse: clue.isExtend}">
                  <Icon type="chevron-down"></Icon>
                </div>
              </i-col>
              <i-col span="2" offset="1" class="buttonPanel">
                <Button
                  class="ivu-btn-red"
                  @click.stop="collection(clue)"
                  v-if="!clue.isCollected"
                >收藏</Button>
                <Button class="ivu-btn-red" @click.stop="collection(clue)" v-else>已收藏</Button>
                <br>
                <Button @click.stop="opportunityAdd(clue)">新增商机</Button>
                <br>
                <Button
                  class="ivu-btn1"
                  @click.stop="eyeSearch(clue.company.name, clue.isEnterprise)"
                  v-if="clue.isEnterprise"
                >天眼查询</Button>
                <Button
                  class="ivu-btn1"
                  @click.stop="eyeSearch(clue.personal.name, clue.isEnterprise)"
                  v-else
                >天眼查询</Button>
                <br>
                <Button
                  class="ivu-btn1"
                  @click.stop="edit(clue)"
                  v-if="clue.basic.isCreateYouself"
                >修改</Button>
                <template v-else>
                  <Button class="ivu-btn1" @click.stop="errorRecovery(clue)" v-if="!clue.isError">纠错</Button>
                  <Button disabled v-else>已纠错</Button>
                </template>
              </i-col>
            </Row>
            <div class="extendPanel" v-if="clue.isExtend">
              <span @click="closeExtend(clue)" class="closeExtend">
                <Icon type="close"></Icon>
              </span>
              <div class="extendTabs" v-if="clue.isEnterprise">
                <span @click="clue.selectedTab = 0" :class="{'active': clue.selectedTab === 0}">基本信息</span>
                <span @click="clue.selectedTab = 1" :class="{'active': clue.selectedTab === 1}">主要人员</span>
                <span @click="clue.selectedTab = 2" :class="{'active': clue.selectedTab === 2}">
                  <!--<Badge class-name="extendTabsBadge" :count="clue.basic.totalOpportunity">-->
                  商机
                  <!--</Badge>-->
                </span>
                <span @click="clue.selectedTab = 3" :class="{'active': clue.selectedTab === 3}">业务往来</span>
                <span @click="clue.selectedTab = 4" :class="{'active': clue.selectedTab === 4}">信息评价</span>
              </div>
              <div class="extendTabs" v-else>
                <span @click="clue.selectedTab = 0" :class="{'active': clue.selectedTab === 0}">基本信息</span>
                <span @click="clue.selectedTab = 1" :class="{'active': clue.selectedTab === 1}">他的企业</span>
                <span @click="clue.selectedTab = 2" :class="{'active': clue.selectedTab === 2}">
                  <!--<Badge class-name="extendTabsBadge" :count="clue.basic.totalOpportunity">-->
                  商机
                  <!--</Badge>-->
                </span>
                <span @click="clue.selectedTab = 3" :class="{'active': clue.selectedTab === 3}">业务往来</span>
                <span @click="clue.selectedTab = 4" :class="{'active': clue.selectedTab === 4}">信息评价</span>
              </div>
              <div class v-if="clue.isEnterprise">
                <baseinfoCompany v-if="clue.selectedTab === 0" :id="1" :company="clue.company"></baseinfoCompany>
                <personnel
                  v-else-if="clue.selectedTab === 1"
                  :clue="clue"
                  :companyId="clue.company.id"
                ></personnel>
                <opportunity
                  v-else-if="clue.selectedTab === 2"
                  @opportunityNumInit="opportunityNumInit"
                  @resetPrompadd="resetPrompadd"
                  @toSignContract="toSignContract"
                  :id="clue.basic.hxId"
                  :clue="clue"
                  :prompadd="clue.prompadd"
                  :fromCollection="true"
                  ref="opportunity"
                ></opportunity>
                <dealings v-else-if="clue.selectedTab === 3" :id="clue.basic.hxId"></dealings>
                <evaluation v-else-if="clue.selectedTab === 4" :id="clue.basic.hxId"></evaluation>
              </div>
              <div v-else>
                <baseinfoPersonal
                  v-if="clue.selectedTab === 0"
                  :personal="clue.personal"
                  :tags="clue.tags"
                ></baseinfoPersonal>
                <companies
                  v-else-if="clue.selectedTab === 1"
                  :clue="clue"
                  :personalId="clue.personal.id"
                ></companies>
                <opportunity
                  v-else-if="clue.selectedTab === 2"
                  @opportunityNumInit="opportunityNumInit"
                  @resetPrompadd="resetPrompadd"
                  @toSignContract="toSignContract"
                  :id="clue.basic.hxId"
                  :clue="clue"
                  :prompadd="clue.prompadd"
                  :fromCollection="true"
                  ref="opportunity"
                ></opportunity>
                <dealings v-else-if="clue.selectedTab === 3" :id="clue.basic.hxId"></dealings>
                <evaluation v-else-if="clue.selectedTab === 4" :id="clue.basic.hxId"></evaluation>
              </div>
            </div>
          </div>
          <Page
            class="cluePage"
            size="small"
            :total="total"
            :current="page"
            :page-size="pageSize"
            :page-size-opts="pageSizeOpts"
            placement="bottom"
            v-if="clues.length"
            @on-change="cluePageChange"
            @on-page-size-change="pageSizeChange"
            show-total
            show-elevator
            show-sizer
          ></Page>
        </div>
      </div>
      <Modal
        title="我要贴标签"
        v-model="tagAddModal"
        :closable="false"
        :mask-closable="false"
        :styles="{top: '20px'}"
      >
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
import baseinfoCompany from "../clueManagement/baseinfoCompany.vue"; // 基本信息-公司
import baseinfoPersonal from "../clueManagement/baseinfoPersonal.vue"; // 基本信息-个人
import companies from "../clueManagement/companies.vue"; // 他的企业
import personnel from "../clueManagement/personnel.vue"; // 主要人员
import opportunity from "../clueManagement/opportunity.vue"; // 商机
import dealings from "../clueManagement/dealings.vue"; // 业务往来
import evaluation from "../clueManagement/evaluation.vue"; // 信息评价
import clueUploadTemplate from "../clueManagement/clueUploadTemplate.vue"; // 下载 excel 模版

export default {
  data: function() {
    return {
      userRegionInfo: {},
      searchCriteria: {
        serviceType: [],
        region: []
      }, //查询时提交到node层的对象
      serviceTypeList: [], //意向线索列表数据
      inputServiceType: "", //输入意向线索
      addServiceTypeStatus: false, //添加意向线索状态
      isShowServiceTypeMenu: false, //显示意向线索下拉菜单
      intentionalityList: [], //意向度列表数据
      regionList: [],
      options2: {
        shortcuts: [
          {
            text: "最近一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "最近一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "最近三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
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
          name: "收藏时间",
          val: "",
          tag: "collectionTime"
        },
        {
          name: "拜访执行",
          val: "",
          tag: "visitExecution"
        },
        {
          name: "下次拜访",
          val: "",
          tag: "nextVisit"
        },
        {
          name: "意向度",
          val: "",
          tag: "intentionality"
        },
        {
          name: "地址",
          val: "",
          tag: "address"
        }
      ], //已选择查询条件数据

      clues: [],
      page: 1,
      total: 0,
      pageSize: 10,
      pageSizeOpts: [10, 50, 100],
      searchTime: 0, // 查询线索花费时间
      sortList: [
        {
          //                        value: 'intentionality_desc',
          //                        label: '意向度降序'
          //                    }, {
          //                        value: 'intentionality',
          //                        label: '意向度升序'
          //                    }, {
          //                        value: 'maxCollectionTime_desc',
          value: "collectionTime_desc",
          label: "收藏时间降序"
        },
        {
          //                        value: 'maxCollectionTime',
          value: "collectionTime",
          label: "收藏时间升序"
        },
        {
          value: "maxTrackTime_desc",
          label: "拜访时间降序"
        },
        {
          value: "maxTrackTime",
          label: "拜访时间升序"
        },
        {
          value: "maxNextTrackTime_desc",
          label: "下次拜访时间降序"
        },
        {
          value: "maxNextTrackTime",
          label: "下次拜访时间升序"
        }
      ],
      sortModel: "",
      isAnonymous: false, // 贴标签匿名
      checkAll: false, // 是否全选
      checkAllGroup: [], // 已选的线索 id 集合
      IdAllGroup: [], // 所有能选择的线索 id 集合
      indeterminate: false, // 部分选择
      tagAddValue: "",
      tagAddClue: null,
      tagAddModal: false,
      isCollapse: false, // queryBar 默认展开
      imageService: "?x-oss-process=image/resize,w_100,h_100/quality,Q_80" // 图片处理
    };
  },
  created: function() {
    //            this.searchResult();
    this.getServiceTypeList(); //请求意向线索列表数据
    this.getIntentionalityList(); //请求意向度列表数据

    this.getRegionList(); //请求区域列表数据
  },
  methods: {
    handleChange: function(value, selectedData) {
      let tempArr = [];
      for (let i = 0; i < selectedData.length; i++) {
        tempArr.push(selectedData[i].label);
      }
      for (let i = 0; i < this.selectedConditionList.length; i++) {
        if (this.selectedConditionList[i].name == "区域") {
          this.selectedConditionList[i].val = tempArr;
        }
      }
    },
    /*请求意向线索列表数据*/
    getServiceTypeList: function() {
      this.request({
        url: "/crm/myCollection/serviceTypeList.do"
      }).then(serviceTypeList => {
        this.serviceTypeList = serviceTypeList || [];
      });
    },
    /*显示意向线索下拉菜单*/
    showServiceTypeMenu: function() {
      this.isShowServiceTypeMenu = true;
    },
    /*关闭意向线索下拉菜单*/
    closeServiceTypeMenu: function() {
      this.isShowServiceTypeMenu = false;
    },
    /*添加其他意向线索*/
    addStatus: function() {
      this.inputServiceType = "";
      this.addServiceTypeStatus = true;
    },
    /*取消添加其他意向线索*/
    cancelStatus: function() {
      this.inputServiceType = "";
      this.addServiceTypeStatus = false;
    },
    /*保存添加其他意向线索*/
    saveServiceType: function(inputServiceType) {
      if (!inputServiceType.trim()) {
        this.$Message.warning("不能为空");
        return;
      }
      let tempSign = true;
      for (let i = 0; i < this.serviceTypeList.length; i++) {
        if (this.serviceTypeList[i].name == this.inputServiceType.trim())
          tempSign = false;
      }
      if (!tempSign) {
        this.$Message.warning("不能重复!");
        return;
      }
      this.request({
        url: "/crm/myCollection/saveServiceType.do",
        param: {
          name: inputServiceType.trim()
        }
      }).then(item => {
        this.serviceTypeList.push(item);
        this.addServiceTypeStatus = false;
        this.selectServiceTypes(this.searchCriteria.serviceType, item);
      });
    },
    /*删除添加其他意向线索*/
    delServiceType: function(arr, item) {
      this.request({
        url: "/crm/myCollection/delServiceType.do",
        param: {
          id: item.id
        }
      }).then(() => {
        if (item.select)
          this.selectServiceTypes(this.searchCriteria.serviceType, item);
        arr.forEach(function(obj, index) {
          if (obj.id === item.id) {
            arr.splice(index, 1);
          }
        });
      });
    },
    /*选择意向线索*/
    selectServiceTypes: function(arr, item) {
      item.select = !item.select;
      if (item.select) {
        arr.push(item);
      } else {
        arr.forEach(function(i, index) {
          if (i.id === item.id) {
            arr.splice(index, 1);
          }
        });
      }
      let tempArr = arr.map(item => {
        return item.name;
      });
      this.conditionalChange(tempArr.join(","), "意向线索");
    },
    /*请求意向度列表数据*/
    getIntentionalityList: function() {
      this.request({
        url: "/crm/myCollection/intentionalityList.do"
      }).then(intentionalityList => {
        this.intentionalityList = intentionalityList;
      });
    },
    /*请求区域列表数据*/
    getRegionList: function() {
      this.request({
        url: "/crm/myCollection/regionList.do"
      }).then(regionList => {
        if (regionList && regionList.length > 0) {
          //                        regionList.splice(0,1);
          regionList.push({ value: "999999", label: "其他", code: "999999" });
        }
        this.regionList = regionList;
        /*选择全国*/
        setTimeout(() => {
          this.userRegionInfo = {
            code: ["100000"],
            name: ["全国"]
          };
          this.searchCriteria.region = this.userRegionInfo.code;
          for (var i = 0; i < this.selectedConditionList.length; i++) {
            if (this.selectedConditionList[i].name == "区域") {
              this.selectedConditionList[i].val = this.userRegionInfo.name;
            }
          }
          this.searchResult();
        });
        /*请求用户所在组织区域信息*/
        //                    this.request({
        //                        url: '/crm/myCollection/userRegionInfo.do'
        //                    }).then(data => {
        //                        setTimeout(() => {
        //                            if (!data || !data.code) {
        //                                this.userRegionInfo = {
        //                                    code: ['999999'],
        //                                    name: ['其他']
        //                                };
        //                            } else {
        //                                this.userRegionInfo = data;
        //                            }
        //                            this.searchCriteria.region = this.userRegionInfo.code;
        //                            for (var i = 0; i < this.selectedConditionList.length; i++) {
        //                                if (this.selectedConditionList[i].name == '区域') {
        //                                    this.selectedConditionList[i].val = this.userRegionInfo.name;
        //                                }
        //                            }
        //                            this.searchResult();
        //                        })
        //                    })
      });
    },
    /*请求下级区域列表数据*/
    loadInferior(item, callback) {
      item.loading = true;
      this.request({
        url: "/crm/myCollection/loadInferior.do",
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
    conditionalChange: function(val, name, arr) {
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].code == val) val = arr[i].name;
        }
      }
      for (let i = 0; i < this.selectedConditionList.length; i++) {
        if (this.selectedConditionList[i].name == name)
          this.selectedConditionList[i].val = val;
      }
    },
    /*选择时间控件处理*/
    conditionalChangeS(a, b) {
      this.$nextTick(() => {
        a = eval("this." + a);
        let str = "";
        for (let i = 0; i < a.length; i++) {
          str += window.DateFormat.dateToString(a[i]);
          if (i == 0) str += "至";
        }
        if (str == "至") return;
        this.conditionalChange(str, b);
      });
    },
    /*删除选择已选条件*/
    delSelectedCondition: function(item) {
      item.val = "";
      if (item.name === "意向线索") {
        this.searchCriteria[item.tag] = [];
        this.serviceTypeList.forEach(function(obj) {
          obj.select = false;
        });
        this.closeServiceTypeMenu();
      } else {
        this.searchCriteria[item.tag] = "";
      }
    },
    /*删除所有已选条件*/
    delAllSelectedCondition: function(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name != "区域") {
          //                        alert(arr[i].name);
          arr[i].val = "";
        } else {
          arr[i].val = this.userRegionInfo.name;
        }
      }
      this.searchCriteria = {
        serviceType: [],
        region: this.userRegionInfo.code
      };
      this.serviceTypeList.forEach(function(obj) {
        obj.select = false;
      });
    },
    /*开始查询*/
    searchResult: function() {
      let searchStart = Date.now(),
        searchEnd = 0;

      this.request({
        url: "/crm/myCollection/searchResult.do",
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

        this.clues.forEach(item => {
          if (item.isEnterprise) {
            item.company.logo = item.company.logo
              ? this.$updateConfig.file + item.company.logo + this.imageService
              : item.company.logo;
          } else {
            item.personal.logo = item.personal.logo
              ? this.$updateConfig.file + item.personal.logo + this.imageService
              : item.personal.logo;
          }
          this.IdAllGroup.push(item.basic.hxId);
        });
      });
    },
    /*新增*/
    add: function() {
      this.prompt({
        code: "addClues",
        title: "添加线索",
        width: 950,
        height: 600,
        top: 5,
        props: {
          addFlag: true,
          tabName: "enterpriseName",
          addType: "collection"
        },
        callback: (searchNameData, refresh, close) => {
          //                        console.log('新增回查线索');
          //                        console.log(searchNameData);
          if (searchNameData && searchNameData.name) {
            this.searchName(searchNameData);
          }
          if (refresh === "refresh") {
            this.searchPageFirst();
          } else {
            close();
          }
        }
      });
    },
    searchName(data) {
      this.$api.jump("F0201", {
        jumpSearchNameData: data
      });
    },

    extend: function(clue) {
      //                console.log('extend');
      clue.isExtend = !clue.isExtend;
      clue.selectedTab = 0;
    },
    collection: function(clue) {
      //                console.log('collection');
      //                console.log(clue);
      this.request({
        url: "/crm/clueManagement/clueCollect.do",
        param: {
          id: clue.basic.hxId
        }
      }).then(() => {
        clue.isCollected = !clue.isCollected;

        if (clue.isCollected) {
          this.$Message.success("收藏成功");
        } else {
          this.$Message.success("取消收藏成功");
        }
      });
    },
    collectionAll: function() {
      //                console.log('collectionAll');
      this.request({
        url: "/crm/clueManagement/clueCollectAllCancel.do",
        param: {
          ids: this.checkAllGroup
        }
      }).then(() => {
        this.clues.forEach(clue => {
          this.checkAllGroup.forEach(item => {
            if (clue.basic.hxId === item) {
              clue.isCollected = false;
            }
          });
        });
        this.$Message.success("全部取消收藏成功");
      });
    },
    eyeSearch: function(key, isEnterprise) {
      key = key || "";
      if (isEnterprise) {
        window.open("https://www.tianyancha.com/search?key=" + key);
      } else {
        window.open(
          "https://www.tianyancha.com/humansearch/" + key + "?searchfrom=human"
        );
      }
    },
    errorRecovery: function(clue) {
      //                console.log('errorRecovery');
      //                console.log(clue);

      this.prompt({
        code: "errorRecovery",
        title: "纠错",
        width: 600,
        height: 240,
        props: {
          id: clue.basic.hxId
        },
        callback: (status, close) => {
          if (status === "success") {
            clue.isError = true;
          }
          close();
        }
      });
    },
    changeTab: function(clue) {
      //                console.log('changeTab');
      //                console.log(clue);
      clue.selectedTab = 3;
    },
    closeExtend: function(clue) {
      clue.isExtend = false;
      clue.selectedTab = 0;
    },
    tagAdd(clue) {
      this.tagAddModal = true;
      this.tagAddClue = clue;
    },
    tagAddCancel: function() {
      this.tagAddModal = false;
      this.tagAddValue = "";
      this.isAnonymous = false;
      this.tagAddClue = null;
    },
    tagAddOk: function() {
      //                if (!this.tagAddValue.trim()) {
      //                    this.$Message.warning('请填写标签名称');
      //                    return;
      //                }

      var value = this.tagAddValue;

      if (!value || !value.trim()) {
        this.$Message.warning("请填写标签名称");
        return;
      } else if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        //只含有汉字、数字、字母、下划线不能以下划线开头和结尾
        this.$Message.warning("请填写字母数字汉字");
        return;
      }

      this.request({
        url: "/crm/clueManagement/tagsAdd.do",
        data: {
          id: this.tagAddClue.basic.hxId,
          tagAddValue: this.tagAddValue,
          isAnonymous: this.isAnonymous
        }
      }).then(data => {
        this.tagAddClue.tags = data;

        this.tagAddModal = false;
        this.tagAddValue = "";
        this.isAnonymous = false;
        this.tagAddClue = null;
      });
    },
    tagClose(clueId, tagId, tags) {
      this.request({
        url: "/crm/clueManagement/tagsDel.do",
        param: {
          clueId,
          tagId
        }
      }).then(() => {
        tags.forEach(function(item, index) {
          if (item.tagId === tagId) {
            tags.splice(index, 1);
          }
        });
        this.$Message.success({
          content: "删除成功！",
          duration: 2.5
        });
      });
    },
    cluePageChange: function(page) {
      this.page = page;
      this.searchResult();
    },
    pageSizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.searchResult();
    },
    searchSpendTime: function(searchStart, searchEnd) {
      this.searchTime = (searchEnd - searchStart) / 1000;
    },
    opportunityNumInit: function(clue, num, operation) {
      if (operation === "plus") {
        clue.basic.totalOpportunity = num;
      } else if (operation === "minus") {
        clue.basic.totalOpportunity = clue.basic.totalOpportunity - num;
      }
    },
    checkboxChange: function() {
      //                console.log('checkboxChange')
    },
    checkAllGroupChange: function(arr) {
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
    handleCheckAll: function() {
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
    resetCheck: function() {
      this.checkAllGroup.splice(0);
      this.IdAllGroup.splice(0);
      this.checkAll = false;
      this.indeterminate = false;
    },
    sortChange: function(selected) {
      //                console.log('sortChange')
      //                console.log(selected)
      let isDesc = false;
      if (selected.indexOf("desc") > -1) {
        isDesc = true;
      }

      //                    basic.maxNextTrackTime
      //                    basic.maxTrackTime
      //                    basic.maxCollectionTime
      this.clues.sort(function(a, b) {
        if (isDesc) {
          let index = selected.split("_desc")[0];
          if (index === "collectionTime") {
            return a[index] < b[index];
          } else {
            return a.basic[index] < b.basic[index];
          }
        } else {
          if (selected === "collectionTime") {
            return a[selected] > b[selected];
          } else {
            return a.basic[selected] > b.basic[selected];
          }
        }
      });
      this.checkAllGroup.splice(0);
      this.checkAll = false;
      this.indeterminate = false;
    },
    opportunityAdd: function(clue) {
      clue.isExtend = true;

      if (clue.isEnterprise) {
        if (clue.selectedTab === 2) {
          this.$refs.opportunity[0].add();
        } else {
          clue.prompadd = true;
          clue.selectedTab = 2;
        }
      } else {
        if (clue.selectedTab === 2) {
          this.$refs.opportunity[0].add();
        } else {
          clue.prompadd = true;
          clue.selectedTab = 2;
        }
      }
    },
    resetPrompadd: function(clue) {
      clue.prompadd = null;
    },
    edit(clue) {
      this.prompt({
        code: "addClues",
        title: "修改线索",
        width: 950,
        height: 600,
        top: 5,
        props: {
          addFlag: false,
          clueId: clue.basic.hxId,
          tabName: clue.isEnterprise ? "enterpriseName" : "personalName"
        },
        callback: (searchNameData, refresh, close) => {
          if (refresh === "refresh") {
            this.searchPageFirst();
          } else {
            close();
          }
        }
      });
    },
    searchPageFirst() {
      this.page = 1;
      this.searchResult();
    },
    init() {
      this.searchPageFirst();
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    toSignContract(businessCode, oppoData) {
      console.log("toSignContract-myCollection");
      //                console.log(businessCode);
      //                console.log(oppoData);
      if (businessCode && oppoData) {
        this.$api.addContract(businessCode, oppoData);
      }
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
  opacity: 0.7;
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
  transition: all 0.3s;
  transform: translateZ(0);
}

.main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 300px;
  overflow: auto;
}

.searchBar {
}

.clues {
  padding: 10px 25px;
}

.clueList {
  margin-top: 15px;
  background: #fff;
  box-shadow: 1px 1px 10px rgba(150, 150, 150, 0.2);
}

.clueItem {
  border-top: 1px solid #f5f5f5;
}

.clueItem:first-child {
  border-top: none;
}

.itemPanel {
  padding: 20px;
}

.itemPanel:hover {
  background-color: #fff;
  box-shadow: 1px 1px 10px rgba(150, 150, 150, 0.2);
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
  background: #ff8d76;
}

.contract {
  background: #5acda2;
}

.opportunity > span:first-child {
  background: #ffece8;
  color: #ff8d76;
}

.contract > span:first-child {
  background: #e0f6ee;
  color: #5acda2;
}

.source > span,
.opportunity > span,
.contract > span {
  font-size: 12px;
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
  border-top: 1px solid #ebebec;
  border-bottom: 1px solid #ebebec;
  margin-bottom: 10px;
}

.extendTabs {
  background: #f6f8fa;
  font-size: 14px;
}

.container .main .extendPanel th {
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #fff;
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
  color: #ff9379;
}

.cluePage {
  text-align: left;
  padding: 15px 30px;
  position: relative;
}

.clueHeader {
  background: #fff;
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
  color: #2a2a2a;
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
  opacity: 0.9;
}

.ivu-badge >>> .badge-new {
  font-size: 12px;
  background: #ff6464;
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
  background-color: #ff6464;
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
  color: #b6b2b1;
  transition: all 0.3s;
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
  width: 60px;
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
  border: 1px solid #bbbbbb;
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
  color: rgba(45, 140, 240, 0.9);
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
  transition: all 0.5s ease-in-out;
}

.queryBar >>> .ivu-icon-arrow-up-b {
  position: absolute;
  top: 50%;
  right: 1px;
  line-height: 1;
  margin-top: 6px;
  font-size: 10px;
  color: #aaa;
  transition: all 0.5s ease-in-out;
}

.queryBar >>> .ivu-select-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  line-height: 1;
  margin-top: -5px;
  font-size: 10px;
  color: #aaa;
  transition: all 0.2s ease-in-out;
}

.queryBar >>> .ivu-cascader-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  line-height: 1;
  margin-top: -5px;
  font-size: 10px;
  color: #aaa;
  transition: all 0.2s ease-in-out;
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
</style>
