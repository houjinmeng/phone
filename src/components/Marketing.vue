<template>
  <div style="text-align:center">
    <header class="header">
      <dl>
        <dd class="back per_icon">
          <router-link :to="'/personcenter'">
            <i class="left_arrow"></i>
          </router-link>
        </dd>
        <dt>营销号统计</dt>
        <dd class="logOut">
          <router-link :to="'/'">
            <a href>首页</a>
          </router-link>
        </dd>
      </dl>
    </header>
    <!-- 搜索区域 -->
    <div class="rili">
      <div class="block" style>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="开始时间"
          value-format="timestamp"
          size="small"
          style="width:80%;"
          :editable="false"
        ></el-date-picker>
      </div>
      <span style="margin-top:0.05rem">至</span>
      <div class="block">
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="结束时间"
          value-format="timestamp"
          size="small"
          style="width:80%"
          :editable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <div class="searchbox">
      <el-input
        placeholder="设备名称"
        style="width:50%;margin-right:0.1rem"
        size="small"
        v-model="tableList.keyword.machine_name"
      ></el-input>
      <el-input
        placeholder="设备地点"
        style="width:50%"
        size="small"
        v-model="tableList.keyword.machine_address"
      ></el-input>
      <div>
        <el-button class="btn right" size="small" style="width:0.5rem;" @click="search">搜索</el-button>
      </div>
    </div>
    <!-- 列表区域 -->
    <ul id="liststyle">
      <li id="box" v-for="(item,k) in tableData" :key="k" @click="look(item)">
        <div class="left">{{k+1}}</div>
        <ul class="left" style="margin-right:">
          <li style="font-size:0.16rem;margin-top:25%;width:0.8rem;height:0.18rem;overflow:hidden">{{item.machine_name}}</li>
        </ul>
        <ul class="left">
          <li style="margin:0.05rem 0 0 0.3rem;width:1.8rem;height:0.18rem;overflow:hidden">{{item.address}}</li>
          <li
            style="margin:0.1rem 0 0 0.3rem"
          >{{item.start_time*1000|formatDate}}至{{item.end_time*1000|formatDate}}</li>
        </ul>
        <div class="right el-icon-arrow-right btnr"></div>
      </li>
    </ul>
    <!-- 数据分页展示 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="this.tot"
      :current-page="tableList.page"
      :page-size="10"
      :pager-count="7"
      small
    ></el-pagination>
  </div>
</template>
<script>
import { formatDate } from "../assets/js/date.js"; // 在组件中引用date.js
export default {
  mounted() {
    this.getList();
  },
  // 时间戳过滤器
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd"); // 年月日 格式自己定义   'yyyy : MM : dd'  例 2018年12月5日的格式
    },
    formatDateTwo(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd/hh:mm");
    }
  },
  data() {
    return {
      // 数据总条数
      tot: 10,
      // 限制投放结束日期
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < this.value1;
        }
      },
      // 选择日期
      value1: null,
      value2: null,
      // 获取订单列表所需参数
      tableList: {
        token: window.sessionStorage.getItem("token"),
        page: 1,
        keyword: {
          machine_name: "",
          end_time: "",
          machine_address: "",
          start_time: ""
        }
      },
      // 接收列表数据
      tableData: []
    };
  },
  methods: {
    // 投放详情
    look(uid) {
      this.$router.push({
        name: "marketingItem",
        params: {
          message: uid
        }
      });
    },
    // 获取表格数据
    getList() {
      this.$http
        .post("/ad_qrcode", JSON.stringify(this.tableList))
        .then(res => {
          this.tableData = res.data.data;
          this.tot = res.data.count;
        });
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      this.tableList.page = arg;
      // 根据变化后的页码重新获得数据
      this.getList();
    },
    // 按需搜所
    search() {
      if (this.value1 != null && this.value2 == null) {
        this.$message.warning("请选择投放结束日期");
        return false;
      } else if (this.value1 === null && this.value2 !== null) {
        this.$message.warning("请选择投放开始日期");
        return false;
      }
      this.tableList.keyword.start_time = this.value1 / 1000;
      this.tableList.keyword.end_time = this.value2 / 1000;
      if (this.value1 != null) {
        this.tableList.keyword.end_time = this.value2 / 1000 + 86399;
      }
      this.getList();
    }
  }
};
</script>
<style>
</style><style lang='less' scoped>
.searchbox {
  display: flex;
  justify-content: space-between;
  margin: 0.05rem 0;
  text-align: left;
  padding: 0 0.1rem 0.05rem;
}
// 列表样式
#liststyle {
  background-color: #fff;
  width: 100%;
  #box {
    width: 100%;
    // height: 0.8rem;
    overflow: hidden;
    border-bottom: 0.01rem solid #ccc;
    font-size: 0.1rem;
    ul {
      height: 100%;
      text-align: left;
      line-height: 0.2rem;
      margin-top: 0.1rem;
    }
    li {
      height: 100%;
    }
    div {
      width: 0.27rem;
      height: 100%;
      line-height: 0.8rem;
      font-size: 0.2rem;
    }
    .btnr {
      font-size: 0.3rem;
      color: #cacaca;
    }
  }
}
</style>