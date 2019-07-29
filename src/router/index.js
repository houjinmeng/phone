import Vue from "vue";
import Router from "vue-router";
import home from "@/components/Home";
import personCenter from "@/components/personCenter";
import machine from "@/components/machine";
import bindphone from "@/components/bindPhone";
import myorder from "@/components/myOrder";
import orderitem from "@/components/orderItem";
import check from "@/components/check";
import checkitem from "@/components/checkItem";
import Statistics from "@/components/Statistics";
import StatisticsItem from "@/components/StatisticsItem";
import Marketing from "@/components/Marketing";
import MarketingItem from "@/components/MarketingItem";
import submitorder from "@/components/submitorder";
import puthistory from "@/components/putHistory";
import puthistoryItem from "@/components/putHistoryItem";

Vue.use(Router);

var router = new Router({
  routes: [
    { path: "/", component: home },
    {
      path: "/personCenter",
      meta: { requiresAuth: true },
      component: personCenter
    },
    { path: "/machine", component: machine },
    { path: "/bindphone", meta: { requiresAuth: true }, component: bindphone },
    { path: "/myorder", meta: { requiresAuth: true }, component: myorder },
    {
      path: "/orderitem",
      meta: { requiresAuth: true },
      name: "orderitem",
      component: orderitem
    },
    { path: "/check", meta: { requiresAuth: true }, component: check },
    {
      path: "/checkitem",
      meta: { requiresAuth: true },
      name: "checkitem",
      component: checkitem
    },
    {
      path: "/statistics",
      meta: { requiresAuth: true },
      component: Statistics
    },
    {
      path: "/statisticsItem",
      name: "statisticsItem",
      meta: { requiresAuth: true },
      component: StatisticsItem
    },
    { path: "/marketing", meta: { requiresAuth: true }, component: Marketing },
    {
      path: "/marketingItem",
      meta: { requiresAuth: true },
      name: "marketingItem",
      component: MarketingItem
    },
    {
      path: "/submitorder",
      meta: { requiresAuth: true },
      component: submitorder
    },
    {
      path: "/puthistory",
      meta: { requiresAuth: true },
      component: puthistory
    },
    {
      path: "/puthistoryItem",
      name: "puthistoryItem",
      meta: { requiresAuth: true },
      component: puthistoryItem
    }
  ]
});
// 给路由设置“导航守卫”
// 在守卫中对token进行监听，有token就让执行，否则跳转到登录页去
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 请求"login"就直接通过
    if (to.path === "/") {
      return next();
    }
    // 请求"非login"，就判断token
    var token = window.sessionStorage.getItem("token");
    if (!token) {
      return next("/");
    }
  }

  next(); // 请继续你的旅行
});
export default router;
