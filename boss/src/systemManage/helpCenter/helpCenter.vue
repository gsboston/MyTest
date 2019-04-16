<template>
    <div class="container">
        <h1>帮助中心</h1>
        <div>
            <Menu :active-name="activeMenu" @on-select="changeView">
                <MenuGroup title="组织管理">
                    <MenuItem name="F0504">
                        组织信息完善
                    </MenuItem>
                    <MenuItem name="F0505">
                        组织管理设置
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="顾问上架管理">
                    <MenuItem name="F0552">
                        顾问上架管理
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="服务派单管理">
                    <MenuItem name="F0524">
                        服务商管理
                    </MenuItem>
                    <MenuItem name="F0527">
                        派单权限管理
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="服务接单管理">
                    <MenuItem name="F0525">
                        接单权限管理
                    </MenuItem>
                    <MenuItem name="F0526">
                        服务岗位设置
                    </MenuItem>
                </MenuGroup>
            </Menu>

            <div class="main-content">
                <compoment :is="activeCode"></compoment>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import orgInfoHelp from './helpCenterComponents/orgInfoHelp';
    import orgSettingHelp from './helpCenterComponents/orgSettingHelp';
    import AdviserGroundingHelp from './helpCenterComponents/AdviserGroundingHelp';
    import ServiceProviderHelp from './helpCenterComponents/ServiceProviderHelp';
    import ServiceSendPermissionHelp from './helpCenterComponents/ServiceSendPermissionHelp';
    import SinglePermissionsHelp from './helpCenterComponents/SinglePermissionsHelp';
    import ServicePostHelp from './helpCenterComponents/ServicePostHelp';

    export default {
        components: {
            orgInfoHelp,
            orgSettingHelp,
            AdviserGroundingHelp,
            ServiceProviderHelp,
            ServiceSendPermissionHelp,
            SinglePermissionsHelp,
            ServicePostHelp
        },
        data () {
            return {
                activeMenu: 'F0504',
                activeCode: 'orgInfoHelp',
                codeEnum: {
                    F0504: 'orgInfoHelp',
                    F0505: 'orgSettingHelp',
                    F0552: 'AdviserGroundingHelp',
                    F0524: 'ServiceProviderHelp',
                    F0527: 'ServiceSendPermissionHelp',
                    F0525: 'SinglePermissionsHelp',
                    F0526: 'ServicePostHelp',
                }
            }
        },
        props: {
            pageCode: {
                type: String,
                default: 'F0504'
            }
        },
        watch: {
            pageCode(val) {
                this.pageCode = val;
                this.activeMenu = val;
                this.changeView(val);
            }
        },
        created: function () {
            if (this.$route.query.pageCode) {
                this.activeMenu = this.$route.query.pageCode;
            }
        },
        methods: {
            changeView(name) {
                if (this.activeMenu) {
                    this.activeCode = this.codeEnum[name];
                }
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 20px;
        position: absolute;
        top: 20px;
        left: 25px;
        right: 25px;
        bottom: 20px;
        background: white;
        border-radius: 0;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: 5px 5px 10px #e0e0e0;
    }

    .container h1 {
        color: #6ac49e;
    }

    .container >>> .ivu-menu-item-group-title {
        color: #101010;
        font-size: 18px;
        font-weight: 600;
    }

    .container .ivu-menu-item {
        padding-left: 48px;
    }

    .container .ivu-menu-item-active {
        background: #f3f3f3;
        border-right: 2px solid #ccc !important;
    }

    .container .main-content {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 280px;
        right: 0;
        overflow-y: auto;
    }
</style>