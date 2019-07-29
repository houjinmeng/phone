<template>
  <div style="text-align:center">
    <header class="header">
      <dl>
        <dd class="logOut">
          <router-link :to="'/'">
            <a href>首页</a>
          </router-link>
        </dd>
        <dt>审核记录</dt>
        <dd class="back per_icon">
          <router-link :to="'/personcenter'">
            <i class="left_arrow"></i>
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
    <div style="margin:0.05rem 0;text-align:left">
      <span style="margin-left:0.15rem">审核状态：</span>
      <el-select
        placeholder="请选择"
        v-model="tableList.keyword.status"
        style="width:1rem;margin-right:0.52rem"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="btn" size="small" @click="search">搜索</el-button>
    </div>
    <!-- 列表区域 -->
    <ul id="liststyle">
      <li id="box" v-for="(item,k) in tableData" :key="k" @click="checklook(item)">
        <div class="left">{{k+1}}</div>
        <ul class="left" style="margin-right:">
          <li
            style="font-size:0.14rem;width:1.2rem;height:0.18rem;overflow:hidden"
          >{{item.machine_name}}</li>
          <li>{{item.start_time*1000|formatDate}}至{{item.end_time*1000|formatDate}}</li>
        </ul>
        <ul class="left">
          <li
            style="font-size:0.14rem;width:1.7rem;height:0.18rem;overflow: hidden;"
          >{{item.machine_address}}</li>
          <li
            style="margin:0 0 0 0.55rem;width:0.6rem;height:0.26rem;background-color:#4a87da;color:#fff;text-align:center;line-height:0.26rem"
          >{{item.status}}</li>
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
  // 时间戳过滤器
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd"); // 年月日 格式自己定义   'yyyy : MM : dd'  例 2018年12月5日的格式
    },
    formatDateTwo(time) {
      var date = new Date(time);
      return formatDate(date, "hh:mm:ss"); // 时间点 例 21点12分12秒的格式
    }
  },
  mounted() {
    this.getCheckList();
  },
  data() {
    return {
      // 限制投放结束日期
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < this.value1;
        }
      },
      // 总记录数据条数
      tot: 10,
      // 接收日历值
      value1: null,
      value2: null,
      // 审核状态下拉框数据
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "审核驳回"
        },
        {
          value: "3",
          label: "审核成功"
        }
      ],
      // 获取订单列表所需参数
      tableList: {
        token: window.sessionStorage.getItem("token"),
        page: 1,
        keyword: {
          start_time: "",
          end_time: "",
          status: ""
        }
      },
      // 接收列表数据
      tableData: []
    };
  },
  methods: {
    // 点击查看审核详情
    checklook(uid) {
      const data = {
        token: this.tableList.token,
        check_id: uid.id
      };
      if (uid.status === "审核驳回") {
        this.cause = true;
      } else {
        this.cause = false;
      }
      this.$http.post("/check_detail", JSON.stringify(data)).then(res => {
        this.$router.push({
          name: "checkitem",
          params: {
            status: uid.status,
            message: res.data,
            check_id: uid.id
          }
        });
      });
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      this.tableList.page = arg;
      // 根据变化后的页码重新获得数据
      this.getCheckList();
    },
    // 获取审核列表数据
    getCheckList() {
      this.$http
        .post("/check_list", JSON.stringify(this.tableList))
        .then(res => {
          let data = res.data.data;
          data.forEach(e => {
            if (e.status === 0) {
              e.status = "待审核";
            } else if (e.status === 1) {
              e.status = "审核中";
            } else if (e.status === 2) {
              e.status = "审核驳回";
            } else {
              e.status = "审核成功";
            }
          });
          this.tableData = data;
          this.tot = res.data.count;
        });
    },
    // 按需搜所
    search() {
      if (this.value1 != null && this.value2 == null) {
        this.$message.warning("请选择投放结束日期");
        return false;
      } else if (this.value1 == null && this.value2 != null) {
        this.$message.warning("请选择投放开始日期");
        return false;
      }
      this.tableList.keyword.start_time = this.value1 / 1000;
      this.tableList.keyword.end_time = this.value2 / 1000;
      if (this.value1 != null) {
        this.tableList.keyword.end_time = this.value2 / 1000 + 86399;
      }
      this.getCheckList();
    }
  }
};
</script>
<style lang="less" scoped>
// 列表样式
#liststyle {
  background-color: #fff;
  width: 100%;
  #box {
    width: 100%;
    height: 1rem;
    border-bottom: 0.01rem solid #ccc;
    font-size: 0.1rem;
    ul {
      text-align: left;
      line-height: 0.2rem;
      margin-top: 0.25rem;
      li {
        margin-bottom: 0.1rem;
        overflow: hidden;
      }
    }
    div {
      width: 0.27rem;
      height: 100%;
      line-height: 1rem;
      font-size: 0.2rem;
    }
    .btnr {
      font-size: 0.3rem;
      color: #cacaca;
    }
  }
}
</style>
