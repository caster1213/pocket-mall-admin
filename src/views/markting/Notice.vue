<template>
  <div>
    <div>
      <a-button @click="() => (noticeAddWindow = true)">添加</a-button>
    </div>
    <div class="components-form-demo-advanced-search">
      <div class="search-result-list">
        <a-table
          row-key="id"
          :columns="columns"
          :loading="loading"
          :data-source="data"
          :pagination="pagination"
          @change="onChange"
        >
          <template slot="action" slot-scope="val, row">
            <a-popconfirm @confirm="del(row.id)" title="确认删除当前公告？">
              <a>删除</a>
            </a-popconfirm>
            <a
              @click="
                () => {
                  noticeUpdateWindow = true;
                  currentRow = row;
                  updateNoticeForm.getFieldDecorator('title', {
                    initialValue: row.title,
                  });
                  updateNoticeForm.getFieldDecorator('content', {
                    initialValue: row.content,
                  });
                  updateNoticeForm.getFieldDecorator('id', {
                    initialValue: row.id,
                  });
                }
              "
              style="margin-left: 5px"
            >
              编辑</a>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      title="添加公告"
      :loading="loading"
      @cancel="() => (noticeAddWindow = false)"
      :visible="noticeAddWindow"
      @ok="add"
    >
      <a-form :form="addNoticeForm">
        <a-form-item
          :label-col="{ xs: { span: 24 }, sm: { span: 3 } }"
          :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
          label="标题"
        >
          <a-input
            v-decorator="[
              'title',
              { rules: [{ required: true, message: '必须填写标题' }] }]"
          ></a-input>
        </a-form-item>
        <a-form-item
          :label-col="{ xs: { span: 24 }, sm: { span: 3 } }"
          :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
          label="内容"
        >
          <a-textarea
            v-decorator="[
              'content',
              { rules: [{ required: true, message: '必须填写内容' }] },
            ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="编辑公告"
      :loading="loading"
      @cancel="() => (noticeUpdateWindow = false)"
      :visible="noticeUpdateWindow"
      @ok="update"
    >
      <a-form :form="updateNoticeForm">
        <a-form-item
          :label-col="{ xs: { span: 24 }, sm: { span: 3 } }"
          :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
          label="标题"
        >
          <a-input
            v-decorator="[
              'title',
              { rules: [{ required: true, message: '必须填写标题' }] },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item
          style="height: 100%"
          :label-col="{ xs: { span: 24 }, sm: { span: 3 } }"
          :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
          label="内容"
        >
          <a-textarea
            v-decorator="[
              'content',
              { rules: [{ required: true, message: '必须填写内容' }] },
            ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import NoticeService from "../../service/notice.service";

export default {
  name: "Notice",
  data() {
    return {
      queryForm: this.$form.createForm(this),
      addNoticeForm: this.$form.createForm(this),
      updateNoticeForm: this.$form.createForm(this),
      noticeAddWindow: false,
      noticeUpdateWindow: false,
      currentRow: null,
      loading: false,
      columns: [
        {
          title: "标题",
          dataIndex: "title",
        },
        {
          title: "内容",
          dataIndex: "content",
        },
        {
          title: "创建日期",
          dataIndex: "createDate",
          customRender(value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      data: [],
      pagination: {
        pageSizeOptions: ["15", "35", "50"],
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 15,
        defaultPageSize: 15,
        current: 1,
        showTotal: (total) => {
          let pageNum = Math.ceil(total / this.pagination.pageSize);
          return "共 " + pageNum + "页" + "/" + total + " 条数据";
        },
      },
    };
  },
  created() {
    this.load();
  },
  computed: {
    roleName() {
      return this.$store.state.role;
    },
  },
  methods: {
    query(e) {
      e.preventDefault()
      this.load()
    },
    reset() {
      this.queryForm.resetFields()
    },
    onChange(event) {
      this.pagination.current = event.current
      this.pagination.pageSize = event.pageSize
      this.load();
    },
    load() {
      let query = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      let input = this.queryForm.getFieldsValue();
      let value = Object.assign(query, input);
      this.loading = true;
      NoticeService.list(value).then((res) => {
        this.data = res.data.result.list;
        this.pagination.total = res.data.result.total;
        this.loading = false;
      });
    },
    add() {
      this.loading = true;
      this.addNoticeForm.validateFields((error, value) => {
        if (error != null) return;
        this.loading = true;
        let request = value;
        NoticeService.add(request).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("添加成功");
            this.load();
            this.noticeAddWindow = false;
          }
        });
      });
    },
    del(id) {
      NoticeService.del({ id: id }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.load();
        }
      });
    },
    update() {
      this.loading = true;
      this.updateNoticeForm.validateFields((error) => {
        if (error != null) return;
        this.loading = true;
        let request = this.updateNoticeForm.getFieldsValue();
        request.id = this.currentRow.id;
        NoticeService.update(request).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("更新成功");
            this.load();
            this.noticeUpdateWindow = false;
          }
        });
      });
    },
  },
};
</script>

<style scoped>
</style>
