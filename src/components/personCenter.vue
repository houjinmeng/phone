<template>
  <div style="text-align:center">
    <header class="header">
      <dl>
        <dd class="back per_icon">
          <i class="left_arrow"></i>
        </dd>
        <dt>个人中心</dt>
        <dd class="logOut">
          <router-link :to="'/'"><a href>首页</a></router-link>
        </dd>
      </dl>
    </header>
    <div class="section_content">
      <ul>
        <li style="background: #3896d6;">
          <router-link :to="'/check'"><a href>审核记录</a></router-link>
        </li>
        <li style="background: #c8af3c;">
          <router-link :to="'/myorder'"><a href>我的订单</a></router-link>
        </li>
        <li style="background: #3cbcc8;">
          <router-link :to="'/statistics'"><a href>投放统计</a></router-link>
        </li>
        <li style="background: #c8713c;">
          <router-link :to="'/marketing'"><a href>营销号统计</a></router-link>
        </li>
        <li style="background: #3cc884;">
          <router-link :to="'/puthistory'"><a href>投放历史</a></router-link>
        </li>
        <li style="background: #6a3cc8;">
          <router-link :to="'/bindphone'"><a href>绑定手机号</a></router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="less" scoped>
.section_content {
  background: #fff;
  margin-top: -0.1rem;
  height: 100%;
}
.section_content ul li {
  float: left;
  width: 0.975rem;
  height: 0.975rem;
  text-align: center;
  line-height: 0.975rem;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-left: 0.55rem;
  margin-top: 0.5rem;
  overflow: hidden;
  box-sizing: border-box;
}
.section_content ul li a {
  color: #fff;
}
</style>