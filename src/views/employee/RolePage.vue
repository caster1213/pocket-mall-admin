<template>
  <div class="p-container">
    <div class="p-box p-box-bg-gary">
      <a-row type="flex">
        <a-col class="role-box" span="5">
          <div class="row-input">
            <a-input-search placeholder="角色名称" />
          </div>
          <a-row type="flex" justify="center">
            <a-button @click="onAddRole" icon="plus" type="link">
              添加角色
            </a-button>
          </a-row>
          <div v-show="addRoleVisible" class="role-box-add">
            <a-input
              v-model="roleName"
              placeholder="输入角色名称"
              style="width: 60%"
            />
            <a-button
              :loading="loading.addRole"
              @click="onConfirmAddRole"
              type="link"
              >确认</a-button
            >
            <a-button
              v-show="loading.addRole === false"
              @click="onCancelAddRole"
              type="link"
              >取消</a-button
            >
          </div>
          <div class="role-list">
            <div
              @click="onRoleActive(role.roleId)"
              v-for="role in roles"
              :key="role.roleId"
              class="role-item"
            >
              <div class="c" :class="{ active: role.selected }">
                <span>{{ role.roleName }}</span>
                <div class="tool">
                  <a-button
                    @click.stop="onUpdateRole(role.roleId)"
                    :loading="loading.updateRole"
                    v-show="role.selected"
                    type="link"
                    >编辑
                  </a-button>
                  <a-popconfirm
                    @confirm="onDeleteRole(role.roleId)"
                    placement="rightTop"
                    title="确认删除该角色？"
                  >
                    <a-button
                      :loading="loading.delRole"
                      type="link"
                      v-show="role.selected"
                      class="del"
                      >删除
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col class="action-list" span="15">
          <div class="action-select">
            <div
              @click="onTabChange(1)"
              :class="{ 'action-select-option-action': resourceIndex === 1 }"
              class="action-select-option"
            >
              <span>页面权限</span>
            </div>
            <div
              @click="onTabChange(2)"
              :class="{ 'action-select-option-action': resourceIndex === 2 }"
              class="action-select-option"
            >
              <span>操作权限</span>
            </div>
            <div class="action-select-option">
              <span>数据权限</span>
            </div>
          </div>
          <div v-if="resourceIndex === 1" class="action-list-table">
            <a-table
              bordered
              size="small"
              :row-key="tableOption.rowKey"
              :row-selection="{
                selectedRowKeys: tableOption.selectedRowKeys,
                onChange: onSelectChange,
                onSelect: onTreeSelect,
              }"
              :data-source="tableOption.dataSource"
              :pagination="false"
              :columns="tableOption.columns"
            />
          </div>
          <div class="api-list-table" v-if="resourceIndex === 2">
            <a-checkbox-group v-model="apiOption.selectOptionKeys">
              <div
                v-for="module in apiOption.list"
                :key="module.moduleName"
                class="api-group"
              >
                <div class="api-group-title">{{ module.moduleName }}</div>
                <div class="api-select">
                  <div class="api-select-option">
                    <a-checkbox
                      v-for="api in module.apiList"
                      :key="api.id"
                      :value="api.id"
                    >
                      {{ api.name }}
                    </a-checkbox>
                  </div>
                </div>
              </div>
            </a-checkbox-group>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import PermissionService from "../../service/permission.service";
import constant from "../../common/constant";

