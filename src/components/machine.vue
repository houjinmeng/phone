<template>
  <div style="text-align:center;width:100%">
    <header class="header">
      <dl>
        <dd class="back per_icon">
          <router-link :to="'/personcenter'">
            <i class="left_arrow" v-show="buy.token!==null"></i>
          </router-link>
        </dd>
        <dt>设备列表</dt>
        <dd class="logOut">
          <router-link :to="'/'"><a href>首页</a></router-link>
        </dd>
      </dl>
    </header>
    <!-- 中间表格 -->
    <div>
      <div id="btn">
        <el-button size="mini" @click="handleCheckAllChange">全选</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData.slice((currentPage - 1) * pagesize,currentPage * pagesize)"
        style="width: 100%;"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        :reserve-sleection="true"
      >
        <el-table-column type="selection" align="right"></el-table-column>
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="machine_name" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="address" label="设备地点" width align="center"></el-table-column>
        <el-table-column prop="count_down" label="剩余时长" align="center"></el-table-column>
      </el-table>
      <el-button id="shopping" size="small" @click="shopping">购买</el-button>
    </div>
    <!-- 数据分页展示 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="this.tot"
      :current-page="machineList.page"
      :page-size="10"
      :pager-count="7"
      small
    ></el-pagination>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getMachineList();
  },
  data() {
    return {
      // 点击购买要传的参
      buy: {
        token: window.sessionStorage.getItem("token"),
        machine_ids: ""
      },
      // 总记录数据条数
      tot: 10,
      // 获取列表数据要传的参
      machineList: {
        keywords: "",
        page: 1
      },
      // 接收设备列表数据
      tableData: [],
      checkAll: false,
      isIndeterminate: false,
      currentPage: 1,
      pagesize: 10,
      page: 1,
      // 接收选中设备id
      machine_id: []
    };
  },
  methods: {
    // 点击购买
    shopping() {
      if (this.buy.token == null) {
        this.$message.warning("请先登录账号");
        this.$router.push("/");
        return false;
      }
      this.buy.machine_ids = this.machine_id.join(",");
      if (this.buy.machine_ids.length == 0) {
        this.$message.warning("请先选择要投放的设备");
        return false;
      }
      this.$http.post("/buy", JSON.stringify(this.buy)).then(res => {
        if (res.data.status === 2) {
          this.$message.warning("请先绑定手机号！");
          this.$router.push("/bindphone");
        } else {
          window.sessionStorage.setItem("machine", JSON.stringify(res.data));
          this.$router.push("/submitOrder");
        }
      });
    },
    getRowKeys(row) {
      return row.number;
    },
    // 多选框回调事件
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.machine_id = [];
      } else {
        for (let i = 0; i < val.length; i++) {
          if (this.machine_id.indexOf(val[i].machine_id) === -1) {
            this.machine_id.push(val[i].machine_id);
          } else if (val.length !== this.machine_id.length) {
            this.machine_id = [];
            for (let i = 0; i < val.length; i++) {
              this.machine_id.push(val[i].machine_id);
            }
          }
        }
      }
      let vlength = val.length;
      this.checkAll = vlength === this.pagesize;
      this.isIndeterminate = vlength > 0 && vlength < this.pagesize;
    },
    // 点击全选
    handleCheckAllChange() {
      if (this.machine_id.length !== 0) {
        this.machine_id = [];
      }
      this.$refs.multipleTable.toggleAllSelection();
      this.isIndeterminate = false;
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      // arg: 变化后的当前页码值
      this.machineList.page = arg;
      // 根据变化后的页码重新获得数据
      this.getMachineList();
    },
    // 获取设备列表
    getMachineList() {
      this.machineList.keywords = this.$route.query.keywords;
      this.$http
        .post("/machine_list", JSON.stringify(this.machineList))
        .then(res => {
          this.tableData = res.data.data;
          this.tot = res.data.count;
        });
    }
  }
};
</script>
<style lang="less" scoped>
#btn {
  position: absolute;
  z-index: 1500;
  margin-left: 0.05rem;
  margin-top: 0.1rem;
  .el-button {
    background-color: #152743;
    color: #fff;
    width: 0.4rem;
    margin: 0;
    text-align: center;
    padding: 0.05rem
  }
}
// 购买按钮
#shopping {
  position: absolute;
  right: 0.3rem;
  background-color: #152743;
  color: #fff;
  width: 0.6rem;
  margin-top: 0.2rem;
}
.el-table {
  z-index: 0;
}
</style>