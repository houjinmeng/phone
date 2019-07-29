<template>
  <div>
    <header class="index_header">
      <input type="button" class="btn_login" value="登陆" @click="login" v-if="token==null">
      <router-link :to="'/personCenter'">
        <i class="person" v-if="token!==null"></i>
      </router-link>
      <div class="search_topCon">
        <h2>让广告投放更简单</h2>
        <input type="text" placeholder="请输入城市，设备名称，商场" class="search_txt" v-model="keywords">
      </div>
      <div class="search_listCon">
        <input
          type="button"
          class="btn_login"
          value="搜索"
          style="float: none; margin-left: .5rem;"
          @click="search"
        >
        <router-link :to="'/machine'">
          <input
            type="button"
            class="btn_login"
            value="默认列表"
            style="float: none; background: #2984bf; border: none;margin-left: .2rem;"
          >
        </router-link>
      </div>
    </header>

    <footer class="footer">
      <p>Copyright@2011-2019北京快乐平方有限公司版权所有</p>
    </footer>
  </div>
</template>

<script>
import "../assets/js/wxLogin.js";
export default {
  mounted() {
    if (window.sessionStorage.getItem("token") === null) {
      let data = {
        code: "",
        type: "wx_oauth"
      };
      data.code = this.getQueryString("code");
      if (data.code === null) {
        return false;
      } else {
        this.$http.post("/wx_login", JSON.stringify(data)).then(res => {
          // 通过浏览器的sessionStorage记录服务器返回的token信息
          window.sessionStorage.setItem("token", res.data.token);
          window.sessionStorage.setItem("user", res.data.nick);
          this.token = window.sessionStorage.getItem("token");
          if (res.data.status == 0) {
            this.$message.error(res.data.errmsg);
          } else if (res.data.status == 2) {
            this.$router.push("/bindphone");
          } else if (res.data.status == 1) {
            this.$message.success("登录成功！");
          }
        });
      }
    }
  },
  data() {
    return {
      showperson: false, // 个人中心logo
      showlogin: true, // 登录按钮
      keywords: "", // 搜索关键字
      token: null
    };
  },
  methods: {
    // 搜索
    search() {
      this.$router.push({
        path: "/machine",
        query: { keywords: this.keywords }
      });
    },
    // 截取code
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r !== null) return r[2];
      return null;
    },
    //  登录
    login() {
      this.$http.post("/wx_qrcode").then(res => {
        location.href = res.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.person {
  background: url("../assets/images/person_iconBg.png") no-repeat;
  background-size: contain;
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  float: right;
  margin-right: 0.2rem;
  margin-top: 0.15rem;
}
.index_header {
  background: url("../assets/images/index_topBg.png") no-repeat;
  background-size: contain;
  height: 3.06rem;
  overflow: hidden;
}
.btn_login {
  width: 1.16rem;
  height: 0.36rem;
  border: 2px solid #fff;
  font-size: 0.16rem;
  color: #fff;
  text-align: center;
  background: none;
  outline: none;
  float: right;
  margin-right: 0.2rem;
  margin-top: 0.15rem;
}
.search_topCon {
  margin-top: 1rem;
  text-align: center;
}
.search_topCon h2 {
  font-size: 0.2rem;
  color: #fff;
  letter-spacing: 0.06rem;
}
.search_txt {
  margin: 0.3rem 0.24rem 0;
  padding-left: 0.5rem;
  font-size: 0.16rem;
  color: #fff;
  border: 1px solid #bac0c8;
  height: 0.42rem;
  background: none;
  float: left;
  width: 88%;
  box-sizing: border-box;
}
.search_btnList {
  margin-top: 0.36rem;
}
</style>