export default {
  name: "RolePage",
  data() {
    return {
      roles: [],
      loading: {
        addRole: false,
        delRole: false,
        updateRole: false,
      },
      resourceIndex: 2,
      roleName: "",
      addRoleVisible: false,
      tableOption: {
        columns: [
          {
            title: "页面",
            dataIndex: "value",
            width: "260px",
          },
          {
            title: "元素",
          },
        ],
        rowKey: "id",
        dataSource: [],
        selectedRowKeys: [],
      },
      apiOption: {
        list: [],
        selectOptionKeys: [],
        mapping: [
          {
            key: "Order",
            name: "订单模块",
          },
          {
            key: "Goods",
            name: "商品模块",
          },
          {
            key: "Custom",
            name: "客户模块",
          },
          {
            key: "Finance",
            name: "财务模块",
          },
          {
            key: "Data",
            name: "数据模块",
          },
          {
            key: "Marketing",
            name: "营销模块",
          },
          {
            key: "Config",
            name: "配置模块",
          },
          {
            key: "Power",
            name: "权限模块",
          },
          {
            key: "Express",
            name: "配送模块",
          },
          {
            key: "Authority",
            name: "权限模块",
          },
        ],
      },
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      PermissionService.getRole().then((res) => {
        this.roles = [];
        this.roles = res.data.result.roles;
        for (let role of this.roles) {
          role.selected = false;
        }
        res.data.result.menus.forEach((ele) => {
          this.clearChildren(ele);
        });
        res.data.result.apis.forEach((ele) => {
          let index = this.apiOption.list.findIndex(
            (l) => l.moduleKey === ele.moduleName
          );
          if (index < 0) {
            let mapping = this.apiOption.mapping.find(
              (x) => x.key === ele.moduleName
            );
            this.apiOption.list.push({
              moduleKey: ele.moduleName,
              moduleName: mapping.name,
              apiList: [
                {
                  id: ele.id,
                  name: ele.name,
                },
              ],
            });
          } else {
            this.apiOption.list[index].apiList.push({
              id: ele.id,
              name: ele.name,
            });
          }
        });
        this.tableOption.dataSource = res.data.result.menus;
      });
    },
    onRoleActive(roleId) {
      for (let role of this.roles) {
        if (role.roleId === roleId) {
          role.selected = true;
          this.tableOption.selectedRowKeys = role.menus.map((ele) =>
            ele.id.toString()
          );
          this.apiOption.selectOptionKeys = role.apis.map((ele) => ele);
        } else {
          role.selected = false;
        }
      }
      this.roles = this.roles.map((ele) => ele);
    },
    onSelectChange(selectedRowKeys) {
      this.tableOption.selectedRowKeys = selectedRowKeys;
    },
    onTreeSelect(record, selected) {
      if (record.children) {
        if (selected) {
          //联动父节点选中状态
          this.setParentSelected(record.parentId);
          //联动子节点选中状态
          this.setChildSelected(record);
        } else {
          //联动取消子节点选中状态
          this.cancelChildNodeSelected(record);
          //联动取消父节点选中状态
          this.cancelParentNodeSelected(record.parentId);
        }
      } else {
        if (selected === false) {
          //取消联动父节点选中状态
          this.cancelParentNodeSelected(record.parentId);
        } else {
          //联动父节点选中状态
          this.setParentSelected(record.parentId);
        }
      }
    },
    onAddRole() {
      this.addRoleVisible = true;
    },
    onUpdateRole(roleId) {
      let updateKeys = this.tableOption.selectedRowKeys;
      let updateApiKes = this.apiOption.selectOptionKeys;
      if (updateKeys.length === 0) {
        this.$message.success("更新完成");
        return;
      }
      this.loading.updateRole = true;
      PermissionService.updateRole({
        roleId: roleId,
        menus: updateKeys.map((ele) => parseInt(ele)),
        apis: updateApiKes,
      })
        .then((res) => {
          if (res.data.code === constant.serviceCode.success) {
            this.loading.updateRole = false;
            this.$message.success("更新完成");
          } else {
            this.$message.success("修改失败 " + res.data.msg);
          }
        })
        .catch(() => {
          this.loading.updateRole = false;
        });
    },
    onCancelAddRole() {
      this.addRoleVisible = false;
      this.selectedRowKeys = [];
    },
    onConfirmAddRole() {
      if (this.tableOption.selectedRowKeys.length === 0) {
        this.$message.warning("请选择角色可操作页面");
        return;
      }
      if (this.apiOption.selectOptionKeys.length === 0) {
        this.$message.warning("请选择角色可操作权限");
        return;
      }
      this.loading.addRole = true;
      let req = {
        roleName: this.roleName,
        menuId: this.tableOption.selectedRowKeys,
        apiId: this.apiOption.selectOptionKeys,
      };
      PermissionService.addRole(req)
        .then((res) => {
          this.loading.addRole = false;
          if (res.data.code === constant.serviceCode.success) {
            this.$message.success("添加成功");
            this.roles.push(res.data.result);
            this.roleName = "";
            this.addRoleVisible = false;
            this.tableOption.selectedRowKeys = [];
          } else {
            this.$message.error(res.data.return.msg);
          }
        })
        .then(() => {
          this.loading.addRole = false;
        });
    },
    onDeleteRole(roleId) {
      this.loading.delRole = true;
      PermissionService.delRole({ roleId: roleId }).then((res) => {
        if (res.data.code === constant.serviceCode.success) {
          this.$message.success("删除成功");
          this.loading.delRole = false;
          this.tableOption.selectedRowKeys = [];
          let index = this.roles.findIndex((x) => x.roleId === roleId);
          this.roles.splice(index, 1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    clearChildren(node) {
      if (node.children.length > 0) {
        for (let child of node.children) {
          this.clearChildren(child);
        }
      } else {
        delete node.children;
      }
    },
    setParentSelected(id) {
      let node = this.findNode(id);
      if (node !== null) {
        let index = this.tableOption.selectedRowKeys.findIndex(
          (ele) => ele === id
        );
        if (index === -1) {
          this.tableOption.selectedRowKeys.push(node.id);
        }
        this.setParentSelected(node.parentId);
      }
    },
    setChildSelected(node) {
      if (node.children) {
        for (let child of node.children) {
          if (
            this.tableOption.selectedRowKeys.findIndex(
              (ele) => ele === child.id
            ) === -1
          ) {
            this.tableOption.selectedRowKeys.push(child.id);
          }
          this.setChildSelected(child);
        }
      }
    },
    cancelChildNodeSelected(node) {
      if (node.children) {
        for (let child of node.children) {
          let index = this.tableOption.selectedRowKeys.findIndex(
            (ele) => ele === child.id
          );
          if (index >= 0) {
            this.tableOption.selectedRowKeys.splice(index, 1);
          }
          this.cancelChildNodeSelected(child);
        }
      }
    },
    cancelParentNodeSelected(pid) {
      let node = this.findNode(pid);
      if (node === null) return;
      for (let child of node.children) {
        if (
          this.tableOption.selectedRowKeys.findIndex(
            (ele) => ele === child.id
          ) > -1
        ) {
          return;
        }
      }
      let index = this.tableOption.selectedRowKeys.findIndex(
        (ele) => ele === pid
      );
      this.tableOption.selectedRowKeys.splice(index, 1);
      this.cancelParentNodeSelected(node.parentId);
    },
    findNode(id) {
      let result = null;
      let func = (node, id) => {
        if (node.id === id) {
          result = node;
          return;
        }
        if (node.children) {
          for (let child of node.children) {
            func(child, id);
          }
        }
      };
      for (const root of this.tableOption.dataSource) {
        func(root, id);
      }
      return result;
    },
    onTabChange(index) {
      this.resourceIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.role-box {
  background-color: #ffffff;
  min-height: 600px;
  border-radius: 5px;

  .row-input {
    padding: 15px 15px 5px 15px;
  }

  .role-box-add {
    padding-left: 15px;

    & button {
      font-size: 12px;
      padding-right: 10px;
    }

    & input {
      font-size: 12px;
    }
  }

  .role-list {
    margin-top: 10px;
    width: 100%;
    overflow: auto;

    .role-item {
      height: 35px;
      font-size: 13px;
      line-height: 35px;
      width: 100%;

      .c {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: space-between;
      }

      .tool /deep/ .ant-btn-loading::before {
        background-color: transparent;
      }

      .del {
        font-size: 13px;
      }

      .active {
        background-color: #f2f2f6;
      }

      & :hover {
        background-color: #f2f2f6;
        cursor: pointer;
      }
    }
  }
}

.action-list {
  background-color: #ffffff;
  padding: 15px;
  min-height: 600px;
  border-radius: 5px;
  margin-left: 15px;

  .action-select {
    display: flex;

    .action-select-option {
      margin-right: 20px;
      font-size: 13px;

      & :hover {
        cursor: pointer;
      }
    }

    .action-select-option-action {
      color: #1890ff;
    }
  }

  .action-list-table {
    margin-top: 20px;

    & /deep/ .ant-table-column-title {
      color: #909399;
    }
  }

  .api-list-table {
    margin-top: 20px;

    .api-group {
      margin-bottom: 20px;

      .api-group-title {
        background-color: #f8f8f8;
        height: 30px;
        font-size: 13px;
        line-height: 30px;
        font-weight: 700;
        padding-left: 10px;
      }
    }

    .api-select {
      .api-select-option {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;

        :first-child {
          margin-left: 8px;
        }

        /deep/ .ant-checkbox-wrapper {
          height: 25px;
          width: 135px;
        }
      }
    }
  }
}
</style>
