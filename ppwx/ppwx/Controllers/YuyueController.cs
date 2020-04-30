using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ppwx.Controllers
{
    public class YuyueController : Controller
    {
        // GET: Yuyue
      
            //
            // GET: /Yuyue/
            #region 主页面
            public ActionResult Index()
            {
                return View();
            }
            #endregion

            #region 日期页
            public ActionResult Bydate()
            {
                return View();
            }
            #endregion

            #region 按时间
            public ActionResult YBytime(string time)
            {

                JsonResult jr = new JsonResult();
                jr.Data = Bytime(time);//泛型集合
                System.Web.HttpContext.Current.Session["yytime"] = time;

                return jr;

            }
            public string Bytime(string time)
            {
                var ti = time;






                return ti;

            }
            #endregion

            #region 时间页
            public ActionResult ensure()
            {

                return View();
            }
            #endregion
            #region 记录医生
            public ActionResult redoc(string name)
            {

                JsonResult jr = new JsonResult();
                jr.Data = Byname(name);//泛型集合
                System.Web.HttpContext.Current.Session["docname"] = name;

                return jr;

            }
            public string Byname(string name)
            {
                var ti = name;






                return ti;

            }
            #endregion

        }
    
}